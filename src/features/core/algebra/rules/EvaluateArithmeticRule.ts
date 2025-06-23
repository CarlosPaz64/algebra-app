import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class EvaluateArithmeticRule implements Rule {
  name = "Evaluación aritmética básica";

  apply(node: ASTNode): ASTNode | null {
    if (node.type !== "Operator") return null;

    const left = this.apply(node.left);   // aplica recursivamente
    const right = this.apply(node.right); // aplica recursivamente

    const newNode: ASTNode = {
      ...node,
      left: left ?? node.left,
      right: right ?? node.right,
    };

    // Si ambos lados son literales, evaluar
    if (
      newNode.left.type === "Literal" &&
      newNode.right.type === "Literal"
    ) {
      const a = newNode.left.value;
      const b = newNode.right.value;
      let value: number | null = null;

      switch (newNode.operator) {
        case "+":
          value = a + b;
          break;
        case "-":
          value = a - b;
          break;
        case "*":
          value = a * b;
          break;
        case "/":
          value = b !== 0 ? a / b : null;
          break;
        case "^":
          value = Math.pow(a, b);
          break;
      }

      if (value !== null) {
        return { type: "Literal", value };
      }
    }

    // Si se cambió algo pero no se evaluó
    if (!deepEquals(newNode, node)) {
      return newNode;
    }

    return null;
  }

  description(): string {
    return "Se evaluaron operaciones aritméticas simples entre constantes.";
  }
}
