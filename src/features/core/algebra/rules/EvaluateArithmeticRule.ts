import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";
import { recursivelyApplyRule } from "./RecursivelyApplyRule";
import { deepEquals } from "./DeepEquals"; // Necesario

export class EvaluateArithmeticRule implements Rule {
  name = "Evaluación aritmética básica";

apply(node: ASTNode): ASTNode | null {
  // Evaluación directa (sin llamar recursivelyApplyRule aquí)
  if (node.type !== "Operator") return null;

  const left = node.left;
  const right = node.right;

  // Casos evaluables
  if (
    (node.operator === "+" || node.operator === "-") &&
    left?.type === "Literal" &&
    right?.type === "Literal"
  ) {
    return {
      type: "Literal",
      value: node.operator === "+" ? left.value + right.value : left.value - right.value,
    };
  }

  if (
    node.operator === "*" &&
    left?.type === "Literal" &&
    right?.type === "Literal"
  ) {
    return {
      type: "Literal",
      value: left.value * right.value,
    };
  }

  if (
    node.operator === "*" &&
    ((left?.type === "Literal" && right?.type === "Variable") ||
     (right?.type === "Literal" && left?.type === "Variable"))
  ) {
    return {
      type: "Operator",
      operator: "*",
      left: left,
      right: right,
    };
  }

  return null; // si no se puede evaluar nada
}


  description(): string {
    return "Se evaluaron operaciones aritméticas simples (ej. 3 * 3 → 9, 3 + 2 → 5)";
  }
}
