import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";
import { astToString } from "../utils/ASTStringifier";
import { stringToAST } from "../parser/StringParser";
import * as nerdamer from "nerdamer";

/**
 * Tras tener un polinomio = 0, aplica solve(polinomio, x)
 * y produce un paso con todas sus raíces: x = r1, r2, …
 */
export class FactorAndSolvePolynomialRule implements Rule {
  name = "FactorAndSolvePolynomialRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
    const eq = ast as OperatorNode;
    // sólo actuamos si RHS es 0
    if (astToString(eq.right) !== "0") return null;

    const poly = astToString(eq.left);
    const variable = poly.match(/[a-zA-Z]+/)?.[0] || "x";
    let sols: any[];
    try {
      sols = (nerdamer as any).solve(poly, variable) as any[];
    } catch {
      return null;
    }
    if (!sols || sols.length === 0) return null;

    const list = sols.map(s => s.toString()).join(", ");
    return stringToAST(`${variable} = ${list}`) as ASTNode;
  }

  description(): string {
    return "Factorizar y resolver polinomio";
  }
}
