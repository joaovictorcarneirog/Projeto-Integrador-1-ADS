import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Leaf } from "lucide-react";

const Cadastro = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-background py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2">
            {/* Left Side */}
            <div className="bg-primary text-primary-foreground p-8 flex flex-col justify-center items-center text-center">
              <Leaf className="h-20 w-20 mb-4" />
              <h2 className="text-3xl font-bold mb-4">Economize e Combata o Desperdício</h2>
              <p className="mb-6">Escolha o tipo de cadastro ideal para você:</p>
            </div>

            {/* Right Side - Escolha */}
            <div className="p-8 flex flex-col justify-center">
              <div className="mb-6">
                <Link to="/">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <h2 className="text-2xl font-bold mt-4">Bem-vindo ao Xepa Social</h2>
                <p className="text-muted-foreground">Selecione uma opção abaixo</p>
              </div>

              <div className="space-y-4">
                <Link to="/cadastro-pf">
                  <Card className="cursor-pointer hover:border-primary transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Leaf className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2">Quero Comprar Produtos</h3>
                          <p className="text-muted-foreground text-sm">
                            Cadastre-se como Pessoa Física (CPF) para comprar produtos com desconto e economizar.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/cadastro-pj">
                  <Card className="cursor-pointer hover:border-primary transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Leaf className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2">Quero Vender Produtos</h3>
                          <p className="text-muted-foreground text-sm">
                            Cadastre-se como Pessoa Jurídica (CNPJ) para vender produtos e evitar desperdícios.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Já tem conta?{" "}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Faça login
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cadastro;
