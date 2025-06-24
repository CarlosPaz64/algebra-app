import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class ExpandPowerOfSumRule implements Rule {
  name = "ExpandPowerOfSumRule";

  apply(node: ASTNode): ASTNode | null {
    // 1️⃣ Intentar expandir directamente (caso (a+b)^2)
    const direct = this.expandSquareOfSum(node);
    if (direct && !deepEquals(direct, node)) {
      return direct;
    }

    // 2️⃣ Si no expandió, recursar en hijos
    if (node.type === "Operator") {
      const left  = this.apply(node.left)  ?? node.left;
      const right = this.apply(node.right) ?? node.right;

      if (left !== node.left || right !== node.right) {
        return { ...node, left, right };
      }
    }

    return null;
  }

  private expandSquareOfSum(node: ASTNode): ASTNode | null {
    // Detectar patrón (a + b)^2
    if (
      node.type === "Operator" && node.operator === "^" &&
      node.right.type === "Literal" && node.right.value === 2
    ) {
      // extraer a y b (agrupación opcional)
      const base = node.left.type === "Grouping"
        ? node.left.expression
        : node.left;
      if (base.type !== "Operator" || base.operator !== "+") {
        return null;
      }

      const a = base.left;
      const b = base.right;

      // construir a², 2ab y b²
      const a2: OperatorNode = { type: "Operator", operator: "^", left: a, right: { type: "Literal", value: 2 } };
      const b2: OperatorNode = { type: "Operator", operator: "^", left: b, right: { type: "Literal", value: 2 } };
      const twoAB: OperatorNode = {
        type: "Operator", operator: "*",
        left: { type: "Literal", value: 2 },
        right: { type: "Operator", operator: "*", left: a, right: b }
      };

      // devolver a² + 2ab + b²
      return {
        type: "Operator", operator: "+",
        left: { type: "Operator", operator: "+", left: a2, right: twoAB },
        right: b2
      };
    }
    return null;
  }

  description(): string {
    return "Se aplica la identidad (a + b)² → a² + 2ab + b²";
  }
}
