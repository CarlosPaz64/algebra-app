import { ASTNode } from "../../types/AST";
import { Rule } from "./Rule";
import { RuleStep } from "../../types/RuleStep";
import { ASTToLatex } from "../latex/ASTToLatex";

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

    for (const rule of this.rules) {
      const transformed = rule.apply(currentAST);

      if (transformed) {
        const stepData: RuleStep = {
          stepNumber: step++,
          description: rule.description(currentAST),
          ast: transformed,
          latex: ASTToLatex(transformed),
        };

        steps.push(stepData);
        currentAST = transformed;
      }
    }

    return steps;
  }
}