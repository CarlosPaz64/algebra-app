import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, LiteralNode } from "../../types/AST";

/**
 * Aplica la propiedad distributiva: 
 *   a(b + c) = ab + ac
 *   a(b - c) = ab - ac
 */
export class DistributeMultiplicationOverAdditionRule implements Rule {
  name = "DistributeMultiplicationOverAdditionRule";

apply(ast: ASTNode): ASTNode | null {
  if (ast.type !== "Operator" || ast.operator !== "=") return null;

  const tryDistribute = (node: ASTNode): ASTNode | null => {
    if (
      node.type === "Operator" &&
      node.operator === "*" &&
      node.left.type === "Literal" &&
      node.right.type === "Operator" &&
      (node.right.operator === "+" || node.right.operator === "-")
    ) {
      const a = node.left as LiteralNode;
      const op = node.right as OperatorNode;

      const leftDistrib: ASTNode = {
        type: "Operator",
        operator: "*",
        left: a,
        right: op.left,
      };

      const rightDistrib: ASTNode = {
        type: "Operator",
        operator: "*",
        left: a,
        right: op.right,
      };

      return {
        type: "Operator",
        operator: op.operator,
        left: leftDistrib,
        right: rightDistrib,
      };
    }
    return null;
  };

  // Intenta aplicar distribución en hijos de eq.left
  const newLeft =
    ast.left.type === "Operator"
      ? {
          ...ast.left,
          left: tryDistribute(ast.left.left) || ast.left.left,
          right: tryDistribute(ast.left.right) || ast.left.right,
        }
      : ast.left;

  // Aplica distribución si se puede en el nodo raíz izquierdo
  const distributedLeft = tryDistribute(ast.left) || newLeft;

  if (distributedLeft !== ast.left) {
    return {
      ...ast,
      left: distributedLeft,
    };
  }

  return null;
}


  description(): string {
    return "Distribuir multiplicación sobre suma o resta";
  }
}
