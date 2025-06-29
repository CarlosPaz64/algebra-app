import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";
import { astToString } from "../utils/ASTStringifier";
import { stringToAST } from "../parser/StringParser";
import * as nerdamer from "nerdamer";

export class SolvePolynomialRule implements Rule {
  name = "SolvePolynomialRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
    const eq = ast as OperatorNode;

    // sólo para polinomios de grado ≥3
    const txt = `${astToString(eq.left)} = ${astToString(eq.right)}`;
    const variable = astToString(eq.left).match(/[a-zA-Z]+/)?.[0] ?? "x";

    let solsRaw: any[];
    try {
      solsRaw = (nerdamer as any).solve(txt, variable) as any[];
    } catch {
      return null;
    }
    if (!Array.isArray(solsRaw) || solsRaw.length === 0) return null;

    const list = solsRaw.map(s => s.toString()).join(", ");
    return stringToAST(`${variable} = ${list}`) as OperatorNode;
  }

  description(): string {
    return "Resolver polinomio de grado ≥3";
  }
}
