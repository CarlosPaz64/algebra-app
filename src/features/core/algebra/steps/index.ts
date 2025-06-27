import * as nerdamer from "nerdamer";
import "nerdamer/Solve";
import { evaluate } from "mathjs";
import numeric from "numeric";
import { RuleStep } from "../../types/RuleStep";
import {
  ASTNode,
  OperatorNode,
  VariableNode,
  LiteralNode,
} from "../../types/AST";

export function solveExpression(expr: string): RuleStep[] {
  // 0) Validar '=' y separar
  const idx = expr.indexOf("=");
  if (idx < 0) throw new Error("La ecuación debe contener '='");
  const lhs = expr.slice(0, idx).trim();
  const rhs = expr.slice(idx + 1).trim();
  const full = `${lhs}=${rhs}`;

  // Paso 0: ecuación inicial
  const initialAst: OperatorNode = {
    type: "Operator",
    operator: "=",
    left:  { type: "Variable", name: lhs },
    right: { type: "Variable", name: rhs } as any,
  };
  const steps: RuleStep[] = [{
    stepNumber: 0,
    description: "Ecuación inicial",
    ast: initialAst,
    latex: full.replace(/\*/g, "\\cdot "),
  }];

  // Detectar incógnita (la primera letra de lhs)
  const variable = (lhs.match(/[a-zA-Z]+/) ?? ["x"])[0];

  // 1) Intento simbólico con Nerdamer
  let solutions: string[] = [];
  try {
    const raw = (nerdamer as any).solve(full, variable);
    const rawStr = raw?.toString?.() ?? "";
    solutions = rawStr.includes(",")
      ? rawStr.split(",").map((s: string) => s.trim()).filter(Boolean)
      : rawStr
        ? [rawStr.trim()]
        : [];
  } catch {
    // falla simbólico: pasamos a numérico
  }

  // 2) Fallback numérico si no hay soluciones simbólicas
  if (solutions.length === 0) {
    // definimos f(x) = lhs - rhs usando evaluate()
    const f = (x: number) => {
      const scope = { [variable]: x };
      return (evaluate(lhs, scope) as number) - (evaluate(rhs, scope) as number);
    };

    let root: number;
    try {
      root = numeric.newton(f, 0);
      if (isNaN(root) || !isFinite(root)) throw new Error();
      solutions = [root.toString()];
    } catch {
      throw new Error("No se pudo resolver la ecuación ni simbólica ni numéricamente");
    }
  }

  // 3) Construir paso resuelto
  if (solutions.length === 1) {
    const sol = solutions[0];
    const num = Number(sol);
    const rightAst: ASTNode = !isNaN(num)
      ? ({ type: "Literal", value: num } as LiteralNode)
      : ({ type: "Variable", name: sol } as VariableNode);

    const solvedAst: OperatorNode = {
      type: "Operator",
      operator: "=",
      left: { type: "Variable", name: variable },
      right: rightAst,
    };

    steps.push({
      stepNumber: 1,
      description: "Ecuación resuelta",
      ast: solvedAst,
      latex: `${variable} = ${sol}`,
    });
  } else {
    // múltiples soluciones
    steps.push({
      stepNumber: 1,
      description: `Soluciones (${solutions.length})`,
      ast: initialAst,
      latex: `${variable} = ${solutions.join(", ")}`,
    });
  }

  return steps;
}
