import type { RespostasQuiz } from "./diagnostico/tipos";
import { PERGUNTAS, TOTAL_PERGUNTAS } from "./perguntas";

/**
 * Validação de progresso do quiz (usada ao retomar a sessão salva no
 * localStorage). A regra é simples: a usuária só pode estar numa etapa até,
 * no máximo, a primeira pergunta que ela ainda não respondeu — não dá para
 * "pular" para frente recarregando a página com uma `etapa` adulterada.
 */

/** Índice (0-based) da primeira pergunta ainda sem resposta. */
export function primeiraPerguntaSemResposta(respostas: RespostasQuiz): number {
  const indice = PERGUNTAS.findIndex((pergunta) => {
    const resposta = respostas[pergunta.id];
    return !resposta || resposta.length === 0;
  });
  return indice === -1 ? TOTAL_PERGUNTAS : indice;
}

/** Todas as 10 perguntas respondidas? */
export function quizCompleto(respostas: RespostasQuiz): boolean {
  return primeiraPerguntaSemResposta(respostas) >= TOTAL_PERGUNTAS;
}

/**
 * Devolve um índice de pergunta seguro para retomar o quiz: nunca antes de 0,
 * nunca além da primeira pergunta sem resposta, nunca fora do intervalo.
 */
export function etapaSegura(
  etapaSalva: number | undefined,
  respostas: RespostasQuiz,
): number {
  const limite = primeiraPerguntaSemResposta(respostas);
  const alvo = Number.isInteger(etapaSalva) ? (etapaSalva as number) : 0;
  return Math.max(0, Math.min(alvo, limite, TOTAL_PERGUNTAS - 1));
}
