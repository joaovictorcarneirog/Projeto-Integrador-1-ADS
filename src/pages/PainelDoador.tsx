import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import {
  HandHeart, Sprout, Leaf, Plus, Pencil, Trash2, AlertCircle, Clock, FileText, ShieldCheck, Package,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Produto {
  id: number;
  nome: string;
  preco: number | string;
  quantidade: number;
  data_vencimento: string;
  imagem: string | null;
}

const PainelDoador = () => {
  const { role, userId, loading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [validation, setValidation] = useState<string>("pendente");
  const [rejection, setRejection] = useState<string | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    if (!loading && role !== "vendedor") navigate("/");
    if (role === "vendedor" && userId) load();
  }, [role, loading, userId]);

  const load = async () => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("validation_status, rejection_reason")
      .eq("id", userId!)
      .single();
    setValidation(profile?.validation_status || "pendente");
    setRejection(profile?.rejection_reason || null);

    const { data } = await supabase
      .from("produto")
      .select("id, nome, preco, quantidade, data_vencimento, imagem")
      .eq("fk_vendedor_id", userId!)
      .order("created_at", { ascending: false });
    setProdutos(data || []);
  };

  const remove = async (id: number) => {
    if (!confirm("Remover esta doação?")) return;
    const { error } = await supabase.from("produto").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Doação removida" });
    load();
  };

  if (loading) return null;

  const totalKg = produtos.reduce((acc, p) => acc + (p.quantidade || 0), 0);
  const refeicoes = totalKg * 3;
  const co2 = (totalKg * 2.5).toFixed(0);
  const doacoesGratis = produtos.filter((p) => Number(p.preco) === 0).length;

  return (
    <div className="min-h-screen flex flex-col bg-warm-grain">
      <Navbar />
      <main className="container mx-auto px-4 py-10 flex-1">
        <header className="mb-6">
          <span className="font-handwritten text-2xl text-accent">olá, doador ✦</span>
          <h1 className="text-4xl font-bold mt-1">Painel do Doador</h1>
        </header>

        {/* Status banner */}
        {validation === "pendente" && (
          <Card className="mb-6 border-2 border-highlight/40 bg-highlight/10">
            <CardContent className="p-5 flex items-start gap-4">
              <Clock className="h-6 w-6 text-highlight flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="font-bold mb-1">Cadastro em análise</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Envie seus documentos para que a equipe libere suas doações no catálogo.
                </p>
                <Link to="/meus-documentos">
                  <Button size="sm">
                    <FileText className="mr-2 h-4 w-4" /> Enviar documentos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
        {validation === "rejeitado" && (
          <Card className="mb-6 border-2 border-destructive/40 bg-destructive/10">
            <CardContent className="p-5 flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="font-bold mb-1">Cadastro rejeitado</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Motivo: {rejection || "não informado"}. Reenvie os documentos corrigidos.
                </p>
                <Link to="/meus-documentos">
                  <Button size="sm" variant="destructive">
                    <FileText className="mr-2 h-4 w-4" /> Reenviar documentos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
        {validation === "aprovado" && (
          <Card className="mb-6 border-2 border-primary/30 bg-primary/5">
            <CardContent className="p-4 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="text-sm">
                <span className="font-bold">Doador validado.</span> Suas doações aparecem para a comunidade.
              </p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="impacto">
          <TabsList>
            <TabsTrigger value="impacto">
              <Sprout className="mr-2 h-4 w-4" /> Meu impacto
            </TabsTrigger>
            <TabsTrigger value="gestao">
              <Package className="mr-2 h-4 w-4" /> Minhas doações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="impacto" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="border-2 border-foreground/5">
                <CardContent className="p-5">
                  <Leaf className="h-7 w-7 text-primary mb-2" />
                  <p className="text-3xl font-bold">{totalKg}<span className="text-sm font-normal opacity-60"> kg</span></p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">salvos por você</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-foreground/5">
                <CardContent className="p-5">
                  <HandHeart className="h-7 w-7 text-accent mb-2" />
                  <p className="text-3xl font-bold">{refeicoes}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">refeições potenciais</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-foreground/5">
                <CardContent className="p-5">
                  <Sprout className="h-7 w-7 text-primary mb-2" />
                  <p className="text-3xl font-bold">{co2}<span className="text-sm font-normal opacity-60"> kg</span></p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">CO₂ evitado</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-foreground/5">
                <CardContent className="p-5">
                  <Badge className="mb-2">Grátis</Badge>
                  <p className="text-3xl font-bold">{doacoesGratis}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">doações 100% grátis</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-primary/20 bg-card">
              <CardContent className="p-6 text-center">
                <p className="font-handwritten text-2xl text-accent mb-2">obrigado por participar ✦</p>
                <p className="text-muted-foreground mb-4">
                  Cada item que você publica salva comida do lixo e alimenta uma família.
                </p>
                <Link to="/cadastrar-produto">
                  <Button size="lg" className="rounded-full" disabled={validation !== "aprovado"}>
                    <Plus className="mr-2 h-5 w-5" /> Nova doação
                  </Button>
                </Link>
                {validation !== "aprovado" && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Disponível após validação do cadastro.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gestao" className="mt-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">Minhas doações ({produtos.length})</h2>
              <Link to="/cadastrar-produto">
                <Button disabled={validation !== "aprovado"}>
                  <Plus className="mr-2 h-4 w-4" /> Adicionar
                </Button>
              </Link>
            </div>
            {produtos.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                Você ainda não publicou nenhuma doação.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {produtos.map((p) => {
                  const isDoacao = p.preco === "0.00" || p.preco === "0";
                  return (
                    <Card key={p.id} className="overflow-hidden border-2 border-foreground/5 rounded-2xl">
                      <div className="aspect-video bg-muted">
                        {p.imagem && (
                          <img src={p.imagem} alt={p.nome} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-1">{p.nome}</h3>
                        <p className={`text-xl font-bold mb-2 ${isDoacao ? "text-accent" : "text-primary"}`}>
                          {isDoacao ? "Doação grátis" : `R$ ${p.preco}`}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          {p.quantidade} un • vence {new Date(p.data_vencimento).toLocaleDateString("pt-BR")}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/cadastrar-produto?id=${p.id}`)}>
                            <Pencil className="mr-1 h-3 w-3" /> Editar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => remove(p.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default PainelDoador;
