export class TokenStream {
  constructor(private tokens: string[]) {}
  private index = 0;

  peek(): string | undefined {
    return this.tokens[this.index];
  }

  consume(): string {
    return this.tokens[this.index++];
  }

  hasNext(): boolean {
    return this.index < this.tokens.length;
  }
}