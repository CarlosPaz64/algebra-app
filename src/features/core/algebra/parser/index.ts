import { ASTNode } from "../../types/AST";
import { tokenize } from "./Tokenizer";
import { insertImplicitMultiplication } from "./ImplicitMultiplication";
import { precedence } from "./OperatorPrecedence";
import { TokenStream } from "./ParserHelpers";

export function parse(input: string): ASTNode {
  const rawTokens = tokenize(input);
  const tokens = insertImplicitMultiplication(rawTokens);
  const stream = new TokenStream(tokens);

  function parsePrimary(): ASTNode {
    const token = stream.consume();

    if (!token) throw new Error("Vacío");

    if (!isNaN(Number(token))) {
      return { type: "Literal", value: Number(token) };
    }

    if (/^[a-zA-Z]$/.test(token)) {
      return { type: "Variable", name: token };
    }

    if (token === "(") {
      const expr = parseExpression();
      if (stream.consume() !== ")") throw new Error("Falta paréntesis");
      return { type: "Grouping", expression: expr };
    }

    if (/^[a-zA-Z]+$/.test(token) && stream.peek() === "(") {
      stream.consume(); // "("
      const args: ASTNode[] = [];
      while (stream.peek() && stream.peek() !== ")") {
        args.push(parseExpression());
        if (stream.peek() === ",") stream.consume();
      }
      if (stream.consume() !== ")") throw new Error("Función sin cerrar");
      return { type: "Function", name: token as any, args };
    }

    if (token === "-") {
      const right = parsePrimary();
      return {
        type: "Operator",
        operator: "-",
        left: { type: "Literal", value: 0 },
        right
      };
    }

    throw new Error(`Token no reconocido: ${token}`);
  }

  function parseExpression(minPrec = 0): ASTNode {
    let left = parsePrimary();

    while (true) {
      const op = stream.peek();
      const prec = precedence[op ?? ""] ?? -1;
      if (prec < minPrec) break;

      stream.consume();
      const right = parseExpression(prec + 1);

      left = {
        type: "Operator",
        operator: op as any,
        left,
        right
      };
    }

    return left;
  }

  return parseExpression();
}