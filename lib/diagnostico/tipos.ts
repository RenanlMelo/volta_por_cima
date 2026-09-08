// Tipos centrais do diagnóstico "Volta por Cima".

export type IdPergunta =
  | "p1"
  | "p2"
  | "p3"
  | "p4"
  | "p5"
  | "p6"
  | "p7"
  | "p8"
  | "p9"
  | "p10";

export type TipoResposta = "unica" | "multipla";

export interface Opcao {
  valor: string;
  rotulo: string;
  descricao?: string;
}

export interface Pergunta {
  id: IdPergunta;
  numero: number;
  tipo: TipoResposta;
  enunciado: string;
  auxilio?: string;
  opcoes: Opcao[];
  /** Texto de micro-insight exibido depois que a usuária responde. */
  microInsight?: string;
  /** Valor que, ao ser marcado numa pergunta múltipla, limpa as demais. */
  valorExclusivo?: string;
}

/** Cada resposta é sempre um array de valores. "unica" tem tamanho 1. */
export type RespostasQuiz = Partial<Record<IdPergunta, string[]>>;

export type Arquetipo = "corrida" | "silencio" | "vitrine" | "explosao";

/** Segmentação do blueprint (seção 6). */
export type Segmento = "s1" | "s2" | "s3" | "s4";

export type Estagio = "inicial" | "intermediario" | "prolongado" | "cronico";

export type NivelContato =
  | "nenhum"
  | "baixo"
  | "intermitente"
  | "aberto"
  | "indefinido";

export interface Diagnostico {
  // --- dimensões calculadas ---
  arquetipo: Arquetipo;
  segmento: Segmento;
  estagio: Estagio;
  nivelContato: NivelContato;
  terceirosEnvolvidos: boolean;
  /** 0 a 5 — quantos comportamentos de monitoramento apareceram na P3. */
  intensidadeCiclo: number;
  objetivo: string;
  prontidao: string;
  estadoEmocional: string;

  // --- conteúdo renderizado na tela de resultado ---
  titulo: string;
  essencia: string;
  resumoArquetipo: string;
  explicacao: string;
  descricaoEstagio: string;
  principalAcerto: string;
  pontoDeAtencao: string;
  acaoImediata: string;
  focoSemana1: string;
}

export interface SessaoSalva {
  /**
   * Id estável da sessão do quiz (gerado no primeiro save). Vai junto no evento
   * enviado à planilha e é o que permitirá casar a conclusão com o checkout.
   */
  id?: string;
  respostas: RespostasQuiz;
  /** Índice (0-based) da pergunta em que a usuária parou. Permite retomar. */
  etapa?: number;
  concluidoEm?: string;
  /** ISO — quando a conclusão já foi registrada na planilha (evita duplicar). */
  enviadoEm?: string;
}
