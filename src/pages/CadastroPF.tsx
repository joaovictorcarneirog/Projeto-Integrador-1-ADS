import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Leaf } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CadastroPF = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cpf: "",
    celular: "",
    endereco: "",
    data_nasc: "",
    preferencias_alimentares: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (formData.senha.length < 8) {
      toast({
        title: "Erro",
        description: "A senha deve ter no mínimo 8 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          data: {
            nome: formData.nome,
            tipo_usuario: "comprador",
            data_nasc: formData.data_nasc,
            cpf: formData.cpf,
            celular: formData.celular,
            endereco: formData.endereco,
            preferencias_alimentares: formData.preferencias_alimentares,
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
              <Leaf className="h-20 w-20 mb-4" />
              <h2 className="text-3xl font-bold mb-4">Bem-vindo!</h2>
              <p className="mb-6">Cadastre-se como comprador e economize comprando produtos próximos da validade.</p>
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
                <h2 className="text-2xl font-bold mt-4">Cadastro Pessoa Física</h2>
                <p className="text-muted-foreground">Preencha os dados abaixo</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF (apenas números) *</Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="00000000000"
                    maxLength={11}
                    required
                  />
                </div>

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
                  <Label htmlFor="celular">Celular *</Label>
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
                  <Label htmlFor="data_nasc">Data de Nascimento *</Label>
                  <Input
                    id="data_nasc"
                    name="data_nasc"
                    type="date"
                    value={formData.data_nasc}
                    onChange={handleChange}
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
                  <Label htmlFor="preferencias_alimentares">Preferências Alimentares</Label>
                  <Textarea
                    id="preferencias_alimentares"
                    name="preferencias_alimentares"
                    value={formData.preferencias_alimentares}
                    onChange={handleChange}
                    placeholder="Ex: vegetariano, sem glúten, etc."
                    rows={3}
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
                  Quer vender produtos?{" "}
                  <Link to="/cadastro-pj" className="text-primary hover:underline font-medium">
                    Cadastre-se como vendedor
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

export default CadastroPF;
