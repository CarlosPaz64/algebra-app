export function insertImplicitMultiplication(tokens: string[]): string[] {
  const result: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const curr = tokens[i];
    const next = tokens[i + 1];

    result.push(curr);

    // Insertar * entre: número o variable o ')' seguido de '(' o variable
    if (
      (isLiteralOrVariable(curr) || curr === ")") &&
      (next === "(" || /^[a-zA-Z]$/.test(next))
    ) {
      result.push("*");
    }

    // Detectar 4x como '4', '*', 'x'
    const match = curr.match(/^(\d+)([a-zA-Z])$/);
    if (match) {
      result.pop(); // eliminar el token original (ej. '4x')
      result.push(match[1]); // número
      result.push("*");
      result.push(match[2]); // variable
    }
  }

  return result;
}

function isLiteralOrVariable(token: string): boolean {
  return !isNaN(Number(token)) || /^[a-zA-Z]$/.test(token);
}
