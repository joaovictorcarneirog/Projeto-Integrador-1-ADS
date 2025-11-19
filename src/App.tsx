import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import CadastroPF from "./pages/CadastroPF";
import CadastroPJ from "./pages/CadastroPJ";
import QuemSomos from "./pages/QuemSomos";
import Contato from "./pages/Contato";
import CadastrarProduto from "./pages/CadastrarProduto";
import MeusProdutos from "./pages/MeusProdutos";
import Favoritos from "./pages/Favoritos";
import Carrinho from "./pages/Carrinho";
import Perfil from "./pages/Perfil";
import TermosDeUso from "./pages/TermosDeUso";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/cadastro-pf" element={<CadastroPF />} />
          <Route path="/cadastro-pj" element={<CadastroPJ />} />
          <Route path="/quem-somos" element={<QuemSomos />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/cadastrar-produto" element={<CadastrarProduto />} />
          <Route path="/meus-produtos" element={<MeusProdutos />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/termos-de-uso" element={<TermosDeUso />} />
          <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
