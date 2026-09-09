"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Botao } from "@/components/Botao";
import { Cabecalho } from "@/components/Cabecalho";
import { Citacao } from "@/components/Citacao";
import { PrintRelato } from "@/components/PrintRelato";
import { BarraProgresso } from "@/components/quiz/BarraProgresso";
import { CartaoOpcao } from "@/components/quiz/CartaoOpcao";
import { TelaCarregamento } from "@/components/quiz/TelaCarregamento";
import { TelaProcessamento } from "@/components/quiz/TelaProcessamento";
import {
  concluirSessao,
  lerSessao,
  salvarProgresso,
} from "@/lib/armazenamento";
import { registrarConclusaoQuiz } from "@/lib/eventos";
import { AUTOR_METODO } from "@/lib/citacoes";
import { rastrearPixel } from "@/lib/pixel";
import type { RespostasQuiz } from "@/lib/diagnostico/tipos";
import { PERGUNTAS, TOTAL_PERGUNTAS } from "@/lib/perguntas";
import { etapaSegura, quizCompleto } from "@/lib/progresso";

type Fase = "preparando" | "perguntas" | "processando";
type Extra = { tipo: "insight"; texto: string } | { tipo: "depoimento" } | null;

const ESPERA_AUTO_AVANCO = 320;

