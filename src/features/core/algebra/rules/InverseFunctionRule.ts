import { Rule } from "../steps/Rule";
import {
  ASTNode,
  OperatorNode,
  FunctionNode,
  VariableNode,
} from "../../types/AST";
import { stringToAST } from "../parser/StringParser";
import { astToString } from "../utils/ASTStringifier";

export class InverseFunctionRule implements Rule {
  name = "InverseFunctionRule";

  private inverses: Record<string,string> = {
    exp: "ln",
    ln:  "exp",
    sin: "asin",
    cos: "acos",
    tan: "atan",
  };

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
    const eq = ast as OperatorNode;
    if (eq.left.type !== "Function") return null;

    const fn = eq.left as FunctionNode;
    const inv = this.inverses[fn.name];
    if (!inv || fn.args.length !== 1) return null;

    // convertimos C a string usando astToString
    const Cstr = astToString(eq.right);
    const varName = (fn.args[0] as VariableNode).name;

    // construimos "x = inv(Cstr)"
    const expr = `${varName} = ${inv}(${Cstr})`;
    return stringToAST(expr) as OperatorNode;
  }

  description(): string {
    return "Aplicar función inversa";
  }
}
