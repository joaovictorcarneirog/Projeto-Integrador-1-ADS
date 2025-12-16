import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, LogOut, MapPin, Edit2, Save, X } from "lucide-react";
import ProductMap from "@/components/ProductMap";

interface Profile {
  nome: string;
  email: string;
  tipo_usuario: string;
  celular: string | null;
  endereco: string | null;
  cpf: number | null;
  cnpj: number | null;
  data_nasc: string | null;
  horario_funcionamento: string | null;
  latitude: number | null;
  longitude: number | null;
}

const Perfil = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [editData, setEditData] = useState({
    nome: "",
    celular: "",
    endereco: "",
    horario_funcionamento: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      const profileData = {
        ...data,
        email: session.user.email || "",
      };
      
      setProfile(profileData);
      setEditData({
        nome: data.nome || "",
        celular: data.celular || "",
        endereco: data.endereco || "",
        horario_funcionamento: data.horario_funcionamento || "",
        latitude: data.latitude,
        longitude: data.longitude,
      });
    } catch (error: any) {
      console.error("Erro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o perfil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate("/");
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Erro",
        description: "Geolocalização não suportada pelo navegador.",
        variant: "destructive",
      });
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setEditData({
          ...editData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        toast({
          title: "Localização capturada!",
          description: "Clique em Salvar para confirmar as alterações.",
        });
        setLoadingLocation(false);
      },
      (error) => {
        toast({
          title: "Erro ao obter localização",
          description: "Permita o acesso à localização nas configurações do navegador.",
          variant: "destructive",
        });
        setLoadingLocation(false);
      }
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/login");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          nome: editData.nome.trim(),
          celular: editData.celular.trim() || null,
          endereco: editData.endereco.trim() || null,
          horario_funcionamento: editData.horario_funcionamento.trim() || null,
          latitude: editData.latitude,
          longitude: editData.longitude,
        })
        .eq("id", session.user.id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Informações atualizadas com sucesso.",
      });
      
      setEditing(false);
      fetchProfile();
    } catch (error: any) {
      console.error("Erro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      nome: profile?.nome || "",
      celular: profile?.celular || "",
      endereco: profile?.endereco || "",
      horario_funcionamento: profile?.horario_funcionamento || "",
      latitude: profile?.latitude || null,
      longitude: profile?.longitude || null,
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-1">
          <p className="text-center text-muted-foreground">Carregando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const isVendedor = profile?.tipo_usuario === "vendedor";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </span>
                {!editing && (
                  <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={editData.nome}
                      onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-lg text-muted-foreground">{profile?.email}</p>
                    <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="celular">Celular</Label>
                    <Input
                      id="celular"
                      value={editData.celular}
                      onChange={(e) => setEditData({ ...editData, celular: e.target.value })}
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={editData.endereco}
                      onChange={(e) => setEditData({ ...editData, endereco: e.target.value })}
                      placeholder="Rua, número, bairro, cidade"
                    />
                  </div>

                  {isVendedor && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="horario">Horário de Funcionamento</Label>
                        <Input
                          id="horario"
                          value={editData.horario_funcionamento}
                          onChange={(e) => setEditData({ ...editData, horario_funcionamento: e.target.value })}
                          placeholder="Ex: Seg-Sex 8h-18h"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Localização no Mapa</Label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={getLocation}
                            disabled={loadingLocation}
                            className="flex-1"
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            {loadingLocation 
                              ? "Obtendo..." 
                              : editData.latitude 
                                ? "Atualizar Localização" 
                                : "Capturar Localização"}
                          </Button>
                        </div>
                        {editData.latitude && editData.longitude && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-2">
                              Lat: {editData.latitude.toFixed(6)}, Lng: {editData.longitude.toFixed(6)}
                            </p>
                            <ProductMap
                              products={[{
                                id: 0,
                                nome: "Sua localização",
                                preco: "0",
                                vendedor_nome: profile?.nome,
                                latitude: editData.latitude,
                                longitude: editData.longitude,
                              }]}
                              className="h-[200px]"
                              singleProduct
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="pt-4 flex gap-2">
                    <Button onClick={handleSave} disabled={saving} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Salvando..." : "Salvar"}
                    </Button>
                    <Button variant="outline" onClick={handleCancel} disabled={saving}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nome</label>
                    <p className="text-lg">{profile?.nome}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-lg">{profile?.email}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tipo de Conta</label>
                    <p className="text-lg capitalize">
                      {isVendedor ? "Vendedor" : "Comprador"}
                    </p>
                  </div>

                  {profile?.celular && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Celular</label>
                      <p className="text-lg">{profile.celular}</p>
                    </div>
                  )}

                  {profile?.endereco && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Endereço</label>
                      <p className="text-lg">{profile.endereco}</p>
                    </div>
                  )}

                  {profile?.cpf && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">CPF</label>
                      <p className="text-lg">{profile.cpf}</p>
                    </div>
                  )}

                  {profile?.cnpj && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">CNPJ</label>
                      <p className="text-lg">{profile.cnpj}</p>
                    </div>
                  )}

                  {profile?.data_nasc && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Data de Nascimento</label>
                      <p className="text-lg">
                        {new Date(profile.data_nasc).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  )}

                  {profile?.horario_funcionamento && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Horário de Funcionamento</label>
                      <p className="text-lg">{profile.horario_funcionamento}</p>
                    </div>
                  )}

                  {isVendedor && profile?.latitude && profile?.longitude && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Localização no Mapa
                      </label>
                      <ProductMap
                        products={[{
                          id: 0,
                          nome: "Sua localização",
                          preco: "0",
                          vendedor_nome: profile.nome,
                          latitude: profile.latitude,
                          longitude: profile.longitude,
                        }]}
                        className="h-[200px] mt-2"
                        singleProduct
                      />
                    </div>
                  )}

                  {isVendedor && !profile?.latitude && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Você ainda não configurou sua localização no mapa. Clique em Editar para adicionar.
                      </p>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Perfil;
