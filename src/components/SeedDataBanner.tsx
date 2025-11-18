import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database, Loader2, X } from "lucide-react";

export const SeedDataBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkIfNeedsSeeding();
  }, []);

  const checkIfNeedsSeeding = async () => {
    const dismissed = localStorage.getItem("seed-banner-dismissed");
    if (dismissed) return;

    const { data } = await supabase
      .from("produto")
      .select("id", { count: "exact", head: true });

    if (!data || data.length === 0) {
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
        description: "Dados de exemplo criados! Recarregue a página para ver os produtos.",
      });

      setShowBanner(false);
      localStorage.setItem("seed-banner-dismissed", "true");
      
      // Recarregar a página após 2 segundos
      setTimeout(() => window.location.reload(), 2000);
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

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("seed-banner-dismissed", "true");
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <Alert className="bg-primary/10 border-primary/20">
        <Database className="h-4 w-4 text-primary" />
        <AlertTitle className="flex items-center justify-between">
          <span>Banco de dados vazio</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertTitle>
        <AlertDescription className="space-y-3">
          <p className="text-sm">
            Parece que não há produtos cadastrados. Deseja popular o banco com dados de exemplo?
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleSeedData}
              disabled={loading}
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Populando...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-3 w-3" />
                  Popular Dados
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              size="sm"
            >
              Não, obrigado
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
