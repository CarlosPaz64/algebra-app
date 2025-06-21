import { ASTNode } from "../../types/AST";
import { Rule } from "./Rule";
import { RuleStep } from "../../types/RuleStep";
import { ASTToLatex } from "../latex/ASTToLatex";
import { recursivelyApplyRule } from "../rules/RecursivelyApplyRule";

/**
 * El motor de reglas aplica transformaciones algebraicas al AST,
 * una por una, y registra cada paso como una entrada en el historial.
 */
export class RuleEngine {
  constructor(private rules: Rule[]) {}

  /**
   * Aplica todas las reglas disponibles al AST inicial,
   * registrando cada transformación como un paso.
   *
   * @param ast Árbol de sintaxis original
   * @returns Array de pasos aplicados (RuleStep[])
   */
applyAll(ast: ASTNode): RuleStep[] {
  const steps: RuleStep[] = [];
  let currentAST = ast;
  let step = 1;

  while (true) {
    let transformed: ASTNode | null = null;

    for (const rule of this.rules) {
      console.log(`🔍 Probando regla: ${rule.name}`);

      transformed = recursivelyApplyRule(rule, currentAST);

      if (transformed && JSON.stringify(transformed) !== JSON.stringify(currentAST)) {
        console.log(`✅ Regla aplicada: ${rule.name}`);
        console.log("📤 AST transformado:", JSON.stringify(transformed, null, 2));

        const stepData: RuleStep = {
          stepNumber: step++,
          description: rule.description(currentAST),
          ast: transformed,
          latex: ASTToLatex(transformed),
        };

        steps.push(stepData);
        currentAST = transformed;
        break; // 🧠 Muy importante: reinicia desde la primera regla
      } else {
        console.log(`⛔ No aplica: ${rule.name}`);
      }
    }

    if (!transformed) {
      break; // 🚪 Salir cuando ninguna regla aplica más
    }
  }

  return steps;
}

}