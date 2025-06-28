import * as nerdamer from "nerdamer";
import "nerdamer/Solve";
import { evaluate } from "mathjs";
import { RuleStep } from "../../types/RuleStep";
import {
  ASTNode,
  OperatorNode,
  VariableNode,
  LiteralNode,
} from "../../types/AST";

/** Busca una raíz de f en [a,b] con bisección */
function bisection(
  f: (x: number) => number,
  a: number,
  b: number,
  tol: number = 1e-7,
  maxIter: number = 100
): number {
  let fa = f(a),
      fb = f(b);
  if (fa * fb > 0) {
    throw new Error("Bisección: f(a) y f(b) sin signo distinto");
  }
  let mid = a;
  for (let i = 0; i < maxIter; i++) {
    mid = (a + b) / 2;
    const fm = f(mid);
    if (Math.abs(fm) < tol) return mid;
    if (fa * fm < 0) {
      b = mid;
      fb = fm;
    } else {
      a = mid;
      fa = fm;
    }
  }
  return mid;
}

export function solveExpression(expr: string): RuleStep[] {
  const idx = expr.indexOf("=");
  if (idx < 0) throw new Error("La ecuación debe contener '='");
  const lhs = expr.slice(0, idx).trim();
  const rhs = expr.slice(idx + 1).trim();
  const full = `${lhs}=${rhs}`;

  // Paso 0: inicial
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

  const variable = (lhs.match(/[a-zA-Z]+/) ?? ["x"])[0];

  // 1) Intento simbólico con Nerdamer
  let solutions: string[] = [];
  try {
    const raw = (nerdamer as any).solve(full, variable);
    const rawStr = raw?.toString?.() ?? "";
    solutions = rawStr
      ? rawStr.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];
  } catch {
    // pasa al numérico
  }

  // 2) Fallback numérico con bisección
  if (solutions.length === 0) {
    // f(x) = lhs - rhs
    const f = (x: number) => {
      const scope = { [variable]: x };
      return (evaluate(lhs, scope) as number) - (evaluate(rhs, scope) as number);
    };

    // busca en varios intervalos posibles
    const intervals = [
      [-10, 10],
      [0, 10],
      [-10, 0],
      [0, Math.PI],
      [Math.PI / 2, Math.PI * 2]
    ];
    let root: number | null = null;
    for (const [a, b] of intervals) {
      try {
        root = bisection(f, a, b);
        break;
      } catch {
        continue;
      }
    }
    if (root === null) {
      throw new Error("No se pudo resolver la ecuación ni simbólica ni numéricamente");
    }
    solutions = [root.toString()];
  }

  // 3) Construir paso resuelto
  if (solutions.length === 1) {
    const sol = solutions[0];
    const num = Number(sol);
    const rightAst: ASTNode = !isNaN(num)
      ? ({ type: "Literal", value: num } as LiteralNode)
      : ({ type: "Variable", name: sol } as VariableNode);

    const solved: OperatorNode = {
      type: "Operator",
      operator: "=",
      left:  { type: "Variable", name: variable },
      right: rightAst,
    };
    steps.push({
      stepNumber: 1,
      description: "Ecuación resuelta",
      ast: solved,
      latex: `${variable} = ${sol}`,
    });
  } else {
    steps.push({
      stepNumber: 1,
      description: `Soluciones (${solutions.length})`,
      ast: initialAst,
      latex: `${variable} = ${solutions.join(", ")}`,
    });
  }

  return steps;
}