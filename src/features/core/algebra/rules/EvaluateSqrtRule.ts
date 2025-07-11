import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, LiteralNode, FunctionNode } from "../../types/AST";

export class EvaluateSqrtRule implements Rule {
  name = "EvaluateSqrtRule";

  apply(ast: ASTNode): ASTNode | null {
    const changed = { value: false };

    const newAst = this.deepEvaluate(ast, changed);

    return changed.value ? newAst : null;
  }

  description(): string {
    return "Evalúa raíces cuadradas con contenido numérico, como sqrt(25 - 24) → 1";
  }

  private deepEvaluate(node: ASTNode, changed: { value: boolean }): ASTNode {
    // √(expr evaluable)
    if (
      node.type === "Function" &&
      node.name === "sqrt" &&
      node.args.length === 1 &&
      isEvaluableExpression(node.args[0])
    ) {
      const result = evalExpression(node.args[0]);
      if (result < 0) return node; // No se evalúan raíces negativas
      changed.value = true;
      return { type: "Literal", value: Math.sqrt(result) };
    }

    // Recorrer operadores
    if (node.type === "Operator") {
      const left = this.deepEvaluate(node.left, changed);
      const right = this.deepEvaluate(node.right, changed);
      return { ...node, left, right };
    }

    // Recorrer agrupaciones
    if (node.type === "Grouping") {
      const expr = this.deepEvaluate(node.expression, changed);
      return { ...node, expression: expr };
    }

    // Recorrer funciones
    if (node.type === "Function") {
      const args = node.args.map(arg => this.deepEvaluate(arg, changed));
      return { ...node, args };
    }

    return node;
  }
}

function isEvaluableExpression(node: ASTNode): boolean {
  if (node.type === "Literal") return true;
  if (
    node.type === "Operator" &&
    isEvaluableExpression(node.left) &&
    isEvaluableExpression(node.right)
  ) {
    return true;
  }
  return false;
}

function evalExpression(node: ASTNode): number {
  if (node.type === "Literal") return node.value;

  if (node.type === "Operator") {
    const left = evalExpression(node.left);
    const right = evalExpression(node.right);
    switch (node.operator) {
      case "+": return left + right;
      case "-": return left - right;
      case "*": return left * right;
      case "/": return left / right;
      case "^": return Math.pow(left, right);
    }
  }

  throw new Error("Expresión no evaluable.");
}
