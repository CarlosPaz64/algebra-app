import { Rule } from "../steps/Rule";
import {
  ASTNode,
  GroupingNode,
  OperatorNode,
  LiteralNode
} from "../../types/AST";

export class EvaluateGroupedConstantsRule implements Rule {
  name = "Evaluar agrupaciones con literales";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;

    const newLeft = this.deepSimplify(ast.left);
    const newRight = this.deepSimplify(ast.right);

    // Solo retorna si hubo algún cambio
    if (newLeft !== ast.left || newRight !== ast.right) {
      return {
        ...ast,
        left: newLeft,
        right: newRight
      };
    }

    return null;
  }

  // Recorre el árbol y simplifica agrupaciones del tipo (literal op literal)
  private deepSimplify(node: ASTNode): ASTNode {
    if (node.type === "Grouping") {
      const inner = node.expression;
      if (
        inner.type === "Operator" &&
        inner.left.type === "Literal" &&
        inner.right.type === "Literal"
      ) {
        const a = inner.left.value;
        const b = inner.right.value;
        const result = this.evalOp(a, b, inner.operator);
        if (result !== null) {
          return { type: "Literal", value: result };
        }
      }
      // Recurre dentro de agrupaciones anidadas
      return {
        ...node,
        expression: this.deepSimplify(inner)
      };
    }

    if (node.type === "Operator") {
      return {
        ...node,
        left: this.deepSimplify(node.left),
        right: this.deepSimplify(node.right)
      };
    }

    return node;
  }

  private evalOp(a: number, b: number, op: string): number | null {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b !== 0 ? a / b : null;
      default: return null;
    }
  }

  description(): string {
    return "Evalúa agrupaciones con constantes como (6 / 3) → 2, incluso dentro de otras operaciones.";
  }
}
