import { Rule } from "../steps/Rule";
import {
  ASTNode,
  OperatorNode,
  LiteralNode,
  VariableNode
} from "../../types/AST";

/**
 * Mueve constantes del lado izquierdo restando o sumando.
 * Soporta: 2*x + 3 = 7  o  3 + 2*x = 7  o  2*x - 3 = 7
 */
export class IsolateVariableOnLeftRule implements Rule {
  name = "IsolateVariableOnLeftRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
    const eq = ast as OperatorNode;

    const left = eq.left;
    if (left.type !== "Operator") return null;

    const isLiteral = (n: ASTNode): n is LiteralNode => n.type === "Literal";
    const isVarTerm = (n: ASTNode) =>
      n.type === "Variable" ||
      (n.type === "Operator" && n.operator === "*" && n.right.type === "Variable");

    const { operator, left: A, right: B } = left;

    // A + B = C  donde A es término con variable
    if (operator === "+" && isVarTerm(A) && isLiteral(B)) {
      return {
        type: "Operator",
        operator: "=",
        left: A,
        right: {
          type: "Operator",
          operator: "-",
          left: eq.right,
          right: B
        }
      };
    }

    // B + A = C  donde A es término con variable
    if (operator === "+" && isVarTerm(B) && isLiteral(A)) {
      return {
        type: "Operator",
        operator: "=",
        left: B,
        right: {
          type: "Operator",
          operator: "-",
          left: eq.right,
          right: A
        }
      };
    }

    // A - B = C  donde A es término con variable
    if (operator === "-" && isVarTerm(A) && isLiteral(B)) {
      return {
        type: "Operator",
        operator: "=",
        left: A,
        right: {
          type: "Operator",
          operator: "+",
          left: eq.right,
          right: B
        }
      };
    }

    return null;
  }

  description(): string {
    return "Mover constantes al otro lado restando o sumando";
  }
}
