import type { Arquetipo, Estagio, NivelContato, Segmento } from "./tipos";

/**
 * Textos determinísticos do diagnóstico. Nada aqui promete o comportamento de
 * terceiros nem usa afirmações pseudocientíficas (blueprint, seções 12 e 26).
 */

export const NOME_ARQUETIPO: Record<Arquetipo, string> = {
  corrida: "Corrida",
  silencio: "Silêncio",
  vitrine: "Vitrine",
  explosao: "Explosão",
};

/** Uma linha curta que resume a essência do padrão (usada como subtítulo). */
export const ESSENCIA_ARQUETIPO: Record<Arquetipo, string> = {
  corrida: "Você tenta baixar a ansiedade buscando contato.",
  silencio: "Você mantém a distância, mas continua esperando por dentro.",
  vitrine: "Você mostra que está bem enquanto espera a reação dele.",
  explosao: "A emoção do momento acaba decidindo por você.",
};

export const RESUMO_ARQUETIPO: Record<Arquetipo, string> = {
  corrida:
    "Você tenta reduzir a ansiedade buscando contato. Seu maior desafio agora não é encontrar a mensagem perfeita — é interromper o ciclo reação → ansiedade → contato → arrependimento.",
  silencio:
    "Você consegue manter distância, mas continua emocionalmente presa. O problema não é apenas não procurar: é o que acontece dentro de você enquanto espera.",
  vitrine:
    "Você tenta mostrar que está bem enquanto continua esperando uma reação. Sua estratégia externa mudou, mas a expectativa continua no centro da sua rotina.",
  explosao:
    "A emoção intensa acaba influenciando as suas decisões. Antes de pensar em reconexão, você precisa quebrar o ciclo de reação impulsiva.",
};

export const ACAO_IMEDIATA: Record<Arquetipo, string> = {
  corrida:
    "Pelas próximas 24 horas, toda vez que sentir o impulso de mandar mensagem, escreva o que você diria num bloco de notas — e não envie. Releia no dia seguinte, com a cabeça mais fria.",
  silencio:
    "Hoje, reserve 30 minutos para algo que é só seu — um trecho de série, uma caminhada, um banho demorado — com o celular longe do alcance da mão.",
  vitrine:
    "Nas próximas 24 horas, poste ou não poste algo nas redes. O ponto é fazer essa escolha pensando no que você quer, e não no que ele vai achar.",
  explosao:
    "Antes de responder qualquer mensagem dele hoje, espere uma hora e releia a sua resposta antes de enviar. Se estiver muito emocionada, espere até amanhã.",
};

export const DESCRICAO_ESTAGIO: Record<Estagio, string> = {
  inicial:
    "Você está na fase inicial de adaptação ao afastamento. As emoções ainda estão em pico e é esperado que a cabeça não pare. Neste momento, decisões grandes tendem a sair distorcidas.",
  intermediario:
    "Já se passaram algumas semanas. A intensidade costuma oscilar: dias melhores e recaídas. É a fase em que dá para começar a construir rotina sem esperar se sentir 100%.",
  prolongado:
    "Faz alguns meses. Aqui o desafio normalmente é sair do modo espera e voltar a tomar decisões sobre a sua própria vida, independente do que a outra pessoa faça.",
  cronico:
    "Isso se estende há bastante tempo. Vale olhar com honestidade para quanto da sua rotina ainda está organizada em torno dessa expectativa — e o que isso tem custado a você.",
};

export const DESCRICAO_SEGMENTO: Record<Segmento, string> = {
  s1: "foi ele quem terminou e você não queria isso",
  s2: "foi você quem terminou e hoje se arrepende",
  s3: "não havia um compromisso definido e ele se afastou",
  s4: "vocês ainda estão juntos, mas com distância emocional",
};

export const DESCRICAO_CONTATO: Record<NivelContato, string> = {
  nenhum: "hoje não há contato entre vocês",
  baixo: "o contato existe, mas é raso e curto",
  intermitente: "o contato vai e volta, sem constância",
  aberto: "vocês ainda conversam com alguma naturalidade",
  indefinido: "o nível de contato ainda está confuso para você",
};

/** Objetivo declarado na P9, no formato "você quer ...". */
export const DESCRICAO_OBJETIVO: Record<string, string> = {
  reconstruir:
    "tentar reconstruir a relação — e o plano respeita isso, começando pelo que precisa estar de pé antes de qualquer conversa.",
  "entender-possibilidade":
    "entender se ainda existe possibilidade de reconexão — sem forçar uma resposta que só o tempo e as duas pessoas podem dar.",
  "parar-sofrer":
    "parar de sofrer tanto — e esse alívio costuma vir primeiro de recuperar previsibilidade na sua própria rotina.",
  autoestima:
    "recuperar a sua autoestima — voltar a se reconhecer fora do papel de quem está esperando.",
  "vale-a-pena":
    "descobrir se vale a pena tentar de novo — uma decisão que fica mais clara quando você não está no meio da crise.",
  todas:
    "um pouco de tudo: aliviar a dor, recuperar a autoestima e enxergar com clareza se uma nova tentativa faz sentido.",
};

export const FOCO_SEMANA_1: Record<Arquetipo, string> = {
  corrida:
    "Semana 1: controle de impulsos e ausência estratégica — recuperar espaço emocional antes de qualquer conversa.",
  silencio:
    "Semana 1: entender se você quer a pessoa ou está reagindo à perda, e começar a reocupar a sua própria rotina.",
  vitrine:
    "Semana 1: tirar a expectativa da reação dele do centro do dia e redefinir o que você quer para você.",
  explosao:
    "Semana 1: quebrar o ciclo de reação impulsiva e criar um intervalo entre o sentimento e a ação.",
};

/** Ajustes de foco para combinações específicas (blueprint, seção 17). */
export const FOCO_POR_COMBINACAO: Partial<
  Record<`${Segmento}-${Arquetipo}`, string>
> = {
  "s1-corrida":
    "Semana 1: controle de impulsos e ausência estratégica. Como ele terminou e a sua reação é buscar contato, o primeiro passo é recuperar espaço.",
  "s2-silencio":
    "Semana 1: entender se você quer a pessoa de volta ou está reagindo à perda de algo que você mesma decidiu encerrar.",
  "s4-corrida":
    "Semana 1: reduzir a tensão do dia a dia e reabrir conversa sem cobrança, no lugar de perseguir sinais de atenção.",
  "s4-silencio":
    "Semana 1: reaproximar sem cobrança — trazer leveza para a convivência antes de tocar nos assuntos difíceis.",
  "s3-vitrine":
    "Semana 1: parar de performar para alguém que não assumiu compromisso e decidir o que você aceita a partir daqui.",
};
