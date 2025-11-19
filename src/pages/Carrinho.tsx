import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";

interface CartItem {
  id: number;
  produto_id: number;
  produto_nome: string;
  produto_preco: number;
  produto_imagem: string | null;
  quantidade: number;
  valor_total_item: number;
}

const Carrinho = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndFetchCart();
  }, []);

  const checkAuthAndFetchCart = async () => {
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

    setUserId(session.user.id);
    await fetchCart(session.user.id);
  };

  const fetchCart = async (clienteId: string) => {
    try {
      const { data, error } = await supabase
        .from("carrinho_produto")
        .select(`
          id,
          quantidade,
          valor_total_item,
          produto:fk_produto_id (
            id,
            nome,
            preco,
            imagem
          )
        `)
        .eq("fk_cliente_id", clienteId);

      if (error) throw error;

      const cartItems = data?.map((item: any) => {
        const p = item.produto;
        let imagemUrl = p.imagem;
        if (p.imagem && typeof p.imagem === 'object' && p.imagem.data) {
          imagemUrl = String.fromCharCode(...p.imagem.data);
        }
        
        return {
          id: item.id,
          produto_id: p.id,
          produto_nome: p.nome,
          produto_preco: p.preco,
          produto_imagem: imagemUrl,
          quantidade: item.quantidade,
          valor_total_item: item.valor_total_item,
        };
      }) || [];

      setItems(cartItems);
    } catch (error: any) {
      console.error("Erro ao buscar carrinho:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o carrinho.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number, precoUnitario: number) => {
    if (newQuantity < 1) return;

    try {
      const { error } = await supabase
        .from("carrinho_produto")
        .update({
          quantidade: newQuantity,
          valor_total_item: precoUnitario * newQuantity,
        })
        .eq("id", itemId);

      if (error) throw error;

      setItems(items.map(item => 
        item.id === itemId 
          ? { ...item, quantidade: newQuantity, valor_total_item: precoUnitario * newQuantity }
          : item
      ));
    } catch (error: any) {
      console.error("Erro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar quantidade.",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const { error } = await supabase
        .from("carrinho_produto")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      toast({
        title: "Removido!",
        description: "Item removido do carrinho.",
      });

      setItems(items.filter(item => item.id !== itemId));
    } catch (error: any) {
      console.error("Erro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover item.",
        variant: "destructive",
      });
    }
  };

  const total = items.reduce((sum, item) => sum + item.valor_total_item, 0);

  const finalizarPedido = async () => {
    if (!userId || items.length === 0) return;

    try {
      // Agrupar itens por vendedor
      const itensPorVendedor: { [key: number]: typeof items } = {};
      
      for (const item of items) {
        const { data: produto } = await supabase
          .from("produto")
          .select("fk_vendedor_id, profiles:fk_vendedor_id(nome, celular)")
          .eq("id", item.produto_id)
          .single();

        if (produto?.fk_vendedor_id) {
          if (!itensPorVendedor[produto.fk_vendedor_id]) {
            itensPorVendedor[produto.fk_vendedor_id] = [];
          }
          itensPorVendedor[produto.fk_vendedor_id].push({
            ...item,
            vendedor_nome: (produto as any).profiles?.nome,
            vendedor_celular: (produto as any).profiles?.celular,
          });
        }
      }

      // Para cada vendedor, gerar mensagem de WhatsApp
      for (const vendedorId in itensPorVendedor) {
        const itensVendedor = itensPorVendedor[vendedorId];
        const vendedor = itensVendedor[0] as any;
        
        if (!vendedor.vendedor_celular) continue;

        let mensagem = `🛒 *Novo Pedido - Xepa Social*\n\n`;
        let totalVendedor = 0;

        itensVendedor.forEach((item) => {
          mensagem += `• ${item.quantidade}x ${item.produto_nome}\n`;
          mensagem += `  R$ ${item.produto_preco.toFixed(2)} cada\n`;
          mensagem += `  Subtotal: R$ ${item.valor_total_item.toFixed(2)}\n\n`;
          totalVendedor += item.valor_total_item;
        });

        mensagem += `*Total: R$ ${totalVendedor.toFixed(2)}*`;

        const celular = vendedor.vendedor_celular.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/55${celular}?text=${encodeURIComponent(mensagem)}`;
        window.open(whatsappUrl, '_blank');
      }

      // Limpar carrinho após enviar pedidos
      const { error } = await supabase
        .from("carrinho_produto")
        .delete()
        .eq("fk_cliente_id", userId);

      if (error) throw error;

      toast({
        title: "Pedido Enviado!",
        description: "Seu pedido foi enviado para os vendedores via WhatsApp.",
      });

      setItems([]);
    } catch (error: any) {
      console.error("Erro ao finalizar pedido:", error);
      toast({
        title: "Erro",
        description: "Não foi possível finalizar o pedido.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">Meu Carrinho</h1>

        {loading ? (
          <p className="text-center text-muted-foreground py-12">Carregando...</p>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Seu carrinho está vazio.</p>
              <Button onClick={() => navigate("/")}>Ver Produtos</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.produto_imagem || "https://images.unsplash.com/photo-1506617564039-2f3b650b7b66?w=400"}
                        alt={item.produto_nome}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{item.produto_nome}</h3>
                        <p className="text-primary font-bold mb-3">
                          R$ {item.produto_preco.toFixed(2)} / unidade
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantidade - 1, item.produto_preco)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantidade}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantidade + 1, item.produto_preco)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm font-semibold">
                            Subtotal: R$ {item.valor_total_item.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>R$ {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total</span>
                      <span className="text-primary">R$ {total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button className="w-full" size="lg" onClick={finalizarPedido}>
                    Finalizar Pedido
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    Os vendedores serão notificados via WhatsApp
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Carrinho;
