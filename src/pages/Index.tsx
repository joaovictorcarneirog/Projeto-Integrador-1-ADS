import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingBasket, Plus, MapPin, Sprout, Users, Apple, HandHeart, Search, MessageCircle, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProductMap from "@/components/ProductMap";
import heroDoacao from "@/assets/hero-doacao.jpg";
import alimentosResgatados from "@/assets/alimentos-resgatados.jpg";
import comunidadeFeira from "@/assets/comunidade-feira.jpg";

interface Product {
  id: number;
  nome: string;
  preco: string;
  descricao: string;
  data_vencimento: string;
  quantidade: number;
  imagem: string | null;
  vendedor_nome?: string;
  vendedor_celular?: string;
  latitude?: number;
  longitude?: number;
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
          profiles:fk_vendedor_id(nome, celular, latitude, longitude)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const productsWithImage = data?.map((p: any) => {
        // Converter BYTEA para string se necessário
        let imagemUrl = p.imagem;
        if (p.imagem && typeof p.imagem === 'object' && p.imagem.data) {
          // É um Buffer/BYTEA, converter para string
          imagemUrl = String.fromCharCode(...p.imagem.data);
        }
        
        return {
          ...p,
          imagem: imagemUrl,
          vendedor_nome: p.profiles?.nome || "Vendedor Desconhecido",
          vendedor_celular: p.profiles?.celular || "",
          latitude: p.profiles?.latitude,
          longitude: p.profiles?.longitude,
        };
      }) || [];

      setProducts(productsWithImage);
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

  const handleWhatsApp = (product: Product) => {
    if (!product.vendedor_celular) {
      toast({
        title: "Erro",
        description: "Vendedor não possui telefone cadastrado.",
        variant: "destructive",
      });
      return;
    }

    const celular = product.vendedor_celular.replace(/\D/g, '');
    const mensagem = encodeURIComponent(
      `Olá! Vi o produto *${product.nome}* no Xepa Social e gostaria de mais informações.`
    );
    const whatsappUrl = `https://wa.me/55${celular}?text=${mensagem}`;
    window.open(whatsappUrl, '_blank');
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero — Impacto */}
      <section className="bg-warm-grain border-b border-border">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-5">
                <Sprout className="h-4 w-4" /> Movimento Anti-Desperdício
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-5">
                Comida boa <span className="font-handwritten text-accent text-6xl md:text-7xl lg:text-8xl">não vira lixo.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Resgate alimentos prestes a vencer, doados por feirantes, padarias e vizinhos da sua região. Pague o que puder — ou nada.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="#produtos">
                  <Button size="lg" className="rounded-full px-7">
                    <HandHeart className="mr-2 h-5 w-5" /> Resgatar agora
                  </Button>
                </Link>
                <Link to="/quem-somos">
                  <Button size="lg" variant="outline" className="rounded-full px-7 border-foreground/20">
                    Como funciona
                  </Button>
                </Link>
              </div>
            </div>

            {/* Impact stats card */}
            <div className="relative">
              <div className="absolute -top-6 -left-4 font-handwritten text-accent text-2xl rotate-[-6deg]">
                nosso impacto ✦
              </div>
              <Card className="bg-card border-2 border-foreground/10 shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="p-8 grid grid-cols-2 gap-6">
                  <div>
                    <Apple className="h-8 w-8 text-accent mb-3" />
                    <p className="text-4xl font-bold text-foreground">{Math.max(products.length * 12, 0)}<span className="text-lg text-muted-foreground"> kg</span></p>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Alimento salvo</p>
                  </div>
                  <div>
                    <Users className="h-8 w-8 text-primary mb-3" />
                    <p className="text-4xl font-bold text-foreground">{products.length * 3}</p>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Refeições doadas</p>
                  </div>
                  <div>
                    <Sprout className="h-8 w-8 text-primary mb-3" />
                    <p className="text-4xl font-bold text-foreground">{(products.length * 2.5).toFixed(0)}<span className="text-lg text-muted-foreground"> kg</span></p>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">CO₂ evitado</p>
                  </div>
                  <div>
                    <HandHeart className="h-8 w-8 text-accent mb-3" />
                    <p className="text-4xl font-bold text-foreground">{products.length}</p>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Itens disponíveis</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="produtos" className="container mx-auto px-4 py-12 flex-1">
        <div className="grid md:grid-cols-12 gap-6">
          {/* Sidebar - Doador */}
          {isVendedor && (
            <div className="md:col-span-4">
              <Card className="sticky top-20 border-2 border-foreground/10 rounded-2xl">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-bold mb-1 text-center">Painel do Doador</h3>
                  <p className="text-xs text-center text-muted-foreground mb-4 font-handwritten text-base">
                    cada item conta ✦
                  </p>
                  <Link to="/cadastrar-produto">
                    <Button className="w-full rounded-full" size="lg">
                      <Plus className="mr-2 h-5 w-5" />
                      Doar / Ofertar item
                    </Button>
                  </Link>
                  <Link to="/meus-produtos">
                    <Button className="w-full rounded-full" variant="outline" size="lg">
                      Meus itens ofertados
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products Grid */}
          <div className={isVendedor ? "md:col-span-8" : "md:col-span-12"}>
            {/* Map Section */}
            {products.some(p => p.latitude && p.longitude) && (
              <div className="mb-10">
                <h3 className="text-3xl mb-4 flex items-center gap-2">
                  <MapPin className="h-7 w-7 text-accent" />
                  Onde resgatar perto de você
                </h3>
                <div className="rounded-2xl overflow-hidden border-2 border-foreground/10">
                  <ProductMap
                    products={products}
                    className="h-[300px] md:h-[400px]"
                  />
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <span className="font-handwritten text-2xl text-accent">disponíveis agora</span>
              <h3 className="text-3xl md:text-4xl">Resgate antes que vire desperdício</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const isDoacao = product.preco === "0.00" || product.preco === "0";
                return (
                <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all rounded-2xl border-2 border-foreground/5 group">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={product.imagem || "https://images.unsplash.com/photo-1506617564039-2f3b650b7b66?w=400"}
                      alt={product.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {isDoacao && (
                      <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <HandHeart className="h-3 w-3" /> Doação
                      </span>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h4 className="font-bold text-xl mb-1 leading-tight">{product.nome}</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      por <span className="font-semibold text-foreground">{product.vendedor_nome}</span>
                    </p>
                    <p className={`text-2xl font-bold mb-3 ${isDoacao ? 'text-accent font-handwritten text-3xl' : 'text-primary'}`}>
                      {isDoacao ? "Grátis ✦" : `R$ ${product.preco}`}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 pb-3 border-b border-border">
                      <span>Vence em {new Date(product.data_vencimento).toLocaleDateString("pt-BR")}</span>
                      <span>•</span>
                      <span>{product.quantidade} disponível</span>
                    </div>
                    <p className="text-sm mb-4 line-clamp-2 text-muted-foreground">{product.descricao}</p>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => addToFavorites(product.id)}
                        title="Salvar"
                        className="rounded-full"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => addToCart(product.id, product.preco)}
                        title="Adicionar à sacola"
                        className="rounded-full"
                      >
                        <ShoppingBasket className="h-4 w-4" />
                      </Button>
                      <Button
                        className="flex-1 rounded-full"
                        onClick={() => handleWhatsApp(product)}
                      >
                        {isDoacao ? "Resgatar" : "Combinar"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>

            {products.length === 0 && (
              <div className="text-center py-16">
                <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground text-lg">Ainda não há itens para resgatar. Volte em breve!</p>
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
