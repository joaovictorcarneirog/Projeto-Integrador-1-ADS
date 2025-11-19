import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Xepa Social</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Conectando pessoas a alimentos frescos e combatendo o desperdício.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Início</Link></li>
              <li><Link to="/quem-somos" className="hover:text-primary transition-colors">Quem Somos</Link></li>
              <li><Link to="/contato" className="hover:text-primary transition-colors">Contato</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Para Você</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/login" className="hover:text-primary transition-colors">Entrar</Link></li>
              <li><Link to="/cadastro" className="hover:text-primary transition-colors">Cadastrar</Link></li>
              <li><Link to="/favoritos" className="hover:text-primary transition-colors">Favoritos</Link></li>
              <li><Link to="/carrinho" className="hover:text-primary transition-colors">Carrinho</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/termos-de-uso" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
              <li><Link to="/politica-privacidade" className="hover:text-primary transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Xepa Social. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
