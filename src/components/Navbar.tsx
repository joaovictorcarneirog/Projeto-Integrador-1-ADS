import { Link } from "react-router-dom";
import { Heart, ShoppingCart, User, Menu, ShieldCheck, LayoutDashboard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";

const Navbar = () => {
  const { role } = useUserRole();
  const isLoggedIn = role !== null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const NavLinks = () => (
    <>
      <Link to="/quem-somos" className="text-sm hover:text-highlight transition-colors">
        Nossa Causa
      </Link>
      <Link to="/contato" className="text-sm hover:text-highlight transition-colors">
        Contato
      </Link>
      {isLoggedIn ? (
        <>
          {role === "admin" && (
            <Link to="/admin" className="text-sm hover:text-highlight transition-colors flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          )}
          {role === "vendedor" && (
            <>
              <Link to="/painel-doador" className="text-sm hover:text-highlight transition-colors flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" />
                Painel
              </Link>
              <Link to="/meus-documentos" className="text-sm hover:text-highlight transition-colors flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Documentos
              </Link>
            </>
          )}
          {role === "comprador" && (
            <>
              <Link to="/favoritos" className="text-sm hover:text-highlight transition-colors flex items-center gap-1">
                <Heart className="h-4 w-4" />
                Salvos
              </Link>
              <Link to="/carrinho" className="text-sm hover:text-highlight transition-colors flex items-center gap-1">
                <ShoppingCart className="h-4 w-4" />
                Sacola Solidária
              </Link>
            </>
          )}
          <Link to="/perfil" className="text-sm hover:text-highlight transition-colors flex items-center gap-1">
            <User className="h-4 w-4" />
            Perfil
          </Link>
          <button onClick={handleLogout} className="text-sm hover:text-highlight transition-colors">
            Sair
          </button>
        </>
      ) : (
        <Link to="/login" className="text-sm hover:text-highlight transition-colors">
          Entrar
        </Link>
      )}
    </>
  );

  return (
    <nav className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-handwritten leading-none">Xepa</span>
            <span className="text-xs uppercase tracking-widest opacity-80">Social</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-primary text-primary-foreground border-primary">
              <div className="flex flex-col gap-4 mt-8">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
