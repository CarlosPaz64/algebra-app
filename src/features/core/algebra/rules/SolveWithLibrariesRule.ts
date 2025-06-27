import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, VariableNode } from "../../types/AST";
import * as nerdamer from "nerdamer";  // Importamos todo el namespace
import "nerdamer/Solve";               // Cargamos el plugin de Solve
import { create, all } from "mathjs";
import { astToString } from "../utils/ASTStringifier";
import { stringToAST } from "../parser/StringParser";

const math = create(all);

export class SolveWithLibrariesRule implements Rule {
  name = "SolveWithLibrariesRule";
  description(ast: ASTNode): string {
    return "Resolver usando Nerdamer + Math.js";
  }

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
    const eq = ast as OperatorNode;
    const variable = eq.left.type === "Variable" ? eq.left.name : "x";
    const expr = astToString(eq);

    // 1) Solución simbólica: casteamos a any para TS
    const sols = (nerdamer as any).solve(expr, variable) as any[];
    if (!sols?.length) return null;

    // 2) Tomar la primera solución y refinar numérico
    const solSym = sols[0].toString();
    const maybeNum = math.evaluate(solSym);
    const solStr = (typeof maybeNum === "number" && !isNaN(maybeNum))
      ? maybeNum.toString()
      : solSym;

    // 3) Construir nuevo AST: x = solución
    const varNode: VariableNode = { type: "Variable", name: variable };
    const rightAst = stringToAST(solStr);

    return {
      type: "Operator",
      operator: "=",
      left: varNode,
      right: rightAst,
    } as OperatorNode;
  }
}
