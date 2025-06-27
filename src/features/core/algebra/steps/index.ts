import { EquationRuleEngine } from "../steps/RuleEngine";
import { SolveWithLibrariesRule } from "../rules/SolveWithLibrariesRule";
import { Parser } from "../parser";
import { MathjsParser } from "../parser";

const parser: Parser = new MathjsParser();
const rules = [ new SolveWithLibrariesRule() ];
export const engine = new EquationRuleEngine(rules);

export function solveExpression(expr: string) {
  const ast = parser.parse(expr);
  return engine.solve(ast);
}