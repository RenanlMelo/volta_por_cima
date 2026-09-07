export interface Citacao {
  texto: string;
  autor: string;
  papel: string;
}

/**
 * Citação exibida na tela de resultado.
 *
 * Hoje ela é atribuída ao próprio método — é um princípio do programa, não a
 * fala de um terceiro. Se existir uma pessoa real por trás do Volta por Cima
 * (idealizadora, especialista responsável), troque `autor` pelo nome dela e
 * `papel` pela credencial. Não atribuir a citação a uma pessoa inventada nem a
 * uma autoridade que não exista (blueprint, seção 26).
 */
export const CITACAO_PRINCIPAL: Citacao = {
  texto:
    "Antes de tentar fazer alguém sentir a sua falta, descubra por que você ainda está presa nessa história.",
  autor: "Volta por Cima",
  papel: "princípio que orienta todo o método",
};

/**
 * Assinatura usada nas reflexões que aparecem durante o quiz (blueprint,
 * "micro-insights"). Mesma lógica de atribuição da citação principal: é o
 * método falando, não uma pessoa ou estudo específico inventado.
 */
export const AUTOR_METODO = "— Volta por Cima";
