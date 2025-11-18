import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Database } from "lucide-react";

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const popularDados = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("seed-data", {
        body: {},
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Dados de exemplo criados com sucesso!",
      });

      console.log("Resultado:", data);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao popular dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              Administração - Dados de Exemplo
            </CardTitle>
            <CardDescription>
              Popule o banco de dados com dados de exemplo para demonstração
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">O que será criado:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>3 padarias de Brasília (vendedores PJ)</li>
                <li>3 compradores (incluindo João Victor)</li>
                <li>6 produtos variados com imagens</li>
              </ul>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h3 className="font-semibold mb-2 text-primary">Credenciais de teste:</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium">Compradores:</p>
                  <p className="text-muted-foreground">Email: joaovictor@email.com</p>
                  <p className="text-muted-foreground">Email: maria.silva@email.com</p>
                  <p className="text-muted-foreground">Email: carlos.santos@email.com</p>
                </div>
                <div className="mt-3">
                  <p className="font-medium">Vendedores:</p>
                  <p className="text-muted-foreground">Email: contato@panificadorabrasileira.com</p>
                  <p className="text-muted-foreground">Email: contato@paodeacucar.com</p>
                  <p className="text-muted-foreground">Email: contato@padariadomercado.com</p>
                </div>
                <div className="mt-3">
                  <p className="font-medium">Todas as senhas:</p>
                  <p className="text-muted-foreground">senha123</p>
                </div>
              </div>
            </div>

            <Button
              onClick={popularDados}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Populando dados...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Popular Banco de Dados
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Esta ação criará usuários e produtos de exemplo. Use apenas em ambiente de desenvolvimento.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
