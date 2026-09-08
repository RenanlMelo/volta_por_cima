"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BotaoLink } from "@/components/Botao";
import { Cabecalho } from "@/components/Cabecalho";
import { Citacao } from "@/components/Citacao";
import {
  IconeAtencao,
  IconeBussola,
  IconeCheck,
  IconeEstrela,
  IconeRaio,
} from "@/components/icones";
import { BlocoResultado } from "@/components/resultado/BlocoResultado";
import { EmblemaArquetipo } from "@/components/resultado/EmblemaArquetipo";
import { Oferta } from "@/components/resultado/Oferta";
import { ProvaSocial } from "@/components/resultado/ProvaSocial";
import { lerSessao } from "@/lib/armazenamento";
import { CITACAO_PRINCIPAL } from "@/lib/citacoes";
import { NOME_ARQUETIPO } from "@/lib/diagnostico/conteudos";
import { calcularDiagnostico } from "@/lib/diagnostico/motor";
import type { Diagnostico } from "@/lib/diagnostico/tipos";

type Estado =
  | { tipo: "carregando" }
  | { tipo: "sem-sessao" }
  | { tipo: "pronto"; diagnostico: Diagnostico };

export default function ResultadoPage() {
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });

  useEffect(() => {
    const sessao = lerSessao();
    const temRespostas =
      sessao && Object.keys(sessao.respostas ?? {}).length > 0;

    let proximo: Estado;
    if (!temRespostas) {
      proximo = { tipo: "sem-sessao" };
    } else {
      try {
        proximo = {
          tipo: "pronto",
          diagnostico: calcularDiagnostico(sessao.respostas),
        };
      } catch {
        proximo = { tipo: "pronto", diagnostico: calcularDiagnostico({}) };
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEstado(proximo);
  }, []);

  if (estado.tipo === "carregando") {
    return (
      <>
        <Cabecalho containerClassName="max-w-3xl" />
        <main className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center px-5">
          <p className="text-texto-suave">Carregando seu diagnóstico…</p>
        </main>
      </>
    );
  }

  if (estado.tipo === "sem-sessao") {
    return (
      <>
        <Cabecalho containerClassName="max-w-3xl" />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-5 text-center">
          <h1 className="text-2xl text-texto">
            Vamos montar o seu diagnóstico
          </h1>
          <p className="text-texto-suave">
            Responda às 10 perguntas para ver o seu resultado personalizado.
            Leva de 2 a 4 minutos.
          </p>
          <BotaoLink href="/quiz">Fazer meu diagnóstico grátis</BotaoLink>
        </main>
      </>
    );
  }

  return <Resultado diagnostico={estado.diagnostico} />;
}

function Resultado({ diagnostico: d }: { diagnostico: Diagnostico }) {
  return (
    <>
      <Cabecalho containerClassName="max-w-5xl" fixo />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 pb-20 pt-8">
        <div className="mx-auto max-w-3xl">
          {/* HERO */}
          <header className="vpc-vista flex flex-col items-center text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-acento">
              Seu padrão principal
            </p>
            <div className="my-4">
              <EmblemaArquetipo arquetipo={d.arquetipo} className="size-20" />
            </div>
            <h1 className="font-serif text-4xl leading-tight text-texto sm:text-5xl">
              {NOME_ARQUETIPO[d.arquetipo]}
            </h1>
            <p className="mt-3 max-w-md text-pretty text-lg text-texto-suave">
              {d.essencia}
            </p>
          </header>

          {/* CITAÇÃO */}
          <Citacao
            className="vpc-vista mt-8"
            texto={CITACAO_PRINCIPAL.texto}
            autor={CITACAO_PRINCIPAL.autor}
            papel={CITACAO_PRINCIPAL.papel}
          />

          {/* DIAGNÓSTICO */}
          <div className="mt-10">
            <h2 className="mb-4 text-xl text-texto sm:text-2xl">
              O que o seu diagnóstico mostra
            </h2>
            <div className="space-y-4">
              <BlocoResultado
                indice={0}
                tom="destaque"
                icone={<IconeEstrela className="size-4" />}
                etiqueta="O que isso significa"
              >
                <p>{d.resumoArquetipo}</p>
              </BlocoResultado>

              <BlocoResultado indice={1} etiqueta="Por que chegamos aqui">
                <p>{d.explicacao}</p>
              </BlocoResultado>

              <BlocoResultado
                indice={2}
                icone={<IconeBussola className="size-4" />}
                etiqueta="Seu estágio agora"
              >
                <p>{d.descricaoEstagio}</p>
              </BlocoResultado>

              <div className="grid gap-4 sm:grid-cols-2">
                <BlocoResultado
                  indice={3}
                  tom="positivo"
                  icone={<IconeCheck className="size-4" />}
                  etiqueta="O que já está a seu favor"
                >
                  <p>{d.principalAcerto}</p>
                </BlocoResultado>
                <BlocoResultado
                  indice={4}
                  tom="atencao"
                  icone={<IconeAtencao className="size-4" />}
                  etiqueta="O que mais está te prejudicando"
                >
                  <p>{d.pontoDeAtencao}</p>
                </BlocoResultado>
              </div>
            </div>
          </div>

          {/* AÇÃO IMEDIATA */}
          <div
            className="vpc-vista mt-6 rounded-3xl border-2 border-dashed border-primaria-clara bg-superficie p-6 sm:p-7"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="mb-2 flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-primaria text-white">
                <IconeRaio className="size-4" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primaria">
                Comece hoje — de graça
              </p>
            </div>
            <p className="text-[15px] font-medium leading-relaxed text-texto">
              {d.acaoImediata}
            </p>
            <p className="mt-3 text-sm text-texto-suave">
              Essa é só a primeira. O plano completo desdobra isso em 21 dias,
              no seu ritmo.
            </p>
          </div>
        </div>

        {/* PLANO: OFERTA + PROVA SOCIAL */}
        <section id="plano" className="mt-14 scroll-mt-20">
          <div className="mx-auto mb-7 flex max-w-3xl items-center gap-4">
            <span className="h-px flex-1 bg-borda" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-texto-suave">
              Seu próximo passo
            </span>
            <span className="h-px flex-1 bg-borda" />
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="order-2 min-w-0 lg:order-1">
              <Oferta diagnostico={d} />
            </div>
            {/* No celular a conversa vem antes do preço, em evidência. */}
            <div className="order-1 min-w-0 lg:order-2 lg:sticky lg:top-24">
              <ProvaSocial />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/quiz"
              className="text-xs text-texto-suave underline decoration-borda underline-offset-4 transition-colors hover:text-texto"
            >
              Refazer o diagnóstico
            </Link>
          </div>

          <p className="mx-auto mt-8 max-w-md text-center text-xs text-texto-suave">
            O Volta por Cima é uma ferramenta educacional e de reflexão sobre
            relacionamentos. Não substitui acompanhamento psicológico e não faz
            previsões sobre o comportamento de outras pessoas.
          </p>
        </section>
      </main>
    </>
  );
}
