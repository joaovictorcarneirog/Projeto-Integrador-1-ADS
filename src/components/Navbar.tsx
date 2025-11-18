import { Link } from "react-router-dom";
import { Heart, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const type = localStorage.getItem("userType");
    setIsLoggedIn(!!token);
    setUserType(type);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setIsLoggedIn(false);
    setUserType(null);
    window.location.href = "/";
  };

  const NavLinks = () => (
    <>
      <Link to="/quem-somos" className="text-sm hover:text-accent transition-colors">
        Quem Somos?
      </Link>
      <Link to="/contato" className="text-sm hover:text-accent transition-colors">
        Contato
      </Link>
      {isLoggedIn ? (
        <>
          <Link to="/perfil" className="text-sm hover:text-accent transition-colors flex items-center gap-1">
            <User className="h-4 w-4" />
            Perfil
          </Link>
          <Link to="/favoritos" className="text-sm hover:text-accent transition-colors flex items-center gap-1">
            <Heart className="h-4 w-4" />
            Favoritos
          </Link>
          <Link to="/carrinho" className="text-sm hover:text-accent transition-colors flex items-center gap-1">
            <ShoppingCart className="h-4 w-4" />
            Carrinho
          </Link>
          <button onClick={handleLogout} className="text-sm hover:text-accent transition-colors">
            Sair
          </button>
        </>
      ) : (
        <Link to="/login" className="text-sm hover:text-accent transition-colors">
          Entrar
        </Link>
      )}
    </>
  );

  return (
    <nav className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            Xepa Social
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
