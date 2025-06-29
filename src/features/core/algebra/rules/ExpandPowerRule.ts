import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, LiteralNode } from "../../types/AST";
import { stringToAST } from "../parser/StringParser";
import { astToString } from "../utils/ASTStringifier";
import { create, all } from "mathjs";

const math = create(all);

export class ExpandPowerRule implements Rule {
  name = "ExpandPowerRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator") return null;
    const node = ast as OperatorNode;

    if (node.operator === "^" && node.right.type === "Literal") {
      const expVal  = (node.right as LiteralNode).value;
      const baseStr = astToString(node.left);
      const expr    = `(${baseStr})^${expVal}`;

      let expanded: string;
      try {
        // casteamos a any para saltarnos la definición de tipos
        expanded = (math as any).expand(expr).toString();
      } catch {
        return null;
      }

      return stringToAST(expanded) as ASTNode;
    }
    return null;
  }

  description(): string {
    return "Expandir potencia (binomio) para cualquier exponente";
  }
}
