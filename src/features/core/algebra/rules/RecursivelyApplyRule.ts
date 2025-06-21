import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export function recursivelyApplyRule(rule: Rule, node: ASTNode): ASTNode | null {
  if (node.type !== "Operator") return rule.apply(node);

  const left = recursivelyApplyRule(rule, node.left!) ?? node.left!;
  const right = recursivelyApplyRule(rule, node.right!) ?? node.right!;

  const updatedNode: OperatorNode = {
    ...node,
    left,
    right,
  };

  const applied = rule.apply(updatedNode);
  if (applied && !deepEquals(applied, node)) return applied;

  if (!deepEquals(updatedNode, node)) return updatedNode;

  return null;
}
