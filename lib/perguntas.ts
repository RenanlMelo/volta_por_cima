import type { Pergunta } from "./diagnostico/tipos";

/**
 * As 10 perguntas do Diagnóstico Volta por Cima (blueprint, seção 8).
 * Uma pergunta por tela, linguagem acolhedora, nenhuma resposta julga a usuária.
 */
export const PERGUNTAS: Pergunta[] = [
  {
    id: "p1",
    numero: 1,
    tipo: "unica",
    enunciado: "Qual dessas situações descreve melhor o que está acontecendo?",
    opcoes: [
      { valor: "ele-terminou", rotulo: "Ele terminou comigo." },
      { valor: "eu-terminei", rotulo: "Eu terminei e me arrependi." },
      {
        valor: "ficante",
        rotulo: "Era um ficante ou quase namoro, e ele se afastou.",
      },
      {
        valor: "juntos-distante",
        rotulo: "Ainda estamos juntos, mas ele está distante.",
      },
    ],
  },
  {
    id: "p2",
    numero: 2,
    tipo: "unica",
    enunciado: "Há quanto tempo isso está acontecendo?",
    opcoes: [
      { valor: "menos-2-semanas", rotulo: "Menos de 2 semanas." },
      { valor: "2-semanas-2-meses", rotulo: "Entre 2 semanas e 2 meses." },
      { valor: "2-6-meses", rotulo: "Entre 2 e 6 meses." },
      { valor: "mais-6-meses", rotulo: "Mais de 6 meses." },
    ],
  },
  {
    id: "p3",
    numero: 3,
    tipo: "multipla",
    enunciado:
      "Quando a gente sente falta de alguém, é normal fazer algumas coisas quase no automático. Nos últimos dias, você se pegou fazendo alguma delas?",
    auxilio:
      "Aqui ninguém julga. Marque as que aconteceram — pode ser mais de uma.",
    valorExclusivo: "nenhuma",
    opcoes: [
      { valor: "stories", rotulo: "Fiquei olhando os stories dele." },
      { valor: "reli-conversas", rotulo: "Reli conversas antigas nossas." },
      {
        valor: "mandei-arrependi",
        rotulo: "Mandei uma mensagem e depois queria ter apagado.",
      },
      { valor: "perguntei-alguem", rotulo: "Perguntei dele para alguém." },
      { valor: "esperando", rotulo: "Fiquei esperando ele dar um sinal." },
      { valor: "nenhuma", rotulo: "Nenhuma dessas, por enquanto." },
    ],
    microInsight:
      "Quando estamos emocionalmente envolvidos, o cérebro procura pequenos sinais para reduzir a incerteza. Não é falta de força de vontade — é assim que a gente funciona. O problema é que esses sinais podem manter você presa ao mesmo ciclo.",
  },
  {
    id: "p4",
    numero: 4,
    tipo: "unica",
    enunciado: "Como essa pessoa está se comportando atualmente?",
    opcoes: [
      { valor: "nao-fala", rotulo: "Não fala comigo." },
      { valor: "basico", rotulo: "Responde apenas o básico." },
      { valor: "aparece-some", rotulo: "Aparece e desaparece." },
      { valor: "conversa-normal", rotulo: "Conversa normalmente." },
      {
        valor: "interesse-momentos",
        rotulo: "Demonstra interesse em alguns momentos.",
      },
      { valor: "nao-sei-dizer", rotulo: "Não sei dizer." },
    ],
  },
  {
    id: "p5",
    numero: 5,
    tipo: "unica",
    enunciado: "Existe outra pessoa envolvida?",
    auxilio:
      "Usamos isso apenas para personalizar o diagnóstico — não para fazer previsões.",
    opcoes: [
      { valor: "sim", rotulo: "Sim." },
      { valor: "acho-que-sim", rotulo: "Acho que sim." },
      { valor: "nao", rotulo: "Não." },
      { valor: "nao-sei", rotulo: "Não sei." },
    ],
  },
  {
    id: "p6",
    numero: 6,
    tipo: "unica",
    enunciado:
      "Quando sente saudade ou ansiedade, qual costuma ser a sua reação?",
    opcoes: [
      {
        valor: "corrida",
        rotulo: "Corrida",
        descricao: "Procuro contato imediatamente.",
      },
      {
        valor: "silencio",
        rotulo: "Silêncio",
        descricao: "Não procuro, mas fico sofrendo e esperando.",
      },
      {
        valor: "vitrine",
        rotulo: "Vitrine",
        descricao:
          "Tento mostrar que estou ótima, esperando que a pessoa perceba.",
      },
      {
        valor: "explosao",
        rotulo: "Explosão",
        descricao: "Reajo emocionalmente e depois me arrependo.",
      },
    ],
  },
  {
    id: "p7",
    numero: 7,
    tipo: "multipla",
    enunciado: "O que você já tentou fazer?",
    auxilio: "Pode marcar mais de uma.",
    valorExclusivo: "nada",
    opcoes: [
      { valor: "conversar", rotulo: "Conversar abertamente." },
      { valor: "contato-zero", rotulo: "Contato zero." },
      { valor: "sumir-redes", rotulo: "Sumir das redes." },
      { valor: "conselhos", rotulo: "Pedir conselhos." },
      { valor: "ciumes", rotulo: "Tentar provocar ciúmes." },
      { valor: "esperar", rotulo: "Ficar esperando." },
      { valor: "nada", rotulo: "Nada ainda." },
    ],
  },
  {
    id: "p8",
    numero: 8,
    tipo: "unica",
    enunciado: "Como você se sente em relação a você mesma neste momento?",
    opcoes: [
      { valor: "perdi-parte", rotulo: "Sinto que perdi uma parte de mim." },
      { valor: "dias-bons-ruins", rotulo: "Tenho dias bons e dias ruins." },
      { valor: "relativamente-bem", rotulo: "Estou relativamente bem." },
      {
        valor: "bem-mas-quero-volta",
        rotulo: "Estou bem, mas ainda quero essa pessoa de volta.",
      },
    ],
  },
  {
    id: "p9",
    numero: 9,
    tipo: "unica",
    enunciado: "O que você gostaria de conseguir agora?",
    opcoes: [
      { valor: "reconstruir", rotulo: "Tentar reconstruir a relação." },
      {
        valor: "entender-possibilidade",
        rotulo: "Entender se existe possibilidade de reconexão.",
      },
      { valor: "parar-sofrer", rotulo: "Parar de sofrer tanto." },
      { valor: "autoestima", rotulo: "Recuperar minha autoestima." },
      {
        valor: "vale-a-pena",
        rotulo: "Descobrir se vale a pena tentar novamente.",
      },
      { valor: "todas", rotulo: "Quero todas as anteriores." },
    ],
  },
  {
    id: "p10",
    numero: 10,
    tipo: "unica",
    enunciado:
      "Se desse para começar a aliviar essa dor ainda hoje, com um passo de cada vez, você ia querer?",
    auxilio: "Sua resposta ajusta o tom do plano que vamos montar para você.",
    opcoes: [
      { valor: "sim-hoje", rotulo: "Sim. Quero começar hoje mesmo." },
      {
        valor: "sim-medo",
        rotulo: "Quero, mas tenho medo de fazer errado de novo.",
      },
      { valor: "nao-certeza", rotulo: "Ainda estou juntando forças." },
    ],
  },
];

export const TOTAL_PERGUNTAS = PERGUNTAS.length;
