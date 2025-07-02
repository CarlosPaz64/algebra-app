import { Rule } from "../steps/Rule";
import {
  ASTNode,
  OperatorNode,
  LiteralNode,
} from "../../types/AST";

export class EvaluateBinaryNumericExpressionRule implements Rule {
  name = "Evaluar expresión numérica completa";

  description(ast: ASTNode): string {
    return "Evalúa operaciones aritméticas entre literales, incluso dentro de ecuaciones.";
  }

  apply(ast: ASTNode): ASTNode | null {
    const simplified = this.deepEvaluate(ast);
    if (JSON.stringify(simplified) !== JSON.stringify(ast)) {
      return simplified;
    }
    return null;
  }

  private deepEvaluate(node: ASTNode): ASTNode {
    if (node.type === "Operator") {
      const op = node as OperatorNode;

      // Recorre recursivamente
      const left = this.deepEvaluate(op.left);
      const right = this.deepEvaluate(op.right);

      // Si ambos lados son literales, se puede evaluar
      if (left.type === "Literal" && right.type === "Literal") {
        const result = this.evalOp((left as LiteralNode).value, (right as LiteralNode).value, op.operator);
        if (result !== null) {
          return { type: "Literal", value: result };
        }
      }

      return {
        ...op,
        left,
        right,
      };
    }

    if (node.type === "Grouping") {
      return this.deepEvaluate(node.expression);
    }

    return node;
  }

  private evalOp(a: number, b: number, op: string): number | null {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b !== 0 ? a / b : null;
      case "^": return Math.pow(a, b);
      default: return null;
    }
  }
}
