import {
  ACAO_IMEDIATA,
  DESCRICAO_CONTATO,
  DESCRICAO_ESTAGIO,
  DESCRICAO_OBJETIVO,
  DESCRICAO_SEGMENTO,
  ESSENCIA_ARQUETIPO,
  FOCO_POR_COMBINACAO,
  FOCO_SEMANA_1,
  NOME_ARQUETIPO,
  RESUMO_ARQUETIPO,
} from "./conteudos";
import type {
  Arquetipo,
  Diagnostico,
  Estagio,
  NivelContato,
  RespostasQuiz,
  Segmento,
} from "./tipos";

/** Lê a primeira (e única) resposta de uma pergunta de escolha única. */
function valorUnico(respostas: RespostasQuiz, id: keyof RespostasQuiz): string {
  return respostas[id]?.[0] ?? "";
}

function lista(respostas: RespostasQuiz, id: keyof RespostasQuiz): string[] {
  return respostas[id] ?? [];
}

const SEGMENTO_POR_P1: Record<string, Segmento> = {
  "ele-terminou": "s1",
  "eu-terminei": "s2",
  ficante: "s3",
  "juntos-distante": "s4",
};

const ESTAGIO_POR_P2: Record<string, Estagio> = {
  "menos-2-semanas": "inicial",
  "2-semanas-2-meses": "intermediario",
  "2-6-meses": "prolongado",
  "mais-6-meses": "cronico",
};

const CONTATO_POR_P4: Record<string, NivelContato> = {
  "nao-fala": "nenhum",
  basico: "baixo",
  "aparece-some": "intermitente",
  "conversa-normal": "aberto",
  "interesse-momentos": "intermitente",
  "nao-sei-dizer": "indefinido",
};

const ARQUETIPOS_VALIDOS: Arquetipo[] = [
  "corrida",
  "silencio",
  "vitrine",
  "explosao",
];

/**
 * Motor determinístico (blueprint, seção 22). Combina situação, tempo,
 * comportamento da outra pessoa, padrão, tentativas, estado emocional e objetivo
 * para produzir um diagnóstico personalizado — sem previsões sobre terceiros.
 *
 * Garantia: qualquer combinação de respostas (inclusive respostas ausentes ou
 * inválidas) produz um diagnóstico completo e coerente. Nenhum campo textual
 * volta vazio.
 */
export function calcularDiagnostico(respostas: RespostasQuiz): Diagnostico {
  const entrada = respostas ?? {};

  const p1 = valorUnico(entrada, "p1");
  const p4 = valorUnico(entrada, "p4");
  const p5 = valorUnico(entrada, "p5");
  const p6 = valorUnico(entrada, "p6");
  const p8 = valorUnico(entrada, "p8");
  const p9 = valorUnico(entrada, "p9");
  const p10 = valorUnico(entrada, "p10");
  const p3 = lista(entrada, "p3");
  const p7 = lista(entrada, "p7");

  const segmento: Segmento = SEGMENTO_POR_P1[p1] ?? "s1";
  const estagio: Estagio =
    ESTAGIO_POR_P2[valorUnico(entrada, "p2")] ?? "intermediario";
  const nivelContato: NivelContato = CONTATO_POR_P4[p4] ?? "indefinido";
  const arquetipo: Arquetipo = ARQUETIPOS_VALIDOS.includes(p6 as Arquetipo)
    ? (p6 as Arquetipo)
    : "silencio";

  const terceirosEnvolvidos = p5 === "sim" || p5 === "acho-que-sim";
  const intensidadeCiclo = p3.filter((v) => v !== "nenhuma").length;

  return {
    arquetipo,
    segmento,
    estagio,
    nivelContato,
    terceirosEnvolvidos,
    intensidadeCiclo,
    objetivo: p9,
    prontidao: p10,
    estadoEmocional: p8,

    titulo: `Seu padrão principal: ${NOME_ARQUETIPO[arquetipo]}`,
    essencia: ESSENCIA_ARQUETIPO[arquetipo],
    resumoArquetipo: RESUMO_ARQUETIPO[arquetipo],
    explicacao: montarExplicacao({
      arquetipo,
      segmento,
      contato: nivelContato,
      terceiros: terceirosEnvolvidos,
      objetivo: p9,
    }),
    descricaoEstagio: DESCRICAO_ESTAGIO[estagio],
    principalAcerto: montarAcerto({ arquetipo, intensidadeCiclo, p7, p8, p10 }),
    pontoDeAtencao: montarPontoDeAtencao({ arquetipo, intensidadeCiclo, p7 }),
    acaoImediata: ACAO_IMEDIATA[arquetipo],
    focoSemana1:
      FOCO_POR_COMBINACAO[`${segmento}-${arquetipo}`] ?? FOCO_SEMANA_1[arquetipo],
  };
}

