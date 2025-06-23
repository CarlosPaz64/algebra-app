import { ASTNode } from "../../types/AST";
import { Rule } from "./Rule";
import { RuleStep } from "../../types/RuleStep";
import { ASTToLatex } from "../latex/ASTToLatex";
import { recursivelyApplyRule } from "../rules/RecursivelyApplyRule";
import { deepEquals } from "../rules/DeepEquals"; // ✅ Importante para evitar ciclos

/**
 * El motor de reglas aplica transformaciones algebraicas al AST,
 * una por una, y registra cada paso como una entrada en el historial.
 */
export class RuleEngine {
  private latestAST: ASTNode | null = null; // 🆕 Propiedad para acceder luego

  constructor(private rules: Rule[]) {}

  applyAll(ast: ASTNode): RuleStep[] {
    const steps: RuleStep[] = [];
    let currentAST = ast;
    this.latestAST = currentAST; // 🔄 Inicializamos latestAST
    let step = 1;

    while (true) {
      let transformed: ASTNode | null = null;

      for (const rule of this.rules) {
        console.log(`🔍 Probando regla: ${rule.name}`);

        transformed = recursivelyApplyRule(rule, currentAST);

        if (transformed && !deepEquals(transformed, currentAST)) {
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
          this.latestAST = currentAST; // 🆕 Actualizamos latestAST
          break;
        } else {
          console.log(`⛔ No aplica: ${rule.name}`);
        }
      }

      if (!transformed) break;
    }

    return steps;
  }

  // ✅ Nuevo método para exponer el AST final
  getLatestAST(): ASTNode {
    if (!this.latestAST) {
      throw new Error("No se ha aplicado ninguna regla aún.");
    }
    return this.latestAST;
  }
}

