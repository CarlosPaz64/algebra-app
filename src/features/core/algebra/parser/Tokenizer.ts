export function tokenize(input: string): string[] {
  input = input.replace(/−/g, "-"); // ← normaliza el guion largo

  const tokens: string[] = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    if (char === " ") {
      i++;
      continue;
    }

    if ("+-*/^=()".includes(char)) {
      tokens.push(char);
      i++;
      continue;
    }

    if (/\d/.test(char)) {
      let num = char;
      i++;
      while (i < input.length && /[\d.]/.test(input[i])) {
        num += input[i++];
      }
      tokens.push(num);
      continue;
    }

    if (/[a-zA-Z]/.test(char)) {
      tokens.push(char);
      i++;
      continue;
    }

    throw new Error(`Carácter no reconocido: '${char}'`);
  }

  return tokens;
}
