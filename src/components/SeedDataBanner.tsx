import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database, Loader2 } from "lucide-react";

export const SeedDataBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkIfNeedsSeeding();
  }, []);

  const checkIfNeedsSeeding = async () => {
    // Verificar se há produtos no banco
    const { data, count } = await supabase
      .from("produto")
      .select("id", { count: "exact", head: true });

    // Mostrar banner se não houver produtos (ignorar localStorage em produção)
    if (!count || count === 0) {
      setShowBanner(true);
    }
  };

  const handleSeedData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("seed-data", {
        body: {},
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Dados de exemplo criados! Recarregando página...",
      });

      setShowBanner(false);
      
      // Recarregar a página após 1 segundo
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao popular dados. Tente novamente.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border-2 border-primary rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Bem-vindo ao Xepa Social!</h2>
            <p className="text-sm text-muted-foreground">Configure seu site em um clique</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm">
            Para começar a usar o site, precisamos popular o banco de dados com produtos de exemplo das padarias de Brasília.
          </p>
          <p className="text-sm font-medium text-primary">
            Isso inclui:
          </p>
          <ul className="text-sm space-y-1 ml-4">
            <li>✓ 3 padarias famosas de Brasília</li>
            <li>✓ 7 produtos variados com imagens</li>
            <li>✓ Usuários de exemplo prontos para teste</li>
          </ul>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSeedData}
            disabled={loading}
            className="flex-1"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando dados...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Criar Dados de Exemplo
              </>
            )}
          </Button>
        </div>
        
        <p className="text-xs text-center text-muted-foreground">
          Você poderá adicionar seus próprios produtos depois
        </p>
      </div>
    </div>
  );
};
