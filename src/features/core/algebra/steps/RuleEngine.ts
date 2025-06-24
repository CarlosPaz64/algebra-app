import { ASTNode } from "../../types/AST";
import { Rule } from "./Rule";
import { RuleStep } from "../../types/RuleStep";
import { ASTToLatex } from "../latex/ASTToLatex";
import { recursivelyApplyRule } from "../rules/RecursivelyApplyRule";
import { deepEquals } from "../rules/DeepEquals";

// Función para calcular el "tamaño" del árbol AST
function treeSize(node: ASTNode): number {
  if (node.type === "Literal" || node.type === "Variable") return 1;
  if (node.type === "Grouping") return treeSize(node.expression);
  if (node.type === "Operator") return 1 + treeSize(node.left) + treeSize(node.right);
  if (node.type === "Function") return 1 + node.args.reduce((acc, a) => acc + treeSize(a), 0);
  return 1;
}

export class RuleEngine {
  private latestAST: ASTNode | null = null;
  private seenASTs = new Set<string>();
  // Nombres de reglas que pueden aumentar el tamaño del AST
  private expansionRules = new Set([
    "ExpandPowerOfSumRule",
    "ExpandMultiplicationRule",
    "Distributiva" // si tu rule.name es así
  ]);

  constructor(private rules: Rule[]) {}

  applyAll(ast: ASTNode): RuleStep[] {
    const steps: RuleStep[] = [];
    let currentAST = ast;
    this.latestAST = currentAST;
    let step = 1;
    const MAX_STEPS = 30;

    while (step <= MAX_STEPS) {
      let transformed: ASTNode | null = null;

      for (const rule of this.rules) {
        const result = recursivelyApplyRule(rule, currentAST);
        if (!result || deepEquals(result, currentAST)) continue;

        const grew = treeSize(result) > treeSize(currentAST);
        const allowGrowth = this.expansionRules.has(rule.name);

        // ❶ Si creció y NO es regla de expansión, saltar
        if (grew && !allowGrowth) continue;

        // ❷ Si ya vimos este AST, posible bucle → cortar
        const hash = JSON.stringify(result);
        if (this.seenASTs.has(hash)) {
          console.warn("⚠️ AST repetido detectado. Posible bucle.");
          return steps;
        }

        // ❸ Aplicar transformación
        this.seenASTs.add(hash);
        const stepData: RuleStep = {
          stepNumber: step++,
          description: rule.description(currentAST),
          ast: result,
          latex: ASTToLatex(result),
        };
        steps.push(stepData);
        currentAST = result;
        this.latestAST = result;
        transformed = result;
        break;
      }

      if (!transformed) break;
    }

    if (step > MAX_STEPS) {
      console.warn("⛔ Se alcanzó el límite de pasos del motor. Posible ciclo infinito.");
    }
    return steps;
  }

  getLatestAST(): ASTNode {
    if (!this.latestAST) {
      throw new Error("No se ha aplicado ninguna regla aún.");
    }
    return this.latestAST;
  }
}
