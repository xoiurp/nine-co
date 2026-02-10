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
  title: "Termos e Condições - PICO",
  description:
    "Leia os termos e condições de uso da loja PICO antes de realizar suas compras.",
};

const termosCategories = [
  {
    title: "Termos gerais",
    items: [
      {
        question: "O que são estes Termos e Condições?",
        answer:
          "Estes Termos e Condições regulam o uso do site e dos serviços oferecidos pela PICO. Ao acessar e utilizar nosso site, você declara que leu, compreendeu e concorda com todos os termos aqui descritos. Caso não concorde com algum dos termos, solicitamos que não utilize nossos serviços.",
      },
      {
        question: "Quem pode utilizar o site?",
        answer:
          "O uso do site é destinado a pessoas maiores de 18 anos ou menores devidamente autorizados por seus responsáveis legais. Ao criar uma conta ou realizar uma compra, você declara possuir capacidade legal para celebrar contratos vinculativos conforme a legislação brasileira.",
      },
      {
        question: "Podemos alterar estes termos?",
        answer:
          "A PICO reserva-se o direito de atualizar ou modificar estes Termos e Condições a qualquer momento. Alterações significativas serão comunicadas por e-mail ou aviso em destaque no site. O uso continuado do site após a publicação de alterações constitui aceitação dos novos termos. Recomendamos que revise esta página periodicamente.",
      },
    ],
  },
  {
    title: "Compras e pedidos",
    items: [
      {
        question: "Como funciona o processo de compra?",
        answer:
          "Ao adicionar produtos ao carrinho e finalizar a compra, você está realizando uma oferta de aquisição. A PICO confirmará o pedido por e-mail após a aprovação do pagamento. O contrato de compra é considerado celebrado no momento do envio do e-mail de confirmação. Reservamo-nos o direito de recusar ou cancelar pedidos em casos de erros de preço, indisponibilidade de estoque ou suspeita de fraude.",
      },
      {
        question: "Os preços podem sofrer alteração?",
        answer:
          "Os preços exibidos no site são válidos no momento da compra e incluem os impostos aplicáveis. A PICO pode alterar os preços a qualquer momento, sem aviso prévio, porém alterações não afetarão pedidos já confirmados. Em caso de erro evidente de preço, entraremos em contato para informá-lo e oferecer a opção de manter ou cancelar o pedido.",
      },
      {
        question: "Qual a política de disponibilidade de estoque?",
        answer:
          "Todos os produtos exibidos estão sujeitos à disponibilidade de estoque. Embora nos esforcemos para manter o catálogo atualizado, eventualmente um produto pode se esgotar após a finalização do seu pedido. Nesse caso, notificaremos você por e-mail e ofereceremos a opção de aguardar a reposição, substituir por produto similar ou receber reembolso integral.",
      },
      {
        question: "Posso cancelar meu pedido?",
        answer:
          "Pedidos podem ser cancelados sem custo enquanto não tiverem sido despachados. Após o despacho, será necessário aguardar a entrega e solicitar a devolução conforme nossa política. Para cancelar, acesse \"Meus Pedidos\" na sua conta ou entre em contato com nosso suporte.",
      },
    ],
  },
  {
    title: "Entregas e devoluções",
    items: [
      {
        question: "Quais são os prazos de entrega?",
        answer:
          "Os prazos de entrega variam conforme a região e o método de envio selecionado. O prazo estimado é informado na finalização da compra e começa a contar a partir da confirmação do pagamento. A PICO não se responsabiliza por atrasos causados por eventos fora do nosso controle, como greves, desastres naturais ou problemas na transportadora.",
      },
      {
        question: "Qual a política de devolução e troca?",
        answer:
          "Você tem o direito de devolver ou trocar produtos em até 30 dias corridos após o recebimento, conforme o Código de Defesa do Consumidor. Os produtos devem estar em sua embalagem original, sem uso, com etiquetas e acessórios intactos. Para iniciar uma devolução, acesse sua conta ou entre em contato com nosso suporte.",
      },
      {
        question: "Como funciona o reembolso?",
        answer:
          "Após o recebimento e inspeção do produto devolvido, o reembolso será processado em até 10 dias úteis. O valor será estornado na mesma forma de pagamento utilizada na compra. Para pagamentos via boleto ou PIX, o reembolso será feito por transferência bancária para a conta indicada por você.",
      },
      {
        question: "E se o produto chegar com defeito?",
        answer:
          "Se o produto apresentar defeito de fabricação, você tem até 90 dias para solicitar a troca ou reparo. Entre em contato com nosso suporte enviando fotos do defeito e o número do pedido. A PICO arcará com todos os custos de envio para devolução de produtos defeituosos.",
      },
    ],
  },
  {
    title: "Responsabilidades e propriedade intelectual",
    items: [
      {
        question: "Quais são as responsabilidades do usuário?",
        answer:
          "Ao utilizar nosso site, você se compromete a fornecer informações verdadeiras e atualizadas, manter a confidencialidade dos dados de acesso à sua conta, não utilizar o site para fins ilegais ou não autorizados, não tentar acessar áreas restritas do sistema, e não reproduzir ou distribuir conteúdo do site sem autorização prévia.",
      },
      {
        question: "Quais são as limitações de responsabilidade da PICO?",
        answer:
          "A PICO se esforça para manter o site disponível e funcionando corretamente, mas não garante que o acesso será ininterrupto ou livre de erros. Não nos responsabilizamos por danos indiretos, incidentais ou consequentes decorrentes do uso ou impossibilidade de uso do site, exceto nos casos previstos em lei.",
      },
      {
        question: "Como funciona a propriedade intelectual?",
        answer:
          "Todo o conteúdo do site, incluindo textos, imagens, logotipos, designs, fotografias e software, é propriedade da PICO ou de seus licenciantes e está protegido pelas leis brasileiras de propriedade intelectual. É proibida a reprodução, distribuição ou modificação de qualquer conteúdo sem autorização prévia por escrito.",
      },
      {
        question: "Qual legislação se aplica a estes termos?",
        answer:
          "Estes Termos e Condições são regidos pelas leis da República Federativa do Brasil. Qualquer litígio decorrente da interpretação ou cumprimento destes termos será submetido ao foro da comarca do domicílio do consumidor, conforme previsto no Código de Defesa do Consumidor.",
      },
    ],
  },
];

export default function TermosPage() {
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
                Termos e Condições
              </li>
            </ol>
          </nav>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-[#1a1a1a] tracking-wide mb-6">
            Termos e Condições
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#666] max-w-2xl mx-auto leading-relaxed font-light">
            Leia atentamente os termos e condições que regem o uso do nosso site
            e a realização de compras na PICO.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="space-y-12 sm:space-y-16">
          {termosCategories.map((category) => (
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
            Tem alguma dúvida sobre os termos?
          </h3>
          <p className="text-sm text-[#666] mb-8 max-w-md mx-auto">
            Nossa equipe jurídica está disponível para esclarecer qualquer
            ponto destes termos e condições.
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
