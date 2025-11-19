import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Política de Privacidade</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introdução</h2>
            <p>
              Esta Política de Privacidade descreve como o Xepa Social coleta, usa e protege 
              suas informações pessoais. Estamos comprometidos em proteger sua privacidade e 
              cumprir a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Informações que Coletamos</h2>
            <p>Coletamos as seguintes informações:</p>
            
            <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">Pessoa Física:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nome completo</li>
              <li>CPF</li>
              <li>Endereço</li>
              <li>E-mail</li>
              <li>Celular</li>
              <li>Data de nascimento</li>
              <li>Preferências alimentares</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">Pessoa Jurídica:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nome da empresa</li>
              <li>CNPJ</li>
              <li>Endereço comercial</li>
              <li>E-mail corporativo</li>
              <li>Telefone</li>
              <li>Horário de funcionamento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Como Usamos suas Informações</h2>
            <p>Utilizamos suas informações para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Criar e gerenciar sua conta</li>
              <li>Processar transações entre compradores e vendedores</li>
              <li>Facilitar a comunicação entre usuários</li>
              <li>Enviar notificações sobre pedidos e atualizações</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
              <li>Cumprir obrigações legais e regulatórias</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Compartilhamento de Informações</h2>
            <p>
              Compartilhamos suas informações apenas quando necessário:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Com vendedores ou compradores para completar transações</li>
              <li>Com prestadores de serviços que nos auxiliam (ex: hospedagem, pagamentos)</li>
              <li>Quando exigido por lei ou ordem judicial</li>
            </ul>
            <p className="mt-4">
              <strong>Nunca vendemos suas informações pessoais a terceiros.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Segurança dos Dados</h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais para proteger 
              suas informações, incluindo:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Criptografia de dados sensíveis</li>
              <li>Acesso restrito às informações pessoais</li>
              <li>Monitoramento contínuo de vulnerabilidades</li>
              <li>Backups regulares e seguros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Seus Direitos (LGPD)</h2>
            <p>Você tem direito a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Confirmar a existência de tratamento de dados</li>
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Revogar o consentimento</li>
              <li>Obter informações sobre compartilhamento de dados</li>
            </ul>
            <p className="mt-4">
              Para exercer seus direitos, entre em contato através da nossa página de contato.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cookies e Tecnologias Similares</h2>
            <p>
              Utilizamos cookies para melhorar sua experiência, lembrar suas preferências 
              e analisar o uso da plataforma. Você pode gerenciar as configurações de 
              cookies através do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Retenção de Dados</h2>
            <p>
              Mantemos suas informações pelo tempo necessário para cumprir as finalidades 
              descritas nesta política, salvo quando um período maior for exigido por lei.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Menores de Idade</h2>
            <p>
              Nossa plataforma não é destinada a menores de 18 anos. Não coletamos 
              intencionalmente informações de menores.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças 
              significativas através da plataforma ou por e-mail.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contato</h2>
            <p>
              Para questões sobre privacidade ou para exercer seus direitos sob a LGPD, 
              entre em contato através da nossa página de contato.
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

export default PoliticaPrivacidade;
