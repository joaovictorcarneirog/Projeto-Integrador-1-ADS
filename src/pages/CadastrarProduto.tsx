import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const CadastrarProduto = () => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    data_vencimento: "",
    quantidade: "",
    imagemUrl: "",
  });
  const [imagem, setImagem] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [useUrl, setUseUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast({
        title: "Acesso Negado",
        description: "Você precisa estar logado para cadastrar produtos.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Verificar se é vendedor
    const { data: profile } = await supabase
      .from("profiles")
      .select("tipo_usuario")
      .eq("id", session.user.id)
      .single();

    if (profile?.tipo_usuario !== "vendedor") {
      toast({
        title: "Acesso Negado",
        description: "Apenas vendedores podem cadastrar produtos.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setUserId(session.user.id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagem(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData({ ...formData, imagemUrl: "" }); // Limpa URL se selecionar arquivo
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({ ...formData, imagemUrl: url });
    setPreviewUrl(url);
    setImagem(null); // Limpa arquivo se usar URL
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado.",
        variant: "destructive",
      });
      return;
    }

    // Validações básicas
    if (!formData.nome || !formData.preco || !formData.data_vencimento || !formData.quantidade) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(formData.preco) < 0) {
      toast({
        title: "Erro",
        description: "O preço não pode ser negativo.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let imagemUrl = null;

      // Se usou URL direta
      if (useUrl && formData.imagemUrl) {
        imagemUrl = formData.imagemUrl;
      }
      // Se fez upload de arquivo
      else if (imagem) {
        const fileExt = imagem.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `produtos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('produtos')
          .upload(filePath, imagem);

        if (uploadError) throw uploadError;

        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('produtos')
          .getPublicUrl(filePath);

        imagemUrl = publicUrl;
      }

      // Inserir produto no banco
      const { error } = await supabase
        .from("produto")
        .insert({
          nome: formData.nome,
          descricao: formData.descricao,
          preco: parseFloat(formData.preco),
          data_vencimento: formData.data_vencimento,
          quantidade: parseInt(formData.quantidade),
          imagem: imagemUrl,
          fk_vendedor_id: userId,
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Produto cadastrado com sucesso!",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Erro ao cadastrar produto:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar produto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center text-primary hover:underline mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para home
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Cadastrar Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div>
                  <Label htmlFor="nome">Nome do Produto *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Ex: Pão Francês"
                    required
                    maxLength={100}
                  />
                </div>

                {/* Descrição */}
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    placeholder="Descreva o produto..."
                    rows={4}
                    maxLength={500}
                  />
                </div>

                {/* Preço */}
                <div>
                  <Label htmlFor="preco">Preço (R$) *</Label>
                  <Input
                    id="preco"
                    name="preco"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.preco}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Para doação, insira R$ 0,00
                  </p>
                </div>

                {/* Data de Vencimento */}
                <div>
                  <Label htmlFor="data_vencimento">Data de Vencimento *</Label>
                  <Input
                    id="data_vencimento"
                    name="data_vencimento"
                    type="date"
                    value={formData.data_vencimento}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Quantidade */}
                <div>
                  <Label htmlFor="quantidade">Quantidade Disponível *</Label>
                  <Input
                    id="quantidade"
                    name="quantidade"
                    type="number"
                    min="1"
                    value={formData.quantidade}
                    onChange={handleChange}
                    placeholder="1"
                    required
                  />
                </div>

                {/* Imagem */}
                <div>
                  <Label>Imagem do Produto</Label>
                  
                  {/* Toggle entre Upload e URL */}
                  <div className="flex gap-2 mt-2 mb-4">
                    <Button
                      type="button"
                      variant={!useUrl ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setUseUrl(false);
                        setFormData({ ...formData, imagemUrl: "" });
                        setPreviewUrl("");
                      }}
                    >
                      Fazer Upload
                    </Button>
                    <Button
                      type="button"
                      variant={useUrl ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setUseUrl(true);
                        setImagem(null);
                        setPreviewUrl("");
                      }}
                    >
                      Usar URL
                    </Button>
                  </div>

                  {useUrl ? (
                    // Campo de URL
                    <div className="space-y-2">
                      <Input
                        type="url"
                        placeholder="https://exemplo.com/imagem.jpg"
                        value={formData.imagemUrl}
                        onChange={handleUrlChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Cole o link de uma imagem do Google, Unsplash ou qualquer site
                      </p>
                    </div>
                  ) : (
                    // Upload de arquivo
                    <div>
                      {previewUrl && !useUrl ? (
                        <div className="relative">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full max-w-md rounded-lg border-2 border-primary"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setImagem(null);
                              setPreviewUrl("");
                            }}
                          >
                            Remover
                          </Button>
                        </div>
                      ) : (
                        <label
                          htmlFor="imagem"
                          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/10 hover:bg-muted/20 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">Clique para fazer upload</span>
                            </p>
                            <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP</p>
                          </div>
                          <Input
                            id="imagem"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  )}

                  {/* Preview da URL */}
                  {useUrl && previewUrl && (
                    <div className="mt-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full max-w-md rounded-lg border-2 border-primary"
                        onError={() => {
                          toast({
                            title: "Erro",
                            description: "Não foi possível carregar a imagem dessa URL",
                            variant: "destructive",
                          });
                          setPreviewUrl("");
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Botões */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                    size="lg"
                  >
                    {loading ? "Cadastrando..." : "Cadastrar Produto"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CadastrarProduto;
