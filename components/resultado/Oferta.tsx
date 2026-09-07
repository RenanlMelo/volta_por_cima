import { IconeBussola, IconeEscudo } from "@/components/icones";
import { BotaoCheckout } from "@/components/resultado/BotaoCheckout";
import type { Diagnostico } from "@/lib/diagnostico/tipos";
import {
  formatarBRL,
  percentualDesconto,
  PROTOCOLO_EFEITO_SAUDADE,
} from "@/lib/produtos";

export function Oferta({ diagnostico }: { diagnostico: Diagnostico }) {
  const p = PROTOCOLO_EFEITO_SAUDADE;
  const desconto = percentualDesconto(p);
  const economia = p.precoDeCentavos - p.precoPorCentavos;

  return (
    <div className="overflow-hidden rounded-3xl border border-primaria bg-primaria text-white">
      <div className="px-5 py-7 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/65">
          Seu plano personalizado
        </p>
        <h3 className="mt-2 text-balance font-serif text-2xl leading-snug sm:text-[26px]">
          {p.nome}, no seu ritmo
        </h3>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-white/85">
          Tarefas curtas, áudios, scripts e checklists — um passo por dia — para
          recuperar clareza, controlar as suas reações e decidir com calma se uma
          reconexão faz sentido. Vale a pena mesmo que a outra pessoa nunca volte.
        </p>

        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-white/10 p-4">
          <IconeBussola className="mt-0.5 size-5 shrink-0 text-white/80" />
          <div className="text-sm">
            <p className="font-semibold">Onde o seu plano começa</p>
            <p className="mt-0.5 text-white/85">{diagnostico.focoSemana1}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/20 bg-white/5 px-4 py-5 text-center sm:px-5">
          {desconto > 0 ? (
            <span className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full bg-acento px-3 py-1 text-[11px] font-bold uppercase tracking-wide">
              Preço de lançamento
              <span className="rounded-full bg-white/25 px-1.5 py-0.5">
                −{desconto}%
              </span>
            </span>
          ) : null}
          <div className="mt-3 flex flex-wrap items-end justify-center gap-x-3 gap-y-1">
            {desconto > 0 ? (
              <span className="text-lg text-white/55 line-through">
                {formatarBRL(p.precoDeCentavos)}
              </span>
            ) : null}
            <span className="font-serif text-[2rem] font-semibold leading-none sm:text-4xl">
              {formatarBRL(p.precoPorCentavos)}
            </span>
          </div>
          {desconto > 0 ? (
            <p className="mt-2 text-sm text-white/80">
              Você economiza {formatarBRL(economia)} concluindo aqui, agora.
            </p>
          ) : null}
          <p className="mx-auto mt-2 max-w-xs text-xs text-white/60">
            É uma condição para quem acabou de concluir o diagnóstico. O preço
            cheio do protocolo é {formatarBRL(p.precoDeCentavos)}.
          </p>
        </div>

        <div className="mt-6">
          <BotaoCheckout diagnostico={diagnostico} />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-pretty text-center text-xs text-white/70">
          <IconeEscudo className="size-4 shrink-0" />
          <span>Pagamento único · acesso imediato · garantia de 7 dias</span>
        </div>
      </div>
    </div>
  );
}
