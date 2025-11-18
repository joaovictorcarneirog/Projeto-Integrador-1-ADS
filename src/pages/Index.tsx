import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, Leaf, Truck, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Tomates Orgânicos",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1546470427-e26264be0b1d?w=400",
      category: "Hortaliça",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Alface Crespa",
      price: 5.50,
      image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400",
      category: "Hortaliça",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Morangos Frescos",
      price: 12.90,
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400",
      category: "Fruta",
      rating: 5.0,
    },
    {
      id: 4,
      name: "Cenouras Orgânicas",
      price: 6.50,
      image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400",
      category: "Hortaliça",
      rating: 4.7,
    },
  ];

  const features = [
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "100% Orgânico",
      description: "Produtos frescos direto dos produtores locais",
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Entrega Rápida",
      description: "Receba em casa no mesmo dia",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Qualidade Garantida",
      description: "Satisfação ou seu dinheiro de volta",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">AgriMarket</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">Início</Link>
            <Link to="/produtos" className="text-foreground hover:text-primary transition-colors">Produtos</Link>
            <Link to="/sobre" className="text-foreground hover:text-primary transition-colors">Sobre</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant="default" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              Entrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Alimentos Frescos Direto do Campo
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Conectamos você aos melhores produtores locais. Qualidade, frescor e sustentabilidade em cada entrega.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8">
              Ver Produtos
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8">
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Produtos em Destaque</h3>
          <p className="text-muted-foreground text-lg">Os mais frescos e saborosos desta semana</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group cursor-pointer border-0 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all hover:-translate-y-1 overflow-hidden">
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <span className="absolute top-2 left-2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold text-lg mb-2">{product.name}</h4>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-0 bg-gradient-to-r from-primary to-accent text-primary-foreground overflow-hidden relative">
          <CardContent className="p-12 text-center relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Faça Parte da Nossa Comunidade
            </h3>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Cadastre-se agora e receba ofertas exclusivas, além de apoiar produtores locais
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Criar Conta Grátis
            </Button>
          </CardContent>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">AgriMarket</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Conectando consumidores a produtores locais para uma alimentação mais saudável e sustentável.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produtos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Hortaliças</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Frutas</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Laticínios</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Grãos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Sobre Nós</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Como Funciona</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Produtores</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Central de Ajuda</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Política de Privacidade</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 AgriMarket. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
