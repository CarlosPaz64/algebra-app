export function insertImplicitMultiplication(tokens: string[]): string[] {
  const result: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const curr = tokens[i];
    const next = tokens[i + 1];

    result.push(curr);

    if (
      (isLiteralOrVariable(curr) || curr === ")") &&
      (next === "(" || /^[a-zA-Z]$/.test(next))
    ) {
      result.push("*");
    }
  }

  return result;
}

function isLiteralOrVariable(token: string): boolean {
  return !isNaN(Number(token)) || /^[a-zA-Z]$/.test(token);
}