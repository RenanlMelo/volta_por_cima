import { calcularDiagnostico } from "../lib/diagnostico/motor";
import type { RespostasQuiz } from "../lib/diagnostico/tipos";

const cenarios: { nome: string; respostas: RespostasQuiz }[] = [
  {
    nome: "S1 + Corrida + recente + sem contato",
    respostas: {
      p1: ["ele-terminou"],
      p2: ["menos-2-semanas"],
      p3: ["stories", "reli-conversas", "esperando"],
      p4: ["nao-fala"],
      p5: ["nao"],
      p6: ["corrida"],
      p7: ["esperar"],
      p8: ["perdi-parte"],
      p9: ["reconstruir"],
      p10: ["sim-comecar"],
    },
  },
  {
    nome: "S2 + Silêncio + 2-6 meses + básico + ciúmes",
    respostas: {
      p1: ["eu-terminei"],
      p2: ["2-6-meses"],
      p3: ["nenhuma"],
      p4: ["basico"],
      p5: ["acho-que-sim"],
      p6: ["silencio"],
      p7: ["ciumes", "contato-zero"],
      p8: ["dias-bons-ruins"],
      p9: ["vale-a-pena"],
      p10: ["sim-medo"],
    },
  },
  {
    nome: "S4 + Explosão + juntos + conversa normal",
    respostas: {
      p1: ["juntos-distante"],
      p2: ["mais-6-meses"],
      p3: ["mandei-arrependi"],
      p4: ["conversa-normal"],
      p5: ["nao"],
      p6: ["explosao"],
      p7: ["conversar"],
      p8: ["relativamente-bem"],
      p9: ["todas"],
      p10: ["nao-certeza"],
    },
  },
];

for (const c of cenarios) {
  const d = calcularDiagnostico(c.respostas);
  console.log("\n=== " + c.nome + " ===");
  console.log({
    arquetipo: d.arquetipo,
    segmento: d.segmento,
    estagio: d.estagio,
    nivelContato: d.nivelContato,
    terceiros: d.terceirosEnvolvidos,
    intensidadeCiclo: d.intensidadeCiclo,
  });
  console.log("Título:", d.titulo);
  console.log("Acerto:", d.principalAcerto);
  console.log("Atenção:", d.pontoDeAtencao);
  console.log("Foco:", d.focoSemana1);
}
