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

  constructor(private rules: Rule[]) {}

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

        const nextAst = rule.apply(current);

        if (!nextAst) {
          console.log(`⛔ La regla ${rule.name} no se aplicó.`);
          continue;
        }

        if (!isOperatorNode(nextAst)) {
          console.warn(`⚠️ La regla ${rule.name} devolvió un AST no-Operator; se ignora.`);
          continue;
        }

        const hash = JSON.stringify(nextAst);
        if (this.seen.has(hash)) {
          console.warn("⚠️ Ciclo detectado con el siguiente AST. Deteniendo engine.");
          console.log("AST repetido:", JSON.stringify(nextAst, null, 2));
          return steps;
        }

        console.log(`✅ Regla aplicada: ${rule.name}`);
        console.log("🆕 Nuevo AST:", JSON.stringify(nextAst, null, 2));

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
        break;
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
