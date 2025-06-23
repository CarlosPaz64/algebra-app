import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";
import { FlattenAdditionRule } from "./FlattenAdditionRule";

export class OrderAndGroupRule implements Rule {
  name = "OrderAndGroupRule";

  apply(node: ASTNode): ASTNode | null {
    if (node.type !== "Operator" || node.operator !== "+") return null;

    const terms: ASTNode[] = this.flattenSum(node);
    const ordered = terms.sort(this.termComparator);

    const rebuilt = ordered.reduceRight((acc, curr): ASTNode => {
      if (!acc) return curr;

      const newNode: OperatorNode = {
        type: "Operator",
        operator: "+",
        left: curr,
        right: acc,
      };

      return newNode;
    });

    // ✅ Compara versiones aplanadas para evitar reordenar infinitamente
    const flattener = new FlattenAdditionRule();
    const flatOriginal = flattener.apply(node) ?? node;
    const flatRebuilt = flattener.apply(rebuilt) ?? rebuilt;

    if (deepEquals(flatOriginal, flatRebuilt)) return null;

    // 🔁 Devuelve ya aplanado para prevenir loops con otras reglas
    return flatRebuilt;
  }

  private flattenSum(node: ASTNode): ASTNode[] {
    if (node.type === "Operator" && node.operator === "+") {
      return [...this.flattenSum(node.left), ...this.flattenSum(node.right)];
    }
    return [node];
  }

  private termComparator = (a: ASTNode, b: ASTNode): number => {
    const getDegree = (node: ASTNode): number => {
      if (
        node.type === "Operator" &&
        node.operator === "*" &&
        node.right.type === "Operator" &&
        node.right.operator === "^"
      ) {
        return node.right.right.type === "Literal" ? node.right.right.value : 1;
      }
      if (node.type === "Operator" && node.operator === "^") {
        return node.right.type === "Literal" ? node.right.value : 1;
      }
      if (node.type === "Variable") return 1;
      return 0;
    };

    return getDegree(b) - getDegree(a); // Mayor grado primero
  };

  description(): string {
    return "Se ordenaron y agruparon los términos del polinomio.";
  }
}
