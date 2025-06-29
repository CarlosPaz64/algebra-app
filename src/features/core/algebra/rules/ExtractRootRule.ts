import { Rule } from "../steps/Rule";
import {
  ASTNode,
  OperatorNode,
  LiteralNode,
  VariableNode
} from "../../types/AST";
import { stringToAST } from "../parser/StringParser";
import { astToString } from "../utils/ASTStringifier";

/**
 * Detecta x^n = C  ⇒  x = C^(1/n)
 */
export class ExtractRootRule implements Rule {
  name = "ExtractRootRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
    const eq = ast as OperatorNode;

    // LHS debe ser potencia variable^literal
    if (
      eq.left.type === "Operator" &&
      eq.left.operator === "^" &&
      eq.left.left.type === "Variable" &&
      eq.left.right.type === "Literal"
    ) {
      const varName = eq.left.left.name;
      const n = (eq.left.right as LiteralNode).value;
      const Cstr = astToString(eq.right);

      // construimos: x = (C)^(1/n)
      const expr = `${varName} = (${Cstr})^(1/${n})`;
      return stringToAST(expr) as OperatorNode;
    }

    return null;
  }

  description(): string {
    return "Extraer raíz de cualquier orden: x = C^(1/n)";
  }
}
