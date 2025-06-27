import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, VariableNode } from "../../types/AST";
import * as nerdamer from "nerdamer";
import "nerdamer/Solve";
import { create, all } from "mathjs";
import { astToString } from "../utils/ASTStringifier";
import { stringToAST } from "../parser/StringParser";

const math = create(all);

export class SolveWithLibrariesRule implements Rule {
  name = "SolveWithLibrariesRule";

  description(): string {
    return "Resolver usando Nerdamer + Math.js";
  }

  apply(ast: ASTNode): ASTNode | null {
    // 1) Validar que es ecuación
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
    const eq = ast as OperatorNode;
    const variable = eq.left.type === "Variable" ? eq.left.name : "x";

    // 2) Reconstruir LHS y RHS sin paréntesis exteriores
    let leftS  = astToString(eq.left).replace(/^\((.*)\)$/, "$1");
    let rightS = astToString(eq.right).replace(/^\((.*)\)$/, "$1");
    const expr = `${leftS}=${rightS}`;  // ej. "2*x+3=7"

    // 3) Resolver simbólicamente con Nerdamer
    const raw = (nerdamer as any).solve(expr, variable);
    const sols: any[] = Array.isArray(raw) ? raw : [raw];
    if (!sols.length || sols[0] == null) return null;

    // 4) Formatear la solución primera como string
    let solSym = sols[0].toString().trim();

    // 4a) Si viene en forma "[a,b,...]" extraer el primer elemento
    if (solSym.startsWith("[") && solSym.endsWith("]")) {
      try {
        const arr = JSON.parse(solSym);
        if (Array.isArray(arr) && arr.length > 0) {
          solSym = String(arr[0]);
        }
      } catch {
        // si falla JSON.parse, dejamos solSym tal cual
      }
    }

    // 5) Intentar refinar numérico con Math.js
    let solStr: string;
    try {
      const maybeNum = math.evaluate(solSym);
      solStr = (typeof maybeNum === "number" && !isNaN(maybeNum))
        ? maybeNum.toString()
        : solSym;
    } catch {
      solStr = solSym;
    }

    // 6) Convertir la solución final a ASTNode
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
