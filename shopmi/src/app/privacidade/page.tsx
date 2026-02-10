import React from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const dynamic = "force-static";

export const metadata = {
  title: "Política de Privacidade - PICO",
  description:
    "Saiba como coletamos, usamos e protegemos suas informações pessoais.",
};

const privacyCategories = [
  {
    title: "Coleta de informações",
    items: [
      {
        question: "Quais informações pessoais coletamos?",
        answer:
          "Coletamos informações que você nos fornece diretamente, como nome completo, endereço de e-mail, endereço de entrega, número de telefone e informações de pagamento ao realizar uma compra. Também coletamos dados de navegação, como endereço IP, tipo de navegador, páginas visitadas e tempo de permanência no site, por meio de cookies e tecnologias semelhantes.",
      },
      {
        question: "Como coletamos suas informações?",
        answer:
          "Suas informações são coletadas quando você cria uma conta, realiza uma compra, assina nossa newsletter, preenche formulários em nosso site ou entra em contato com nosso suporte. Também utilizamos cookies e ferramentas de análise para coletar dados de navegação automaticamente durante sua visita ao site.",
      },
      {
        question: "Coletamos dados de menores de idade?",
        answer:
          "Nosso site e serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente informações pessoais de menores. Se tomarmos conhecimento de que coletamos dados de um menor, tomaremos medidas para excluir essas informações de nossos registros o mais rápido possível.",
      },
    ],
  },
  {
    title: "Uso das informações",
    items: [
      {
        question: "Como utilizamos suas informações pessoais?",
        answer:
          "Utilizamos suas informações para processar e entregar seus pedidos, gerenciar sua conta, enviar atualizações sobre o status dos seus pedidos, personalizar sua experiência de compra, enviar comunicações de marketing (com seu consentimento), melhorar nosso site e serviços, e cumprir obrigações legais e regulatórias.",
      },
      {
        question: "Compartilhamos seus dados com terceiros?",
        answer:
          "Compartilhamos suas informações apenas quando necessário para a prestação dos nossos serviços: com operadoras de pagamento para processar transações, com transportadoras para realizar entregas, com prestadores de serviços de TI que nos auxiliam na operação do site, e com autoridades governamentais quando exigido por lei. Nunca vendemos ou alugamos seus dados pessoais a terceiros para fins de marketing.",
      },
      {
        question: "Enviamos comunicações de marketing?",
        answer:
          "Enviamos comunicações de marketing apenas se você tiver dado consentimento explícito, como ao se inscrever em nossa newsletter. Você pode cancelar o recebimento a qualquer momento clicando no link \"descadastrar\" presente em todos os nossos e-mails ou acessando as configurações da sua conta.",
      },
    ],
  },
  {
    title: "Proteção e armazenamento",
    items: [
      {
        question: "Como protegemos seus dados?",
        answer:
          "Adotamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, perda, alteração ou destruição. Utilizamos criptografia SSL de 256 bits em todas as transmissões de dados, armazenamento seguro com acesso restrito, firewalls e sistemas de detecção de intrusão, além de auditorias regulares de segurança.",
      },
      {
        question: "Por quanto tempo armazenamos seus dados?",
        answer:
          "Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir as finalidades para as quais foram coletadas. Dados de compra são mantidos pelo período exigido por lei para fins fiscais e contábeis. Dados da conta são mantidos enquanto sua conta estiver ativa. Após o encerramento da conta, seus dados são excluídos ou anonimizados em até 90 dias, salvo quando a retenção for necessária por obrigação legal.",
      },
      {
        question: "Onde seus dados são armazenados?",
        answer:
          "Seus dados são armazenados em servidores seguros localizados no Brasil, em conformidade com a Lei Geral de Proteção de Dados (LGPD). Quando necessário transferir dados para fora do país, garantimos que os destinatários adotem padrões adequados de proteção de dados, conforme exigido pela legislação brasileira.",
      },
      {
        question: "Utilizamos cookies?",
        answer:
          "Sim, utilizamos cookies essenciais para o funcionamento do site (como manter itens no carrinho), cookies de desempenho para analisar o tráfego e melhorar o site, cookies de funcionalidade para lembrar suas preferências, e cookies de marketing (apenas com seu consentimento) para exibir anúncios relevantes. Você pode gerenciar suas preferências de cookies a qualquer momento nas configurações do navegador.",
      },
    ],
  },
  {
    title: "Seus direitos",
    items: [
      {
        question: "Quais são meus direitos em relação aos meus dados?",
        answer:
          "De acordo com a LGPD, você tem o direito de acessar seus dados pessoais, corrigir dados incompletos ou desatualizados, solicitar a exclusão dos seus dados, revogar o consentimento para uso dos dados, solicitar a portabilidade dos dados para outro fornecedor, e obter informações sobre com quem seus dados foram compartilhados.",
      },
      {
        question: "Como posso exercer meus direitos?",
        answer:
          "Para exercer qualquer um dos seus direitos, entre em contato com nosso Encarregado de Proteção de Dados pelo e-mail privacidade@pico.com.br ou através do formulário disponível na seção \"Contato\" do nosso site. Responderemos à sua solicitação em até 15 dias úteis, conforme previsto na legislação.",
      },
      {
        question: "Posso solicitar a exclusão da minha conta e dados?",
        answer:
          "Sim, você pode solicitar a exclusão completa da sua conta e dados pessoais a qualquer momento. Para isso, acesse as configurações da sua conta ou entre em contato com nosso suporte. Após a solicitação, seus dados serão excluídos em até 30 dias, exceto informações que precisamos reter por obrigação legal (como dados fiscais de compras realizadas).",
      },
      {
        question: "Esta política pode ser alterada?",
        answer:
          "Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas ou na legislação aplicável. Sempre que houver alterações significativas, notificaremos você por e-mail ou através de um aviso em destaque no site. Recomendamos revisar esta página regularmente. A data da última atualização é exibida no topo desta página.",
      },
    ],
  },
];

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full bg-[#f5f5f5] pt-[120px] md:pt-[140px] pb-12 md:pb-16">
        <div className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-[11px] sm:text-xs tracking-[0.15em] text-[#666]">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#1a1a1a] transition-colors uppercase"
                >
                  Home
                </Link>
              </li>
              <li className="text-[#ccc]">/</li>
              <li className="text-[#1a1a1a] font-medium uppercase">
                Privacidade
              </li>
            </ol>
          </nav>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-[#1a1a1a] tracking-wide mb-6">
            Política de Privacidade
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#666] max-w-2xl mx-auto leading-relaxed font-light">
            Saiba como coletamos, utilizamos e protegemos suas informações
            pessoais ao navegar e comprar em nosso site.
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="space-y-12 sm:space-y-16">
          {privacyCategories.map((category) => (
            <section key={category.title}>
              {/* Category Title */}
              <h2 className="text-2xl sm:text-3xl font-light text-[#1a1a1a] mb-6 sm:mb-8">
                {category.title}
              </h2>

              {/* Accordion */}
              <Accordion type="single" collapsible className="w-full">
                {category.items.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`${category.title}-${index}`}
                    className="border-b border-[#e0e0e0] last:border-b-0"
                  >
                    <AccordionTrigger className="text-sm sm:text-base font-medium text-[#1a1a1a] hover:no-underline py-5 sm:py-6 text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-[#666] leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 sm:mt-20 pt-12 border-t border-[#e0e0e0] text-center">
          <h3 className="text-xl sm:text-2xl font-light text-[#1a1a1a] mb-3">
            Ainda tem dúvidas sobre privacidade?
          </h3>
          <p className="text-sm text-[#666] mb-8 max-w-md mx-auto">
            Entre em contato com nosso Encarregado de Proteção de Dados para
            esclarecer qualquer questão sobre o tratamento dos seus dados.
          </p>
          <Link
            href="/contato"
            className="inline-block bg-[#1a1a1a] text-white py-3.5 px-10 text-xs tracking-[0.15em] uppercase font-medium hover:bg-black transition-colors"
          >
            Fale conosco
          </Link>
        </div>
      </div>
    </div>
  );
}
