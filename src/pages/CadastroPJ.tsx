import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cadastroPJSchema } from "@/lib/validation";

const CadastroPJ = () => {
  const [formData, setFormData] = useState({
    nomeEmpresa: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cpf: "",
    cnpj: "",
    celular: "",
    endereco: "",
    horario_funcionamento: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar com Zod
    const validacao = cadastroPJSchema.safeParse(formData);
    
    if (!validacao.success) {
      const primeiroErro = validacao.error.issues[0];
      toast({
        title: "Erro de Validação",
        description: primeiroErro.message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Remover formatação do CPF e CNPJ (deixar apenas números)
      const cpfLimpo = formData.cpf ? formData.cpf.replace(/\D/g, '') : undefined;
      const cnpjLimpo = formData.cnpj ? formData.cnpj.replace(/\D/g, '') : undefined;
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          data: {
            nome: formData.nomeEmpresa,
            tipo_usuario: "vendedor",
            cpf: cpfLimpo,
            cnpj: cnpjLimpo,
            celular: formData.celular,
            endereco: formData.endereco,
            horario_funcionamento: formData.horario_funcionamento,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Conta criada com sucesso!",
      });
      
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar conta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-background py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2">
            {/* Left Side */}
            <div className="bg-primary text-primary-foreground p-8 flex flex-col justify-center items-center text-center">
              <Store className="h-20 w-20 mb-4" />
              <h2 className="text-3xl font-bold mb-4">Seja um Vendedor!</h2>
              <p className="mb-6">Cadastre-se e comece a vender produtos evitando o desperdício.</p>
              <Link to="/login">
                <Button variant="secondary" className="w-full">
                  Já tenho conta
                </Button>
              </Link>
            </div>

            {/* Right Side - Form */}
            <div className="p-8">
              <div className="mb-6">
                <Link to="/">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <h2 className="text-2xl font-bold mt-4">Cadastro de Vendedor</h2>
                <p className="text-muted-foreground">Preencha os dados para começar a vender</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeEmpresa">Nome Completo ou Nome da Empresa *</Label>
                  <Input
                    id="nomeEmpresa"
                    name="nomeEmpresa"
                    value={formData.nomeEmpresa}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF (apenas números)</Label>
                    <Input
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      placeholder="00000000000"
                      maxLength={11}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ (apenas números)</Label>
                    <Input
                      id="cnpj"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleChange}
                      placeholder="00000000000000"
                      maxLength={14}
                    />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground -mt-2">
                  * Preencha CPF ou CNPJ (pelo menos um é obrigatório)
                </p>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="celular">Telefone *</Label>
                  <Input
                    id="celular"
                    name="celular"
                    type="tel"
                    value={formData.celular}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço *</Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Rua, número, bairro, cidade"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horario_funcionamento">Horário de Funcionamento *</Label>
                  <Input
                    id="horario_funcionamento"
                    name="horario_funcionamento"
                    value={formData.horario_funcionamento}
                    onChange={handleChange}
                    placeholder="Ex: Seg-Sex 8h-18h, Sáb 8h-12h"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha *</Label>
                    <Input
                      id="senha"
                      name="senha"
                      type="password"
                      value={formData.senha}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                    <Input
                      id="confirmarSenha"
                      name="confirmarSenha"
                      type="password"
                      value={formData.confirmarSenha}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Criando conta..." : "Criar Conta"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Quer apenas comprar?{" "}
                  <Link to="/cadastro-pf" className="text-primary hover:underline font-medium">
                    Cadastre-se como comprador
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroPJ;
