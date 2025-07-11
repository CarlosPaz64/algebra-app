import { ASTNode, OperatorNode } from "../../types/AST";
import { Rule } from "./Rule";
import { RuleStep } from "../../types/RuleStep";
import { ASTToLatex } from "../latex/ASTToLatex";

function isOperatorNode(node: ASTNode): node is OperatorNode {
  return node.type === "Operator";
}

function isSolved(eq: OperatorNode): boolean {
  return eq.left.type === "Variable" && eq.right.type === "Literal";
}

export class EquationRuleEngine {
  private seen = new Set<string>();
  private stepCount = 0;
  private readonly MAX_STEPS = 30;
  private readonly MAX_DEPTH = 5;

  constructor(private rules: Rule[]) {}

  solve(initialAst: ASTNode): RuleStep[] {
    this.seen.clear();
    this.stepCount = 0;

    if (!isOperatorNode(initialAst) || initialAst.operator !== "=") {
      throw new Error("El AST inicial debe ser una ecuación (OperatorNode con '=').");
    }

    console.log("🟡 AST inicial:", JSON.stringify(initialAst, null, 2));
    return this.solveSingleAst(initialAst, "Ecuación inicial", 0);
  }

  private solveSingleAst(ast: ASTNode, initialDescription: string, depth = 0): RuleStep[] {
    if (this.stepCount >= this.MAX_STEPS || depth >= this.MAX_DEPTH) {
      console.warn("🚨 Límite de pasos o profundidad alcanzado.");
      return [];
    }

    const hash = JSON.stringify(ast);
    if (this.seen.has(hash)) {
      console.warn("🔁 AST repetido detectado (prevención de ciclo):", hash);
      return [];
    }
    this.seen.add(hash);

    if (!isOperatorNode(ast)) return [];

    const steps: RuleStep[] = [{
      stepNumber: ++this.stepCount,
      description: initialDescription,
      ast,
      latex: ASTToLatex(ast),
    }];

    if (isSolved(ast)) {
      steps.push({
        stepNumber: ++this.stepCount,
        description: "¡Ecuación resuelta!",
        ast,
        latex: ASTToLatex(ast),
      });
      return steps;
    }

    let current = ast;

    while (this.stepCount < this.MAX_STEPS) {
      console.log(`\n🔁 Paso ${this.stepCount} - AST actual:`);
      console.log(JSON.stringify(current, null, 2));

      let applied = false;

      for (const rule of this.rules) {
        console.log(`🔍 Probando regla: ${rule.name}`);
        const result = rule.apply(current);

        // Múltiples ramas (±)
        if (Array.isArray(result)) {
          console.log(`✅ Regla aplicada (varias ramas): ${rule.name}`);
          for (const branch of result) {
            const branchHash = JSON.stringify(branch);
            if (this.seen.has(branchHash)) {
              if (rule.name === "SplitPlusMinusRule") {
                console.warn("🔁 Rama repetida detectada:", branchHash);
              }
              continue;
            }

            this.seen.add(branchHash);
            console.log("📤 Nueva rama generada:");
            console.log(JSON.stringify(branch, null, 2));

            steps.push({
              stepNumber: ++this.stepCount,
              description: `📎 Rama generada por ${rule.name}`,
              ast: branch,
              latex: ASTToLatex(branch),
            });

            const branchSteps = this.solveSingleAst(branch, "Resolviendo nueva rama", depth + 1);
            steps.push(...branchSteps);
          }

          return steps;
        }

        // Resultado único
        if (result && isOperatorNode(result)) {
          const resultHash = JSON.stringify(result);
          if (this.seen.has(resultHash)) {
            if (rule.name === "QuadraticFormulaRule" || rule.name === "SplitPlusMinusRule") {
              console.warn("🔁 Resultado ya visto, se evita ciclo:", resultHash);
            }
            continue;
          }

          console.log(`✅ Regla aplicada: ${rule.name}`);
          console.log("📤 AST resultante:");
          console.log(JSON.stringify(result, null, 2));

          this.seen.add(resultHash);

          steps.push({
            stepNumber: ++this.stepCount,
            description: rule.description(current),
            ast: result,
            latex: ASTToLatex(result),
          });

          current = result;
          applied = true;
          break;
        }
      }

      if (isSolved(current)) {
        console.log("🎉 Ecuación resuelta:");
        console.log(JSON.stringify(current, null, 2));
        steps.push({
          stepNumber: ++this.stepCount,
          description: "¡Ecuación resuelta!",
          ast: current,
          latex: ASTToLatex(current),
        });
        break;
      }

      if (!applied) {
        console.warn("❌ No se pudo aplicar ninguna regla.");
        break;
      }
    }

    return steps;
  }
}
