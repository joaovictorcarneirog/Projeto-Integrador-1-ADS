import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { Upload, CheckCircle2, Clock, XCircle, FileText } from "lucide-react";

type DocType = "rg_cnh" | "comprovante_endereco" | "selfie";

const docs: { type: DocType; label: string; desc: string }[] = [
  { type: "rg_cnh", label: "RG ou CNH", desc: "Foto frente e verso, legível, sem reflexos." },
  { type: "comprovante_endereco", label: "Comprovante de endereço", desc: "Conta de luz, água ou similar (últimos 90 dias)." },
  { type: "selfie", label: "Selfie segurando documento", desc: "Seu rosto e o documento visíveis na mesma foto." },
];

interface DocRow {
  id: string;
  doc_type: string;
  status: string;
  file_path: string;
  rejection_reason: string | null;
}

const MeusDocumentos = () => {
  const { role, userId, loading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rows, setRows] = useState<DocRow[]>([]);
  const [uploading, setUploading] = useState<DocType | null>(null);

  useEffect(() => {
    if (!loading && role !== "vendedor") navigate("/");
    if (userId) load();
  }, [role, loading, userId]);

  const load = async () => {
    const { data } = await supabase
      .from("vendor_documents")
      .select("*")
      .eq("user_id", userId!)
      .order("created_at", { ascending: false });
    setRows(data || []);
  };

  const upload = async (type: DocType, file: File) => {
    if (!userId) return;
    setUploading(type);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${type}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("documentos").upload(path, file);
      if (upErr) throw upErr;

      // Remove existing pendente/rejeitado for this type
      await supabase
        .from("vendor_documents")
        .delete()
        .eq("user_id", userId)
        .eq("doc_type", type);

      const { error: insErr } = await supabase.from("vendor_documents").insert({
        user_id: userId,
        doc_type: type,
        file_path: path,
        status: "pendente",
      });
      if (insErr) throw insErr;

      // Reset profile validation to pendente if user resubmits
      await supabase
        .from("profiles")
        .update({ validation_status: "pendente", rejection_reason: null })
        .eq("id", userId);

      toast({ title: "Documento enviado", description: "Aguarde a análise da equipe." });
      load();
    } catch (e: any) {
      toast({ title: "Erro no envio", description: e.message, variant: "destructive" });
    } finally {
      setUploading(null);
    }
  };

  const latestFor = (type: DocType) => rows.find((r) => r.doc_type === type);

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col bg-warm-grain">
      <Navbar />
      <main className="container mx-auto px-4 py-10 flex-1 max-w-3xl">
        <header className="mb-8">
          <span className="font-handwritten text-2xl text-accent">validação ✦</span>
          <h1 className="text-4xl font-bold mt-1">Meus documentos</h1>
          <p className="text-muted-foreground mt-2">
            Envie os 3 documentos abaixo para liberar suas doações no catálogo.
          </p>
        </header>

        <div className="space-y-4">
          {docs.map((d) => {
            const row = latestFor(d.type);
            return (
              <Card key={d.type} className="border-2 border-foreground/5">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-lg">{d.label}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{d.desc}</p>
                    </div>
                    {row && (
                      <Badge
                        variant={
                          row.status === "aprovado"
                            ? "default"
                            : row.status === "rejeitado"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {row.status === "aprovado" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {row.status === "pendente" && <Clock className="h-3 w-3 mr-1" />}
                        {row.status === "rejeitado" && <XCircle className="h-3 w-3 mr-1" />}
                        {row.status}
                      </Badge>
                    )}
                  </div>

                  {row?.rejection_reason && (
                    <p className="text-xs text-destructive mb-3">Motivo: {row.rejection_reason}</p>
                  )}

                  <label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      disabled={uploading !== null}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) upload(d.type, f);
                      }}
                    />
                    <Button asChild variant="outline" disabled={uploading !== null}>
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading === d.type
                          ? "Enviando..."
                          : row
                            ? "Reenviar"
                            : "Enviar arquivo"}
                      </span>
                    </Button>
                  </label>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MeusDocumentos;
