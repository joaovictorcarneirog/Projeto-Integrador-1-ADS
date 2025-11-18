import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Heart, ShoppingCart, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  nome: string;
  preco: string;
  descricao: string;
  imagem_url: string;
  data_vencimento: string;
  quantidade: number;
  telefone_vendedor: string;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isVendedor, setIsVendedor] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    setIsVendedor(userType === "vendedor");
    
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/produtos");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const addToCart = async (productId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/adicionar/carrinho/${productId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Produto adicionado ao carrinho.",
        });
      } else if (response.status === 401) {
        window.location.href = "/login";
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar ao carrinho.",
        variant: "destructive",
      });
    }
  };

  const addToFavorites = async (productId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/adicionar/favoritos/${productId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Produto adicionado aos favoritos.",
        });
      } else if (response.status === 401) {
        window.location.href = "/login";
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar aos favoritos.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsApp = (phone: string, productName: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const message = encodeURIComponent(`Olá! Tenho interesse no produto: ${productName}`);
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

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
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img
                      src={product.imagem_url || "https://via.placeholder.com/400x300?text=Sem+Imagem"}
                      alt={product.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-lg mb-2">{product.nome}</h4>
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
                        onClick={() => addToCart(product.id)}
                        title="Adicionar ao carrinho"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => handleWhatsApp(product.telefone_vendedor, product.nome)}
                      >
                        Falar com Vendedor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
