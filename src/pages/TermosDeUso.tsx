import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermosDeUso = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Termos de Uso</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar o Xepa Social, você concorda com estes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, não utilize nossa plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Sobre o Xepa Social</h2>
            <p>
              O Xepa Social é uma plataforma de e-commerce dedicada à venda de produtos agrícolas 
              e alimentícios, com foco em combater o desperdício de alimentos e conectar vendedores 
              a compradores de forma sustentável.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Cadastro e Conta</h2>
            <p>
              Para usar certas funcionalidades, você deve se cadastrar como Pessoa Física (CPF) 
              ou Pessoa Jurídica (CNPJ). Você é responsável por:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornecer informações verdadeiras e atualizadas</li>
              <li>Manter a confidencialidade de sua senha</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Responsabilidades dos Vendedores</h2>
            <p>Vendedores devem:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Garantir a qualidade e segurança dos produtos oferecidos</li>
              <li>Informar corretamente datas de validade e condições dos produtos</li>
              <li>Cumprir com todas as legislações sanitárias e comerciais aplicáveis</li>
              <li>Responder prontamente às solicitações dos compradores</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Responsabilidades dos Compradores</h2>
            <p>Compradores devem:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Verificar as informações dos produtos antes da compra</li>
              <li>Respeitar os prazos de validade e condições de armazenamento</li>
              <li>Entrar em contato com vendedores através dos canais apropriados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Transações e Pagamentos</h2>
            <p>
              As transações são realizadas diretamente entre compradores e vendedores. 
              O Xepa Social atua como plataforma facilitadora, mas não é responsável 
              por disputas relacionadas a pagamentos ou entregas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo do Xepa Social, incluindo design, logotipo e textos, 
              é propriedade da plataforma e protegido por leis de propriedade intelectual.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitação de Responsabilidade</h2>
            <p>
              O Xepa Social não se responsabiliza por:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Qualidade, segurança ou legalidade dos produtos vendidos</li>
              <li>Capacidade dos vendedores de completar transações</li>
              <li>Danos resultantes do uso inadequado dos produtos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Modificações dos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. 
              Mudanças significativas serão comunicadas através da plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contato</h2>
            <p>
              Para questões sobre estes Termos de Uso, entre em contato através 
              da nossa página de contato.
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermosDeUso;
