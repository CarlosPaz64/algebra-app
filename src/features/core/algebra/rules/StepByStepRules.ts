import { MathjsParser }    from "../parser/MathjsParser";
import { EquationRuleEngine } from "../steps/RuleEngine";
import { stepRules } from "./StepRules";
import { RuleStep }        from "../../types/RuleStep";

export function solveStepByStep(expr: string): RuleStep[] {
  const parser   = new MathjsParser();
  const initial  = parser.parse(expr);
  const engine   = new EquationRuleEngine(stepRules);
  return engine.solve(initial);
}
