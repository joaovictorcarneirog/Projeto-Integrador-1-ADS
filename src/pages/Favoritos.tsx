import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

interface Product {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  data_vencimento: string;
  quantidade: number;
  imagem: string | null;
  vendedor_nome?: string;
}

const Favoritos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndFetchFavorites();
  }, []);

  const checkAuthAndFetchFavorites = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast({
        title: "Acesso Negado",
        description: "Você precisa estar logado.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setUserId(session.user.id);
    await fetchFavorites(session.user.id);
  };

  const fetchFavorites = async (clienteId: string) => {
    try {
      // Buscar favoritos do usuário
      const { data: favList } = await supabase
        .from("favoritos")
        .select("id")
        .eq("fk_cliente_id", clienteId)
        .maybeSingle();

      if (!favList) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Buscar produtos favoritos
      const { data, error } = await supabase
        .from("produto_favorito")
        .select(`
          produto:fk_produto_id (
            id,
            nome,
            preco,
            descricao,
            data_vencimento,
            quantidade,
            imagem,
            profiles:fk_vendedor_id(nome)
          )
        `)
        .eq("fk_favoritos_id", favList.id);

      if (error) throw error;

      const productsData = data?.map((item: any) => {
        const p = item.produto;
        let imagemUrl = p.imagem;
        if (p.imagem && typeof p.imagem === 'object' && p.imagem.data) {
          imagemUrl = String.fromCharCode(...p.imagem.data);
        }
        
        return {
          id: p.id,
          nome: p.nome,
          preco: p.preco,
          descricao: p.descricao,
          data_vencimento: p.data_vencimento,
          quantidade: p.quantidade,
          imagem: imagemUrl,
          vendedor_nome: p.profiles?.nome || "Vendedor Desconhecido",
        };
      }) || [];

      setProducts(productsData);
    } catch (error: any) {
      console.error("Erro ao buscar favoritos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus favoritos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (productId: number) => {
    try {
      const { data: favList } = await supabase
        .from("favoritos")
        .select("id")
        .eq("fk_cliente_id", userId)
        .single();

      if (!favList) return;

      const { error } = await supabase
        .from("produto_favorito")
        .delete()
        .eq("fk_produto_id", productId)
        .eq("fk_favoritos_id", favList.id);

      if (error) throw error;

      toast({
        title: "Removido!",
        description: "Produto removido dos favoritos.",
      });

      setProducts(products.filter(p => p.id !== productId));
    } catch (error: any) {
      console.error("Erro ao remover:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover dos favoritos.",
        variant: "destructive",
      });
    }
  };

  const addToCart = async (productId: number, preco: number) => {
    try {
      const { error } = await supabase
        .from("carrinho_produto")
        .upsert({
          fk_produto_id: productId,
          fk_cliente_id: userId,
          quantidade: 1,
          valor_total_item: preco,
        }, {
          onConflict: "fk_produto_id,fk_cliente_id",
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Produto adicionado ao carrinho.",
      });
    } catch (error: any) {
      console.error("Erro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar ao carrinho.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">Meus Favoritos</h1>

        {loading ? (
          <p className="text-center text-muted-foreground py-12">Carregando...</p>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Você ainda não favoritou nenhum produto.</p>
              <Button onClick={() => navigate("/")}>Ver Produtos</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={product.imagem || "https://images.unsplash.com/photo-1506617564039-2f3b650b7b66?w=400"}
                    alt={product.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.nome}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Por: {product.vendedor_nome}
                  </p>
                  <p className="text-2xl font-bold text-primary mb-2">
                    {product.preco === 0 ? "Grátis" : `R$ ${product.preco.toFixed(2)}`}
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">
                    Validade: {new Date(product.data_vencimento).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Quantidade: {product.quantidade}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addToCart(product.id, product.preco)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Carrinho
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFromFavorites(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Favoritos;
