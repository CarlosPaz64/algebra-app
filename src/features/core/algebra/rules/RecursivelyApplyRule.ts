import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export function recursivelyApplyRule(rule: Rule, node: ASTNode): ASTNode | null {
  // Intenta aplicar la regla directamente
  const directResult = rule.apply(node);
  if (directResult && !deepEquals(directResult, node)) {
    return directResult;
  }

  // Aplica recursivamente a los hijos si es un operador
  if (node.type === "Operator") {
    const left = recursivelyApplyRule(rule, node.left) ?? node.left;
    const right = recursivelyApplyRule(rule, node.right) ?? node.right;

    const updatedNode: OperatorNode = {
      ...node,
      left,
      right,
    };

    // Si hubo cambio estructural en los hijos
    if (!deepEquals(updatedNode, node)) {
      return updatedNode;
    }
  }

  return null;
}
