/**
 * Validação exaustiva: garante que TODA combinação de respostas produz um
 * diagnóstico completo e coerente (nenhum campo textual vazio, todos os enums
 * dentro do domínio esperado). Roda com `npx tsx scripts/validar-todos-caminhos.ts`.
 */
import { calcularDiagnostico } from "../lib/diagnostico/motor";
import type { Diagnostico, RespostasQuiz } from "../lib/diagnostico/tipos";
import { PERGUNTAS } from "../lib/perguntas";

const P: Record<string, string[]> = {};
for (const pergunta of PERGUNTAS) {
  P[pergunta.id] = pergunta.opcoes.map((o) => o.valor);
}

/** Powerset completo (usado no teste dedicado de múltipla escolha). */
function powerset(valores: string[], exclusivo: string): string[][] {
  const normais = valores.filter((v) => v !== exclusivo);
  const combos: string[][] = [[exclusivo]];
  const total = 1 << normais.length;
  for (let mascara = 0; mascara < total; mascara++) {
    const sub: string[] = [];
    for (let i = 0; i < normais.length; i++) {
      if (mascara & (1 << i)) sub.push(normais[i]);
    }
    combos.push(sub);
  }
  return combos;
}

const p3Full = powerset(P.p3, "nenhuma");
const p7Full = powerset(P.p7, "nada");

/** Subconjuntos representativos para o cartesiano grande. */
const p3Combos: string[][] = [
  [],
  ["nenhuma"],
  ["stories"],
  ["stories", "reli-conversas"],
  ["stories", "reli-conversas", "mandei-arrependi"],
  P.p3.filter((v) => v !== "nenhuma"),
];
const p7Combos: string[][] = [
  [],
  ["nada"],
  ["ciumes"],
  ["contato-zero"],
  ["sumir-redes"],
  ["conversar"],
  ["conselhos"],
  ["ciumes", "contato-zero", "conversar"],
  P.p7.filter((v) => v !== "nada"),
];

const CAMPOS_TEXTO: (keyof Diagnostico)[] = [
  "titulo",
  "essencia",
  "resumoArquetipo",
  "explicacao",
  "descricaoEstagio",
  "principalAcerto",
  "pontoDeAtencao",
  "acaoImediata",
  "focoSemana1",
];

const ARQUETIPOS = ["corrida", "silencio", "vitrine", "explosao"];
const SEGMENTOS = ["s1", "s2", "s3", "s4"];
const ESTAGIOS = ["inicial", "intermediario", "prolongado", "cronico"];
const CONTATOS = ["nenhum", "baixo", "intermitente", "aberto", "indefinido"];

let testados = 0;
const falhas: { respostas: RespostasQuiz; motivo: string }[] = [];

function checar(respostas: RespostasQuiz) {
  testados++;
  let d: Diagnostico;
  try {
    d = calcularDiagnostico(respostas);
  } catch (e) {
    falhas.push({ respostas, motivo: `exceção: ${(e as Error).message}` });
    return;
  }
  for (const campo of CAMPOS_TEXTO) {
    const valor = d[campo];
    if (typeof valor !== "string" || valor.trim().length < 12) {
      falhas.push({
        respostas,
        motivo: `campo "${campo}" vazio/curto: ${JSON.stringify(valor)}`,
      });
    }
  }
  if (!ARQUETIPOS.includes(d.arquetipo))
    falhas.push({ respostas, motivo: `arquetipo inválido: ${d.arquetipo}` });
  if (!SEGMENTOS.includes(d.segmento))
    falhas.push({ respostas, motivo: `segmento inválido: ${d.segmento}` });
  if (!ESTAGIOS.includes(d.estagio))
    falhas.push({ respostas, motivo: `estagio inválido: ${d.estagio}` });
  if (!CONTATOS.includes(d.nivelContato))
    falhas.push({
      respostas,
      motivo: `nivelContato inválido: ${d.nivelContato}`,
    });
}

// ---- Cartesiano completo sobre as perguntas de escolha única + combos de múltipla ----
for (const p1 of P.p1)
  for (const p2 of P.p2)
    for (const p4 of P.p4)
      for (const p5 of P.p5)
        for (const p6 of P.p6)
          for (const p8 of P.p8)
            for (const p9 of P.p9)
              for (const p10 of P.p10)
                for (const p3 of p3Combos)
                  for (const p7 of p7Combos) {
                    checar({
                      p1: [p1],
                      p2: [p2],
                      p3,
                      p4: [p4],
                      p5: [p5],
                      p6: [p6],
                      p7,
                      p8: [p8],
                      p9: [p9],
                      p10: [p10],
                    });
                  }

// ---- Teste dedicado: powerset COMPLETO de P3 e P7 (todas as marcações) ----
for (const p3 of p3Full)
  for (const p7 of p7Full)
    for (const p1 of P.p1)
      for (const p6 of P.p6) {
        checar({
          p1: [p1],
          p2: ["2-6-meses"],
          p3,
          p4: ["aparece-some"],
          p5: ["nao"],
          p6: [p6],
          p7,
          p8: ["dias-bons-ruins"],
          p9: ["todas"],
          p10: ["sim-medo"],
        });
      }

// ---- Casos degenerados: respostas ausentes, parciais ou inválidas ----
checar({});
checar({ p1: [] });
checar({ p6: ["silencio"] });
checar({ p1: ["ele-terminou"], p6: ["corrida"] });
checar({
  p1: ["valor-inexistente"],
  p6: ["outro-invalido"],
  p2: ["xyz"],
  p4: ["???"],
});
checar({ p3: [], p7: [] });
checar({ p1: ["juntos-distante"] });

console.log(`Caminhos testados: ${testados.toLocaleString("pt-BR")}`);
if (falhas.length === 0) {
  console.log(
    "✓ Todos os caminhos geraram um diagnóstico completo e coerente.",
  );
  process.exit(0);
} else {
  console.error(`✗ ${falhas.length} falha(s):`);
  for (const f of falhas.slice(0, 20)) {
    console.error("  -", f.motivo, "|", JSON.stringify(f.respostas));
  }
  process.exit(1);
}
