import { BotaoLink } from "@/components/Botao";
import { Cabecalho } from "@/components/Cabecalho";

/**
 * Landing enxuta, sem rolagem: só o hero. Toda a explicação e a oferta vivem
 * dentro da experiência do diagnóstico (blueprint, seção 31 — experiência
 * primeiro).
 */
export default function LandingPage() {
  return (
    <div className="flex min-h-[100svh] flex-1 flex-col overflow-hidden">
      <Cabecalho
        containerClassName="max-w-2xl"
        acao={
          <span className="hidden text-xs font-semibold uppercase tracking-wide text-texto-suave sm:inline">
            Diagnóstico gratuito
          </span>
        }
      />

      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-5 pb-8 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-acento">
          Diagnóstico interativo
        </p>
        <h1 className="text-balance text-[2rem] leading-[1.12] text-texto sm:text-5xl">
          Descubra o que está acontecendo — e qual deve ser o seu próximo passo.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-pretty text-base text-texto-suave sm:text-lg">
          Antes de tentar fazer alguém sentir a sua falta, entenda por que você
          ainda está presa nessa história. Responda algumas perguntas e receba
          um diagnóstico personalizado com um plano prático para os próximos
          dias.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3">
          <BotaoLink href="/quiz" tamanho="grande">
            Fazer meu diagnóstico grátis
          </BotaoLink>
          <span className="inline-flex items-center gap-2 rounded-full bg-superficie-suave px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-sucesso">
            <span className="size-1.5 shrink-0 rounded-full bg-sucesso" />
            100% grátis · 2–4 min · sem cadastro
          </span>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-2xl px-5 pb-6 text-center">
        <p className="text-[11px] leading-relaxed text-texto-suave">
          Ferramenta educacional e de reflexão sobre relacionamentos. Não
          substitui acompanhamento psicológico e não faz previsões sobre o
          comportamento de outras pessoas.
        </p>
      </footer>
    </div>
  );
}
