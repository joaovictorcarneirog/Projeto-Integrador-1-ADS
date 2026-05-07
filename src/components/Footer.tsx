import { Link } from "react-router-dom";
import { Sprout, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sprout className="h-7 w-7" />
              <span className="font-handwritten text-3xl leading-none">Xepa</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Comida boa não é lixo. Conectamos quem tem sobra a quem precisa, antes que o desperdício aconteça.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Movimento</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/" className="hover:text-highlight transition-colors">Início</Link></li>
              <li><Link to="/quem-somos" className="hover:text-highlight transition-colors">Nossa Causa</Link></li>
              <li><Link to="/contato" className="hover:text-highlight transition-colors">Fale Conosco</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Participe</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/login" className="hover:text-highlight transition-colors">Entrar</Link></li>
              <li><Link to="/cadastro" className="hover:text-highlight transition-colors">Junte-se a nós</Link></li>
              <li><Link to="/favoritos" className="hover:text-highlight transition-colors">Salvos</Link></li>
              <li><Link to="/carrinho" className="hover:text-highlight transition-colors">Sacola Solidária</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/termos-de-uso" className="hover:text-highlight transition-colors">Termos de Uso</Link></li>
              <li><Link to="/politica-privacidade" className="hover:text-highlight transition-colors">Privacidade</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-primary-foreground/70">
          <p>© 2026 Xepa Social. Feito com <Heart className="inline h-3 w-3 fill-current" /> contra o desperdício.</p>
          <p className="font-handwritten text-lg">comida boa não vira lixo</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
