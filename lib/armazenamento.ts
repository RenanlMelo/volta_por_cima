import type { RespostasQuiz, SessaoSalva } from "./diagnostico/tipos";

/**
 * Persistência local da sessão do quiz. Sem backend nesta fatia: as respostas
 * ficam apenas no navegador da usuária (baixa fricção, sem cadastro).
 */
const CHAVE = "volta-por-cima:sessao";

export function salvarSessao(sessao: SessaoSalva): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(sessao));
  } catch {
    // Modo privado ou storage cheio: seguimos sem persistir.
  }
}

/**
 * Salva as respostas junto com a etapa (índice 0-based da pergunta) em que a
 * usuária está. É o que permite retomar o quiz de onde parou ao recarregar.
 */
export function salvarProgresso(respostas: RespostasQuiz, etapa: number): void {
  salvarSessao({ respostas, etapa });
}

export function concluirSessao(respostas: RespostasQuiz): void {
  salvarSessao({ respostas, concluidoEm: new Date().toISOString() });
}

export function lerSessao(): SessaoSalva | null {
  if (typeof window === "undefined") return null;
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const dados = JSON.parse(bruto) as SessaoSalva;
    if (!dados || typeof dados !== "object" || !dados.respostas) return null;
    return dados;
  } catch {
    return null;
  }
}

export function limparSessao(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CHAVE);
  } catch {
    // ignora
  }
}
