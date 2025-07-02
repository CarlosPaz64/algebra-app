import { Rule } from "../steps/Rule";
import { OperatorNode, ASTNode } from "../../types/AST";
import { cloneAST } from "../utils/CloneAST";

/**
 * Divide ambos lados entre el coeficiente que multiplica a la variable.
 * Ej: (3/4)x = 6  =>  x = 6 ÷ (3/4)
 */
export class DivideBothSidesRule implements Rule {
  name = "DivideBothSidesRule";

  description = () => "Dividir ambos lados entre el coeficiente de la variable";

  apply(node: OperatorNode): OperatorNode | null {
    if (node.operator !== "=") return null;

    const left = node.left;
    const right = node.right;

    // Caso: coef * variable (coef puede ser número o fracción)
    if (
      left.type === "Operator" &&
      left.operator === "*" &&
      left.left &&
      left.right &&
      left.right.type === "Variable"
    ) {
      const coefficient = left.left;
      const variable = left.right;

      return {
        type: "Operator",
        operator: "=",
        left: cloneAST(variable),
        right: {
          type: "Operator",
          operator: "/",
          left: cloneAST(right),
          right: cloneAST(coefficient),
        },
      };
    }

    // Caso alternativo: variable * coef
    if (
      left.type === "Operator" &&
      left.operator === "*" &&
      left.right &&
      left.left &&
      left.left.type === "Variable"
    ) {
      const coefficient = left.right;
      const variable = left.left;

      return {
        type: "Operator",
        operator: "=",
        left: cloneAST(variable),
        right: {
          type: "Operator",
          operator: "/",
          left: cloneAST(right),
          right: cloneAST(coefficient),
        },
      };
    }

    return null;
  }
}
