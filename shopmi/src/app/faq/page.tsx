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
  title: "FAQ - Ninē & CO",
  description:
    "Perguntas frequentes sobre pedidos, envio, devoluções, pagamentos e mais.",
};

// FAQ data organized by categories
const faqCategories = [
  {
    title: "Pedidos e envio",
    items: [
      {
        question: "Como faço para devolver meu pedido?",
        answer:
          "Se deseja devolver seu pedido, preencha o formulário de devolução que acompanha a embalagem. Certifique-se de incluir todas as informações solicitadas, como o número do pedido e o motivo da devolução. Depois de preencher o formulário, feche a embalagem com cuidado e cole a etiqueta de envio que também foi inclusa. Coloque o pacote em uma caixa apropriada e leve-o aos Correios ou a um serviço de courier o mais rápido possível. Se tiver alguma dúvida sobre o processo de devolução, entre em contato com nossa equipe de atendimento ao cliente para assistência.",
      },
      {
        question: "Quanto tempo leva para o meu pedido chegar?",
        answer:
          "O prazo de entrega varia de acordo com sua localização e o método de envio escolhido. Pedidos padrão são entregues em 5 a 10 dias úteis. Envios expressos chegam em 2 a 4 dias úteis. Após o despacho, você receberá um e-mail com o código de rastreamento para acompanhar sua encomenda em tempo real.",
      },
      {
        question: "Posso rastrear meu pedido?",
        answer:
          "Sim! Assim que seu pedido for despachado, enviaremos um e-mail com o código de rastreamento. Você também pode acompanhar o status do seu pedido acessando sua conta no painel do cliente, na seção \"Meus Pedidos\".",
      },
      {
        question: "Vocês fazem envio internacional?",
        answer:
          "No momento, realizamos envios para todo o território nacional. Estamos trabalhando para disponibilizar envios internacionais em breve. Assine nossa newsletter para ser notificado quando essa opção estiver disponível.",
      },
      {
        question: "Posso alterar o endereço de entrega após finalizar o pedido?",
        answer:
          "Se o pedido ainda não foi despachado, entre em contato com nosso suporte o mais rápido possível para solicitar a alteração. Após o despacho, infelizmente não é possível alterar o endereço de entrega.",
      },
    ],
  },
  {
    title: "Pagamentos",
    items: [
      {
        question: "Quais formas de pagamento são aceitas?",
        answer:
          "Aceitamos diversas formas de pagamento para sua conveniência: cartões de crédito (Visa, Mastercard, Elo, American Express), cartões de débito, PIX com aprovação instantânea, e boleto bancário com prazo de compensação de até 3 dias úteis. Todos os pagamentos são processados em ambiente seguro com criptografia SSL.",
      },
      {
        question: "É seguro comprar no site?",
        answer:
          "Absolutamente. Utilizamos tecnologia de criptografia SSL de 256 bits para proteger todas as suas informações. Nosso sistema de pagamento é certificado e segue os padrões PCI DSS. Em nenhum momento armazenamos dados completos de cartão de crédito em nossos servidores.",
      },
      {
        question: "Posso parcelar minha compra?",
        answer:
          "Sim, oferecemos parcelamento em até 12x nos cartões de crédito. Parcelas de até 3x são sem juros. Para parcelamentos acima de 3x, os juros da operadora do cartão podem ser aplicados. O valor de cada parcela é exibido na finalização da compra.",
      },
      {
        question: "O que fazer se meu pagamento for recusado?",
        answer:
          "Se seu pagamento for recusado, verifique se os dados do cartão foram inseridos corretamente e se há limite disponível. Tente utilizar outra forma de pagamento ou entre em contato com seu banco. Se o problema persistir, nossa equipe de suporte pode ajudá-lo.",
      },
    ],
  },
  {
    title: "Produtos",
    items: [
      {
        question: "Como escolher o tamanho correto?",
        answer:
          "Cada produto possui uma tabela de medidas na página de detalhes. Recomendamos que você tire suas medidas e compare com a tabela antes de finalizar a compra. Se estiver em dúvida entre dois tamanhos, sugerimos optar pelo tamanho maior para maior conforto.",
      },
      {
        question: "Os produtos apresentados no site são fiéis às cores reais?",
        answer:
          "Fazemos o máximo para que as fotos representem fielmente as cores dos produtos. No entanto, pequenas variações podem ocorrer devido às configurações do monitor ou tela do dispositivo. Se tiver dúvidas sobre a cor exata de um produto, entre em contato conosco.",
      },
      {
        question: "Como devo cuidar das minhas peças?",
        answer:
          "Cada produto vem com instruções de cuidado na etiqueta. De modo geral, recomendamos lavar as peças com água fria, pelo avesso, e secar à sombra para preservar as cores e a qualidade do tecido. Evite o uso de alvejantes e prefira passar a ferro em temperatura baixa.",
      },
    ],
  },
  {
    title: "Conta e suporte",
    items: [
      {
        question: "Como criar uma conta?",
        answer:
          "Criar uma conta é simples e rápido. Clique no ícone de perfil no canto superior direito da página e selecione \"Criar conta\". Preencha seus dados básicos como nome, e-mail e senha. Você também pode se cadastrar usando sua conta Google para agilizar o processo.",
      },
      {
        question: "Esqueci minha senha, o que faço?",
        answer:
          "Na página de login, clique em \"Esqueceu sua senha?\". Insira o e-mail cadastrado e enviaremos um link para redefinir sua senha. O link é válido por 24 horas. Se não receber o e-mail, verifique sua pasta de spam ou entre em contato com nosso suporte.",
      },
      {
        question: "Como entrar em contato com o suporte?",
        answer:
          "Você pode entrar em contato conosco através do e-mail suporte@nineco.com.br, pelo chat disponível no canto inferior direito do site (horário comercial), ou através das nossas redes sociais. Nosso tempo médio de resposta é de até 24 horas em dias úteis.",
      },
      {
        question: "Posso cancelar meu pedido?",
        answer:
          "Sim, pedidos podem ser cancelados antes do despacho. Acesse \"Meus Pedidos\" em sua conta e clique em \"Cancelar pedido\". Se o pedido já foi despachado, será necessário aguardar a entrega e solicitar uma devolução. O reembolso é processado em até 7 dias úteis após a confirmação do cancelamento.",
      },
    ],
  },
];

export default function FaqPage() {
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
              <li className="text-[#1a1a1a] font-medium uppercase">FAQ</li>
            </ol>
          </nav>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-[#1a1a1a] tracking-wide mb-6">
            FAQ
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#666] max-w-2xl mx-auto leading-relaxed font-light">
            Se você tem alguma dúvida, consulte nossa lista de perguntas
            frequentes antes de entrar em contato para assistência.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="space-y-12 sm:space-y-16">
          {faqCategories.map((category) => (
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
            Não encontrou o que procurava?
          </h3>
          <p className="text-sm text-[#666] mb-8 max-w-md mx-auto">
            Nossa equipe está pronta para ajudar. Entre em contato e
            responderemos o mais rápido possível.
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
