export function tokenize(input: string): string[] {
  return input
    .replace(/\s+/g, "")
    .replace(/([+\-*/^=()])/g, " $1 ")
    .trim()
    .split(/\s+/);
}