export default function QuizPage() {
  const router = useRouter();
  const [fase, setFase] = useState<Fase>("preparando");
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<RespostasQuiz>({});
  const [extra, setExtra] = useState<Extra>(null);
  // Só liga a persistência depois de ler o que já estava salvo, para não
  // sobrescrever a sessão com o estado inicial vazio.
  const [hidratado, setHidratado] = useState(false);

  // Refs para bloquear cliques duplicados e cancelar avanço pendente.
  const travadoRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pergunta = PERGUNTAS[Math.min(indice, TOTAL_PERGUNTAS - 1)];
  const selecionadas = respostas[pergunta.id] ?? [];

  // Retoma a sessão salva: valida em que etapa a usuária parou e restaura as
  // respostas de cada pergunta. Roda uma única vez, na montagem.
  useEffect(() => {
    const sessao = lerSessao();
    const emAndamento =
      !!sessao &&
      !sessao.concluidoEm &&
      Object.keys(sessao.respostas ?? {}).length > 0;

    if (emAndamento && sessao) {
      const faseInicial: Fase = quizCompleto(sessao.respostas)
        ? "processando"
        : "perguntas";
      const indiceInicial = etapaSegura(sessao.etapa, sessao.respostas);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratação única na montagem
      setRespostas(sessao.respostas);
      setIndice(indiceInicial);
      setFase(faseInicial);
    }
    setHidratado(true);
  }, []);

  // Persiste as respostas e a etapa atual conforme a usuária avança.
  useEffect(() => {
    if (!hidratado) return;
    if (Object.keys(respostas).length === 0) return;
    salvarProgresso(respostas, indice);
  }, [hidratado, respostas, indice]);

  // Limpa qualquer avanço pendente ao desmontar.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Ao mudar a tela visível: cancela avanço pendente e libera a trava.
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    travadoRef.current = false;
  }, [indice, extra, fase]);

  function registrar(valores: string[]) {
    setRespostas((atual) => ({ ...atual, [pergunta.id]: valores }));
  }

  function irParaProcessamento() {
    setExtra(null);
    setFase("processando");
  }

  function avancarPergunta() {
    setExtra(null);
    if (indice >= TOTAL_PERGUNTAS - 1) {
      irParaProcessamento();
    } else {
      setIndice(indice + 1);
    }
  }

  /** Decide o que aparece depois de responder a pergunta atual. */
  function seguir() {
    if (pergunta.microInsight) {
      setExtra({ tipo: "insight", texto: pergunta.microInsight });
    } else if (pergunta.id === "p8") {
      setExtra({ tipo: "depoimento" });
    } else {
      avancarPergunta();
    }
  }

  function escolherUnica(valor: string) {
    if (travadoRef.current) return;
    travadoRef.current = true;
    registrar([valor]);
    timeoutRef.current = setTimeout(seguir, ESPERA_AUTO_AVANCO);
  }

  function alternarMultipla(valor: string) {
    const exclusivo = pergunta.valorExclusivo;
    let proximo: string[];
    if (valor === exclusivo) {
      proximo = selecionadas.includes(valor) ? [] : [valor];
    } else {
      const semExclusivo = selecionadas.filter((v) => v !== exclusivo);
      proximo = semExclusivo.includes(valor)
        ? semExclusivo.filter((v) => v !== valor)
        : [...semExclusivo, valor];
    }
    registrar(proximo);
  }

  function continuarMultipla() {
    if (travadoRef.current || selecionadas.length === 0) return;
    travadoRef.current = true;
    seguir();
  }

  function continuarExtra() {
    if (travadoRef.current) return;
    travadoRef.current = true;
    avancarPergunta();
  }

  function voltar() {
    if (extra) {
      setExtra(null);
      return;
    }
    if (indice === 0) {
      router.push("/");
    } else {
      setIndice(indice - 1);
    }
  }

  function finalizarProcessamento() {
    concluirSessao(respostas);
    // Registro anônimo da conclusão na planilha. Não bloqueia a navegação.
    void registrarConclusaoQuiz(respostas);
    // Concluir o quiz = lead (Meta Pixel).
    rastrearPixel("Lead", { content_name: "Diagnóstico Volta por Cima" });
    router.push("/resultado");
  }

  const iniciarPerguntas = useCallback(() => setFase("perguntas"), []);

  const chaveVista =
    fase === "perguntas"
      ? extra
        ? `extra-${pergunta.id}`
        : pergunta.id
      : fase;

  // Enquanto lê a sessão salva, evita piscar a tela de carregamento para quem
  // está só retomando o quiz.
  if (!hidratado) {
    return (
      <>
        <Cabecalho containerClassName="max-w-xl" />
        <main className="mx-auto w-full max-w-xl flex-1 px-5 pb-16 pt-6" />
      </>
    );
  }

  return (
    <>
      <Cabecalho containerClassName="max-w-xl" />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 pb-16 pt-6">
        {fase === "perguntas" ? (
          <div className="mb-6 space-y-3">
            <BarraProgresso numero={pergunta.numero} total={TOTAL_PERGUNTAS} />
            <button
              type="button"
              onClick={voltar}
              className="-ml-1 inline-flex items-center gap-1.5 rounded-full border border-borda bg-superficie px-3 py-1.5 text-sm font-medium text-texto-suave transition-colors hover:border-primaria hover:bg-primaria hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria"
            >
              <svg viewBox="0 0 20 20" fill="none" className="size-4">
                <path
                  d="M12 15l-5-5 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Voltar
            </button>
          </div>
        ) : null}

        <div key={chaveVista} className="vpc-vista flex flex-1 flex-col">
          {fase === "preparando" ? (
            <section className="flex-1">
              <TelaCarregamento aoConcluir={iniciarPerguntas} />
            </section>
          ) : fase === "processando" ? (
            <section className="flex-1">
              <TelaProcessamento aoConcluir={finalizarProcessamento} />
            </section>
          ) : extra?.tipo === "insight" ? (
            <section className="flex flex-1 flex-col justify-center">
              <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.15em] text-texto-suave">
                Antes de continuar, uma pausa
              </p>
              <Citacao texto={extra.texto} autor={AUTOR_METODO} />
              <div className="mt-8 flex justify-end">
                <Botao onClick={continuarExtra}>Continuar</Botao>
              </div>
            </section>
          ) : extra?.tipo === "depoimento" ? (
            <section className="flex flex-1 flex-col justify-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-acento">
                Você está quase no fim
              </p>
              <p className="mb-3 text-pretty text-sm text-texto-suave">
                Antes das duas últimas perguntas: um pedaço de conversa que
                muita gente reconhece.
              </p>
              <PrintRelato
                src="/relato1.png"
                alt="Print de uma conversa mostrando um ex tentando reaproximação depois de um término"
                width={1170}
                height={2532}
                className="mx-auto w-full max-w-[320px]"
              />
              <div className="mt-5 flex justify-end">
                <Botao onClick={continuarExtra}>Continuar</Botao>
              </div>
            </section>
          ) : (
            <section className="flex flex-1 flex-col">
              <h2 className="text-balance text-2xl leading-snug text-texto">
                {pergunta.enunciado}
              </h2>
              {pergunta.auxilio ? (
                <p className="mt-2 text-sm text-texto-suave">
                  {pergunta.auxilio}
                </p>
              ) : null}

              <div className="vpc-cascata mt-6 space-y-3">
                {pergunta.opcoes.map((opcao) => (
                  <CartaoOpcao
                    key={opcao.valor}
                    opcao={opcao}
                    multipla={pergunta.tipo === "multipla"}
                    selecionada={selecionadas.includes(opcao.valor)}
                    onClick={() =>
                      pergunta.tipo === "multipla"
                        ? alternarMultipla(opcao.valor)
                        : escolherUnica(opcao.valor)
                    }
                  />
                ))}
              </div>

              {pergunta.tipo === "multipla" ? (
                <div className="mt-8 flex justify-end">
                  <Botao
                    onClick={continuarMultipla}
                    disabled={selecionadas.length === 0}
                  >
                    Continuar
                  </Botao>
                </div>
              ) : null}
            </section>
          )}
        </div>
      </main>
    </>
  );
}
