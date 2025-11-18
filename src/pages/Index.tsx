import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SeedDataBanner } from "@/components/SeedDataBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Heart, ShoppingCart, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { byteaToString } from "@/lib/supabase-utils";
import { getProductImageUrl } from "@/lib/product-images";

interface Product {
  id: number;
  nome: string;
  preco: string;
  descricao: string;
  data_vencimento: string;
  quantidade: number;
  imagem: string | null;
  vendedor_nome?: string;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isVendedor, setIsVendedor] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    fetchProducts();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUserId(session.user.id);
      
      // Buscar perfil do usuário
      const { data: profile } = await supabase
        .from("profiles")
        .select("tipo_usuario")
        .eq("id", session.user.id)
        .single();
      
      setIsVendedor(profile?.tipo_usuario === "vendedor");
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("produto")
        .select(`
          *,
          profiles:fk_vendedor_id(nome)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const productsWithImageConverted = data?.map((p: any) => ({
        ...p,
        imagem: byteaToString(p.imagem),
        vendedor_nome: p.profiles?.nome || "Vendedor",
      })) || [];

      setProducts(productsWithImageConverted);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    }
  };

  const addToCart = async (productId: number, preco: string) => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    try {
      const valorTotal = parseFloat(preco);
      
      const { error } = await supabase
        .from("carrinho_produto")
        .upsert({
          fk_produto_id: productId,
          fk_cliente_id: userId,
          quantidade: 1,
          valor_total_item: valorTotal,
        }, {
          onConflict: "fk_produto_id,fk_cliente_id",
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Produto adicionado ao carrinho.",
      });
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar ao carrinho.",
        variant: "destructive",
      });
    }
  };

  const addToFavorites = async (productId: number) => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    try {
      // Primeiro, garantir que o usuário tem uma lista de favoritos
      const { data: favList, error: favError } = await supabase
        .from("favoritos")
        .select("id")
        .eq("fk_cliente_id", userId)
        .maybeSingle();

      let favoritosId = favList?.id;

      if (!favoritosId) {
        const { data: newFav, error: createError } = await supabase
          .from("favoritos")
          .insert({ fk_cliente_id: userId })
          .select("id")
          .single();

        if (createError) throw createError;
        favoritosId = newFav.id;
      }

      // Adicionar produto aos favoritos
      const { error } = await supabase
        .from("produto_favorito")
        .insert({
          fk_produto_id: productId,
          fk_favoritos_id: favoritosId,
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Aviso",
            description: "Produto já está nos favoritos.",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Sucesso!",
        description: "Produto adicionado aos favoritos.",
      });
    } catch (error) {
      console.error("Erro ao adicionar aos favoritos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar aos favoritos.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsApp = (product: Product) => {
    const message = encodeURIComponent(`Olá! Tenho interesse no produto: ${product.nome} - R$ ${product.preco}`);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <SeedDataBanner />

      {/* Hero Carousel */}
      <section className="bg-secondary">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            <CarouselItem>
              <div className="h-[250px] md:h-[380px] lg:h-[460px] bg-gradient-to-r from-primary to-accent flex items-center justify-center text-primary-foreground">
                <div className="text-center px-4">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">Ofertas Fresquinhas</h2>
                  <p className="text-lg md:text-xl">Economize e ajude o meio ambiente</p>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="h-[250px] md:h-[380px] lg:h-[460px] bg-gradient-to-r from-primary/90 to-accent/90 flex items-center justify-center text-primary-foreground">
                <div className="text-center px-4">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">Economize sem Desperdiçar</h2>
                  <p className="text-lg md:text-xl">Produtos de qualidade por preços acessíveis</p>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="h-[250px] md:h-[380px] lg:h-[460px] bg-gradient-to-r from-primary/80 to-accent/80 flex items-center justify-center text-primary-foreground">
                <div className="text-center px-4">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">Sabor e Sustentabilidade</h2>
                  <p className="text-lg md:text-xl">Faça parte dessa mudança</p>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="grid md:grid-cols-12 gap-6">
          {/* Sidebar - Add Product (Vendors Only) */}
          {isVendedor && (
            <div className="md:col-span-4">
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-center">Adicionar Produto</h3>
                  <Link to="/cadastrar-produto">
                    <Button className="w-full" size="lg">
                      <Plus className="mr-2 h-5 w-5" />
                      Adicionar Produto
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products Grid */}
          <div className={isVendedor ? "md:col-span-8" : "md:col-span-12"}>
            <h3 className="text-2xl font-bold mb-6 text-center">Produtos Disponíveis</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const imageUrl = getProductImageUrl(product.imagem);
                
                return (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img
                      src={imageUrl}
                      alt={product.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-lg flex-1">{product.nome}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <span className="font-medium">Por:</span> {product.vendedor_nome}
                    </p>
                    <p className="text-2xl font-bold text-primary mb-2">
                      {product.preco === "0.00" || product.preco === "0" ? "Grátis" : `R$ ${product.preco}`}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Validade:</strong>{" "}
                      {new Date(product.data_vencimento).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Quantidade:</strong> {product.quantidade}
                    </p>
                    <p className="text-sm mb-4 line-clamp-2">{product.descricao}</p>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => addToFavorites(product.id)}
                        title="Adicionar aos favoritos"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => addToCart(product.id, product.preco)}
                        title="Adicionar ao carrinho"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => handleWhatsApp(product)}
                      >
                        Falar com Vendedor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
              })}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Nenhum produto disponível no momento.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
