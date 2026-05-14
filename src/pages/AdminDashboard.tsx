import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { Users, ShieldCheck, Clock, XCircle, FileCheck2, Eye, CheckCircle2, Ban } from "lucide-react";

interface PendingDonor {
  id: string;
  nome: string;
  tipo_usuario: string;
  validation_status: string;
  created_at: string;
  rejection_reason: string | null;
  documents: { id: string; doc_type: string; file_path: string; status: string }[];
}

const docLabels: Record<string, string> = {
  rg_cnh: "RG/CNH",
  comprovante_endereco: "Comprovante de Endereço",
  selfie: "Selfie com documento",
};

const AdminDashboard = () => {
  const { role, loading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({ total: 0, ativos: 0, pendentes: 0, rejeitados: 0 });
  const [donors, setDonors] = useState<PendingDonor[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (!loading && role !== "admin") {
      navigate("/");
    }
    if (role === "admin") fetchAll();
  }, [role, loading, navigate]);

  const fetchAll = async () => {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, nome, tipo_usuario, validation_status, created_at, rejection_reason")
      .eq("tipo_usuario", "vendedor")
      .order("created_at", { ascending: false });

    const all = profiles || [];
    setStats({
      total: all.length,
      ativos: all.filter((p) => p.validation_status === "aprovado").length,
      pendentes: all.filter((p) => p.validation_status === "pendente").length,
      rejeitados: all.filter((p) => p.validation_status === "rejeitado").length,
    });

    const ids = all.map((p) => p.id);
    const { data: docs } = ids.length
      ? await supabase.from("vendor_documents").select("*").in("user_id", ids)
      : { data: [] as any[] };

    const merged: PendingDonor[] = all.map((p: any) => ({
      ...p,
      documents: (docs || []).filter((d: any) => d.user_id === p.id),
    }));
    setDonors(merged);
  };

  const viewDoc = async (path: string) => {
    if (signedUrls[path]) {
      window.open(signedUrls[path], "_blank");
      return;
    }
    const { data, error } = await supabase.storage.from("documentos").createSignedUrl(path, 300);
    if (error || !data) {
      toast({ title: "Erro", description: "Não foi possível abrir o documento.", variant: "destructive" });
      return;
    }
    setSignedUrls((s) => ({ ...s, [path]: data.signedUrl }));
    window.open(data.signedUrl, "_blank");
  };

  const decide = async (donor: PendingDonor, status: "aprovado" | "rejeitado", reason?: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase
      .from("profiles")
      .update({
        validation_status: status,
        validated_at: new Date().toISOString(),
        validated_by: session?.user.id,
        rejection_reason: status === "rejeitado" ? reason || "Sem motivo informado" : null,
      })
      .eq("id", donor.id);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: status === "aprovado" ? "Doador aprovado" : "Cadastro rejeitado" });
    setRejectReason("");
    fetchAll();
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="container mx-auto px-4 py-10 flex-1">
        <header className="mb-8">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Administração</span>
          <h1 className="text-4xl font-bold mt-1">Painel de validação</h1>
          <p className="text-muted-foreground mt-2">Aprove os doadores e acompanhe a saúde da rede.</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Cadastrados", val: stats.total, icon: Users, color: "text-foreground" },
            { label: "Ativos", val: stats.ativos, icon: ShieldCheck, color: "text-primary" },
            { label: "Pendentes", val: stats.pendentes, icon: Clock, color: "text-highlight" },
            { label: "Rejeitados", val: stats.rejeitados, icon: XCircle, color: "text-destructive" },
          ].map((s) => (
            <Card key={s.label} className="border-2 border-foreground/5">
              <CardContent className="p-5">
                <s.icon className={`h-6 w-6 ${s.color} mb-3`} />
                <p className="text-3xl font-bold">{s.val}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="pendentes">
          <TabsList>
            <TabsTrigger value="pendentes">Pendentes ({stats.pendentes})</TabsTrigger>
            <TabsTrigger value="aprovados">Aprovados ({stats.ativos})</TabsTrigger>
            <TabsTrigger value="rejeitados">Rejeitados ({stats.rejeitados})</TabsTrigger>
          </TabsList>

          {(["pendentes", "aprovados", "rejeitados"] as const).map((tab) => {
            const filterStatus = tab === "pendentes" ? "pendente" : tab === "aprovados" ? "aprovado" : "rejeitado";
            const list = donors.filter((d) => d.validation_status === filterStatus);
            return (
              <TabsContent key={tab} value={tab} className="mt-6 space-y-4">
                {list.length === 0 && (
                  <p className="text-center text-muted-foreground py-12">Nenhum doador nesta categoria.</p>
                )}
                {list.map((d) => (
                  <Card key={d.id} className="border-2 border-foreground/5">
                    <CardContent className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{d.nome}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            Cadastrado em {new Date(d.created_at).toLocaleDateString("pt-BR")}
                          </p>
                          {d.rejection_reason && (
                            <p className="text-xs text-destructive mt-2">Motivo: {d.rejection_reason}</p>
                          )}
                        </div>
                        <Badge
                          variant={
                            d.validation_status === "aprovado"
                              ? "default"
                              : d.validation_status === "rejeitado"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {d.validation_status}
                        </Badge>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-3 mb-4">
                        {["rg_cnh", "comprovante_endereco", "selfie"].map((dt) => {
                          const doc = d.documents.find((x) => x.doc_type === dt);
                          return (
                            <div
                              key={dt}
                              className="border-2 border-dashed border-foreground/10 rounded-xl p-3 flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0">
                                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                                  {docLabels[dt]}
                                </p>
                                <p className="text-sm font-medium truncate">
                                  {doc ? "Enviado" : "Não enviado"}
                                </p>
                              </div>
                              {doc && (
                                <Button size="icon" variant="outline" onClick={() => viewDoc(doc.file_path)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {tab === "pendentes" && (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={() => decide(d, "aprovado")}
                            disabled={d.documents.length < 3}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Aprovar
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="destructive">
                                <Ban className="mr-2 h-4 w-4" /> Rejeitar
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Motivo da rejeição</DialogTitle>
                              </DialogHeader>
                              <Textarea
                                placeholder="Documento ilegível, dados não conferem..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                              />
                              <Button
                                variant="destructive"
                                onClick={() => decide(d, "rejeitado", rejectReason)}
                                disabled={!rejectReason.trim()}
                              >
                                Confirmar rejeição
                              </Button>
                            </DialogContent>
                          </Dialog>
                          {d.documents.length < 3 && (
                            <p className="text-xs text-muted-foreground self-center">
                              <FileCheck2 className="h-3 w-3 inline mr-1" />
                              Aguardando todos os documentos
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            );
          })}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
