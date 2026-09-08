import type { RespostasQuiz, SessaoSalva } from "./diagnostico/tipos";

/**
 * Persistência local da sessão do quiz. As respostas ficam no navegador da
 * usuária (baixa fricção, sem cadastro). A única coisa que sai daqui para fora
 * é o evento anônimo de conclusão, enviado à planilha por `lib/eventos.ts`.
 */
const CHAVE = "volta-por-cima:sessao";

function novoId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

export function salvarSessao(sessao: SessaoSalva): void {
  if (typeof window === "undefined") return;
  try {
    // Preserva o id já existente (ou cria um) para a sessão ter identidade
    // estável entre o começo do quiz, a conclusão e o checkout futuro.
    const anterior = lerSessao();
    const completa: SessaoSalva = {
      ...sessao,
      id: sessao.id ?? anterior?.id ?? novoId(),
    };
    window.localStorage.setItem(CHAVE, JSON.stringify(completa));
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

/** Marca que a conclusão desta sessão já foi registrada na planilha. */
export function marcarSessaoEnviada(): void {
  const sessao = lerSessao();
  if (!sessao) return;
  salvarSessao({ ...sessao, enviadoEm: new Date().toISOString() });
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