function montarExplicacao(dados: {
  arquetipo: Arquetipo;
  segmento: Segmento;
  contato: NivelContato;
  terceiros: boolean;
  objetivo: string;
}): string {
  const { arquetipo, segmento, contato, terceiros, objetivo } = dados;

  const partes = [
    `Você respondeu que, diante da saudade, a sua reação costuma ser "${NOME_ARQUETIPO[arquetipo]}".`,
    `Somando isso ao fato de que ${DESCRICAO_SEGMENTO[segmento]} e a que ${DESCRICAO_CONTATO[contato]},`,
    "o diagnóstico aponta para onde a sua energia está indo agora — e onde ela renderia mais.",
  ];

  const desejo = DESCRICAO_OBJETIVO[objetivo];
  if (desejo) {
    partes.push(`Você também disse que, agora, quer ${desejo}`);
  }

  if (terceiros) {
    partes.push(
      "Você indicou que pode haver outra pessoa envolvida. Isso não muda o seu próximo passo: seguimos focando no que está sob o seu controle, não em adivinhar a escolha de ninguém.",
    );
  }
  return partes.join(" ");
}

function montarAcerto(dados: {
  arquetipo: Arquetipo;
  intensidadeCiclo: number;
  p7: string[];
  p8: string;
  p10: string;
}): string {
  const { intensidadeCiclo, p7, p8, p10 } = dados;

  if (intensidadeCiclo === 0) {
    return "Nos últimos dias, você não alimentou o ciclo de monitoramento (stories, conversas antigas, perguntar dele para os outros). Isso é mais raro do que parece e é uma base sólida para começar.";
  }
  if (p7.includes("contato-zero") || p7.includes("sumir-redes")) {
    return "Você já conseguiu criar algum espaço, tentando contato zero ou se afastando das redes. O próximo passo é usar esse espaço a seu favor, e não só contar os dias.";
  }
  if (p8 === "relativamente-bem") {
    return "Mesmo no meio disso tudo, você ainda consegue manter contato com a sua própria vida. Esse é o fio que a gente vai puxar.";
  }
  if (p10 === "sim-hoje") {
    return "Você chegou aqui pronta para agir. Prontidão é combustível: o plano existe justamente para direcionar essa energia.";
  }
  if (p7.includes("conversar")) {
    return "Você já tentou conversar abertamente em vez de agir por jogos indiretos. Essa é a base certa — o que muda no plano é o timing e a forma.";
  }
  return "Você teve a coragem de olhar para a situação de frente e responder a essas perguntas com honestidade. Clareza começa exatamente aí.";
}

function montarPontoDeAtencao(dados: {
  arquetipo: Arquetipo;
  intensidadeCiclo: number;
  p7: string[];
}): string {
  const { arquetipo, intensidadeCiclo, p7 } = dados;

  if (p7.includes("ciumes")) {
    return "Tentar provocar ciúmes costuma cobrar um preço alto: coloca você numa posição de disputa e transfere o controle da situação para a reação dele. Esse é o comportamento que mais provavelmente está te prejudicando agora.";
  }
  if (intensidadeCiclo >= 3) {
    return "O monitoramento constante — stories, conversas antigas, perguntar dele para os outros — mantém a ferida aberta e dá a sensação de proximidade sem nenhum retorno real. É aqui que a maior parte da sua energia está vazando.";
  }

  const porArquetipo: Record<Arquetipo, string> = {
    corrida:
      "O impulso de buscar contato assim que a ansiedade aperta. Cada mensagem enviada nesse estado costuma voltar como arrependimento e reforça o ciclo.",
    silencio:
      "Manter a distância por fora sem trabalhar o que acontece por dentro. O tempo passa, mas a expectativa continua intacta.",
    vitrine:
      "Enquanto a reação dele for o objetivo das suas escolhas, a sua rotina continua girando em torno dele — mesmo que por fora pareça o contrário.",
    explosao:
      "As decisões tomadas no calor da emoção. Elas costumam encurtar as suas opções e deixar você com menos margem no dia seguinte.",
  };
  return porArquetipo[arquetipo] ?? porArquetipo.silencio;
}
