import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trash2, Edit, ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Product {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  data_vencimento: string;
  quantidade: number;
  imagem: string | null;
}

const MeusProdutos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndFetchProducts();
  }, []);

  const checkAuthAndFetchProducts = async () => {
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

    // Verificar se é vendedor
    const { data: profile } = await supabase
      .from("profiles")
      .select("tipo_usuario")
      .eq("id", session.user.id)
      .single();

    if (profile?.tipo_usuario !== "vendedor") {
      toast({
        title: "Acesso Negado",
        description: "Apenas vendedores podem acessar esta página.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setUserId(session.user.id);
    await fetchProducts(session.user.id);
  };

  const fetchProducts = async (vendedorId: string) => {
    try {
      const { data, error } = await supabase
        .from("produto")
        .select("*")
        .eq("fk_vendedor_id", vendedorId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const productsWithImage = data?.map((p: any) => {
        let imagemUrl = p.imagem;
        if (p.imagem && typeof p.imagem === 'object' && p.imagem.data) {
          imagemUrl = String.fromCharCode(...p.imagem.data);
        }
        return { ...p, imagem: imagemUrl };
      }) || [];

      setProducts(productsWithImage);
    } catch (error: any) {
      console.error("Erro ao buscar produtos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("produto")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Produto excluído com sucesso!",
      });

      // Atualizar lista
      setProducts(products.filter(p => p.id !== deleteId));
      setDeleteId(null);
    } catch (error: any) {
      console.error("Erro ao deletar produto:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir produto.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link to="/" className="inline-flex items-center text-primary hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
              <h1 className="text-3xl font-bold">Meus Produtos</h1>
            </div>
            <Link to="/cadastrar-produto">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Produto
              </Button>
            </Link>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground py-12">Carregando...</p>
          ) : products.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">Você ainda não cadastrou nenhum produto.</p>
                <Link to="/cadastrar-produto">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Cadastrar Primeiro Produto
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={product.imagem || "https://images.unsplash.com/photo-1506617564039-2f3b650b7b66?w=400"}
                      alt={product.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.nome}</h3>
                    <p className="text-2xl font-bold text-primary mb-2">
                      {product.preco === 0 ? "Grátis" : `R$ ${product.preco.toFixed(2)}`}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Validade:</strong>{" "}
                      {new Date(product.data_vencimento).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Quantidade:</strong> {product.quantidade}
                    </p>
                    {product.descricao && (
                      <p className="text-sm mb-4 line-clamp-2">{product.descricao}</p>
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/cadastrar-produto?id=${product.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Dialog de Confirmação */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O produto será permanentemente excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default MeusProdutos;
