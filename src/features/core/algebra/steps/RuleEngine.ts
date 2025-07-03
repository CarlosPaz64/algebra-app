import { ASTNode, OperatorNode } from "../../types/AST";
import { Rule } from "./Rule";
import { RuleStep } from "../../types/RuleStep";
import { ASTToLatex } from "../latex/ASTToLatex";

/** Guardián: verifica que el nodo sea OperatorNode */
function isOperatorNode(node: ASTNode): node is OperatorNode {
  return node.type === "Operator";
}

/** Comprueba si la ecuación ya está resuelta: Variable = Literal */
function isSolved(eq: OperatorNode): boolean {
  return eq.left.type === "Variable" && eq.right.type === "Literal";
}

export class EquationRuleEngine {
  private seen = new Set<string>();
  private stepCount = 0;
  private readonly MAX_STEPS = 30;

  constructor(private rules: Rule[]) { }

  solve(initialAst: ASTNode): RuleStep[] {
    if (!isOperatorNode(initialAst) || initialAst.operator !== "=") {
      throw new Error("El AST inicial debe ser un OperatorNode con operator '='");
    }

    let current: OperatorNode = initialAst;
    console.log("🟡 AST inicial:", JSON.stringify(current, null, 2));

    const steps: RuleStep[] = [{
      stepNumber: 0,
      description: "Ecuación inicial",
      ast: current,
      latex: ASTToLatex(current),
    }];
    this.seen.add(JSON.stringify(current));

    // 🟢 Chequeo especial: Identidad como x = x o 2x + 3 = 2x + 3
    if (JSON.stringify(current.left) === JSON.stringify(current.right)) {
      console.log("♾️ Ecuación identidad detectada.");

      steps.push({
        stepNumber: 1,
        description: "La ecuación es una identidad (se cumple para todo valor de la variable).",
        ast: current,
        latex: ASTToLatex(current),
      });

      return steps;
    }

    // 🚫 Chequeo especial: Contradicciones tipo ax = ax + c (c ≠ 0)
    if (
      current.left.type === "Operator" &&
      current.left.operator === "*" &&
      current.left.left.type === "Literal" &&
      current.left.right.type === "Variable" &&
      current.right.type === "Operator" &&
      (current.right.operator === "+" || current.right.operator === "-") &&
      current.right.left.type === "Operator" &&
      current.right.left.operator === "*" &&
      current.right.left.left.type === "Literal" &&
      current.right.left.right.type === "Variable" &&
      current.right.right.type === "Literal"
    ) {
      const leftCoeff = current.left.left.value;
      const leftVar = current.left.right.name;
      const rightCoeff = current.right.left.left.value;
      const rightVar = current.right.left.right.name;
      const offset = current.right.right.value;

      const sameTerms = leftCoeff === rightCoeff && leftVar === rightVar;
      const nonZeroOffset = offset !== 0;

      if (sameTerms && nonZeroOffset) {
        console.log("🚫 Contradicción detectada: ax = ax ± c");

        steps.push({
          stepNumber: 1,
          description: "La ecuación es una contradicción: no tiene solución.",
          ast: current,
          latex: ASTToLatex(current),
        });

        return steps;
      }
    }



    while (this.stepCount < this.MAX_STEPS) {
      console.log(`\n🔁 Paso ${this.stepCount} - AST actual:`);
      console.log(JSON.stringify(current, null, 2));

      if (isSolved(current)) {
        console.log("✅ La ecuación está resuelta.");
        this.stepCount++;
        steps.push({
          stepNumber: this.stepCount,
          description: "¡Ecuación resuelta!",
          ast: current,
          latex: ASTToLatex(current),
        });
        break;
      }

      let applied = false;

      for (const rule of this.rules) {
        console.log(`🔍 Probando regla: ${rule.name}`);

        let nextAst = rule.apply(current);

        // Aplica la misma regla múltiples veces si sigue transformando el AST
        while (
          nextAst &&
          isOperatorNode(nextAst) &&
          !this.seen.has(JSON.stringify(nextAst))
        ) {
          console.log(`✅ Regla aplicada: ${rule.name}`);
          console.log("🆕 Nuevo AST:", JSON.stringify(nextAst, null, 2));

          const hash = JSON.stringify(nextAst);
          this.seen.add(hash);
          this.stepCount++;

          steps.push({
            stepNumber: this.stepCount,
            description: rule.description(current),
            ast: nextAst,
            latex: ASTToLatex(nextAst),
          });

          current = nextAst;
          applied = true;

          // Intenta aplicar nuevamente la misma regla
          nextAst = rule.apply(current);
        }

        if (applied) break; // pasa a siguiente paso si hubo alguna transformación
      }

      if (!applied) {
        console.warn("❌ No hay más reglas aplicables en este paso.");
        break;
      }
    }

    if (this.stepCount >= this.MAX_STEPS) {
      console.warn("⛔ Límite de pasos alcanzado.");
    }

    console.log("\n🧾 PASOS COMPLETOS:");
    steps.forEach(step => {
      console.log(`Paso ${step.stepNumber}: ${step.description}`);
      console.log(`→ ${step.latex}`);
    });

    return steps;
  }
}
