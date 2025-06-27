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
    // 1) Validar AST inicial
    if (!isOperatorNode(initialAst) || initialAst.operator !== "=") {
      throw new Error("El AST inicial debe ser un OperatorNode con operator '='");
    }
    let current: OperatorNode = initialAst;

    // 2) Paso 0: registrar la ecuación inicial
    const steps: RuleStep[] = [{
      stepNumber: 0,
      description: "Ecuación inicial",
      ast: current,
      latex: ASTToLatex(current),
    }];
    this.seen.add(JSON.stringify(current));

    // 3) Bucle principal
    while (this.stepCount < this.MAX_STEPS) {
      // 3a) ¿Está resuelta?
      if (isSolved(current)) {
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

      // 3b) Probar cada regla sobre el nodo raíz
      for (const rule of this.rules) {
        const nextAst = rule.apply(current);
        if (!nextAst) continue;

        // 3c) Asegurarnos de que sigue siendo OperatorNode
        if (!isOperatorNode(nextAst)) {
          console.warn(`La regla ${rule.name} devolvió un AST no-Operator; se ignora.`);
          continue;
        }

        const hash = JSON.stringify(nextAst);
        if (this.seen.has(hash)) {
          console.warn("⚠️ Ciclo detectado. Deteniendo engine.");
          return steps;
        }

        // 3d) Registrar paso
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

      // 3e) Si no se aplicó ninguna regla, salir
      if (!applied) {
        console.warn("❌ No hay más reglas aplicables.");
        break;
      }
    }

    // 4) Límite de pasos
    if (this.stepCount >= this.MAX_STEPS) {
      console.warn("⛔ Límite de pasos alcanzado.");
    }

    return steps;
  }
}
