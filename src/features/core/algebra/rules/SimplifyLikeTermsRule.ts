import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class SimplifyLikeTermsRule implements Rule {
  name = "Simplificación de términos semejantes";

  apply(ast: ASTNode): ASTNode | null {
    const transformed = this.simplify(ast);

    if (transformed && !deepEquals(transformed, ast)) {
      return transformed;
    }

    if (ast.type === "Operator") {
      const left = this.apply(ast.left);
      const right = this.apply(ast.right);

      if (left || right) {
        return {
          ...ast,
          left: left ?? ast.left,
          right: right ?? ast.right,
        };
      }
    }

    return null;
  }

  private simplify(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator") return null;

    const { operator, left, right } = ast;

    // 🧠 1. Simplificar 2x + 3x ó 5x - x
    if (
      (operator === "+" || operator === "-") &&
      left.type === "Operator" &&
      left.operator === "*" &&
      left.left.type === "Literal" &&
      left.right.type === "Variable"
    ) {
      const coef1 = left.left.value;
      const varName = left.right.name;

      // Caso: (a·x) ± (b·x)
      if (
        right.type === "Operator" &&
        right.operator === "*" &&
        right.left.type === "Literal" &&
        right.right.type === "Variable" &&
        right.right.name === varName
      ) {
        const coef2 = right.left.value;
        const resultCoef = operator === "+" ? coef1 + coef2 : coef1 - coef2;

        return {
          type: "Operator",
          operator: "*",
          left: { type: "Literal", value: resultCoef },
          right: { type: "Variable", name: varName }
        };
      }

      // Caso: (a·x) ± x
      if (right.type === "Variable" && right.name === varName) {
        const resultCoef = operator === "+" ? coef1 + 1 : coef1 - 1;

        return {
          type: "Operator",
          operator: "*",
          left: { type: "Literal", value: resultCoef },
          right: { type: "Variable", name: varName }
        };
      }
    }

    // 🧠 2. Simplificar x + x => 2x
    if (
      (operator === "+" || operator === "-") &&
      left.type === "Variable" &&
      right.type === "Variable" &&
      left.name === right.name
    ) {
      const coef = operator === "+" ? 2 : 0;

      if (coef === 0) {
        return { type: "Literal", value: 0 };
      }

      return {
        type: "Operator",
        operator: "*",
        left: { type: "Literal", value: coef },
        right: { type: "Variable", name: left.name }
      };
    }

    // 🧠 3. Simplificar constantes sueltas: 5 + 3 ó 10 - 2
    if (
      left.type === "Literal" &&
      right.type === "Literal"
    ) {
      let value: number | null = null;
      switch (operator) {
        case "+": value = left.value + right.value; break;
        case "-": value = left.value - right.value; break;
      }

      if (value !== null) {
        return { type: "Literal", value };
      }
    }

    return null;
  }

  description(): string {
    return "Se simplificaron términos semejantes o constantes (ej. 2x + 3x → 5x, 5 + 3 → 8)";
  }
}
