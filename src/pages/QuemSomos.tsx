import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Users, Target, Heart } from "lucide-react";

const QuemSomos = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Quem Somos</h1>
          
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-muted-foreground text-center mb-8">
              O Xepa Social é uma plataforma que conecta vendedores locais a consumidores conscientes, 
              combatendo o desperdício de alimentos e promovendo economia e sustentabilidade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Nossa Missão</h3>
                <p className="text-muted-foreground">
                  Combater o desperdício de alimentos conectando produtores e consumidores de forma 
                  eficiente e sustentável.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Nossos Valores</h3>
                <p className="text-muted-foreground">
                  Sustentabilidade, economia solidária, transparência e comprometimento com o 
                  meio ambiente.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                    <Leaf className="h-10 w-10" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">Faça Parte da Mudança</h3>
                  <p className="text-primary-foreground/90">
                    Juntos podemos fazer a diferença! Cada compra na Xepa Social é um passo 
                    em direção a um futuro mais sustentável e justo.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div>
              <Users className="h-12 w-12 text-primary mx-auto mb-3" />
              <h4 className="font-bold text-2xl mb-1">1000+</h4>
              <p className="text-muted-foreground">Usuários Ativos</p>
            </div>
            <div>
              <Leaf className="h-12 w-12 text-primary mx-auto mb-3" />
              <h4 className="font-bold text-2xl mb-1">5000+</h4>
              <p className="text-muted-foreground">Produtos Vendidos</p>
            </div>
            <div>
              <Heart className="h-12 w-12 text-primary mx-auto mb-3" />
              <h4 className="font-bold text-2xl mb-1">2 Ton</h4>
              <p className="text-muted-foreground">Alimentos Salvos</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QuemSomos;
