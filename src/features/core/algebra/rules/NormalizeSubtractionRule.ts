import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, LiteralNode } from "../../types/AST";

/**
 * Convierte cualquier resta "A - B" en "A + (-1 * B)" para unificar
 * el tratamiento de sumas en las siguientes reglas.
 */
export class NormalizeSubtractionRule implements Rule {
  name = "NormalizeSubtractionRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator") return null;
    const op = ast as OperatorNode;

    // Caso binario: A - B  ⇒  A + (-1 * B)
    if (op.operator === "-") {
      const negMul: OperatorNode = {
        type: "Operator",
        operator: "*",
        left: { type: "Literal", value: -1 } as LiteralNode,
        right: op.right,
      };
      return {
        type: "Operator",
        operator: "+",
        left: op.left,
        right: negMul,
      } as OperatorNode;
    }

    return null;
  }

  description(): string {
    return "Normalizar resta: convertir A - B en A + (–1·B)";
  }
}
