import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, LogOut } from "lucide-react";

interface Profile {
  nome: string;
  email: string;
  tipo_usuario: string;
  celular: string | null;
  endereco: string | null;
  cpf: number | null;
  cnpj: number | null;
  data_nasc: string | null;
  horario_funcionamento: string | null;
}

const Perfil = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      setProfile({
        ...data,
        email: session.user.email || "",
      });
    } catch (error: any) {
      console.error("Erro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o perfil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-1">
          <p className="text-center text-muted-foreground">Carregando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome</label>
                <p className="text-lg">{profile?.nome}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-lg">{profile?.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipo de Conta</label>
                <p className="text-lg capitalize">
                  {profile?.tipo_usuario === "vendedor" ? "Vendedor" : "Comprador"}
                </p>
              </div>

              {profile?.celular && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Celular</label>
                  <p className="text-lg">{profile.celular}</p>
                </div>
              )}

              {profile?.endereco && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Endereço</label>
                  <p className="text-lg">{profile.endereco}</p>
                </div>
              )}

              {profile?.cpf && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CPF</label>
                  <p className="text-lg">{profile.cpf}</p>
                </div>
              )}

              {profile?.cnpj && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CNPJ</label>
                  <p className="text-lg">{profile.cnpj}</p>
                </div>
              )}

              {profile?.data_nasc && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Nascimento</label>
                  <p className="text-lg">
                    {new Date(profile.data_nasc).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              )}

              {profile?.horario_funcionamento && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Horário de Funcionamento</label>
                  <p className="text-lg">{profile.horario_funcionamento}</p>
                </div>
              )}

              <div className="pt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Em breve",
                      description: "Funcionalidade de edição em desenvolvimento.",
                    });
                  }}
                >
                  Editar Perfil
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Perfil;
