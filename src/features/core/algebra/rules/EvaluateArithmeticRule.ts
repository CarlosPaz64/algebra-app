import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class EvaluateArithmeticRule implements Rule {
  name = "Evaluación aritmética básica";

  apply(node: ASTNode): ASTNode | null {
    if (node.type !== "Operator") return null;

    const left = this.apply(node.left);
    const right = this.apply(node.right);

    const newNode: ASTNode = {
      ...node,
      left: left ?? node.left,
      right: right ?? node.right,
    };

    // Intentar evaluar si ambos lados son literales
    if (newNode.left.type === "Literal" && newNode.right.type === "Literal") {
      const a = newNode.left.value;
      const b = newNode.right.value;
      const op = newNode.operator;

      const result = this.eval(a, b, op);
      if (result !== null) {
        return { type: "Literal", value: result };
      }
    }

    // No hubo evaluación directa, pero sí cambios
    if (!deepEquals(newNode, node)) return newNode;
    return null;
  }

  private eval(a: number, b: number, op: string): number | null {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b !== 0 ? a / b : null;
      case "^": return Math.pow(a, b);
      default: return null;
    }
  }

  description(): string {
    return "Se evaluaron operaciones aritméticas simples entre constantes.";
  }
}