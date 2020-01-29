// Token represents a piece of text with metadata.
export class Token {
    constructor(
        readonly value: string,
        readonly isPunct: boolean = value.isPunct(),
        readonly isSpace: boolean = value.isSpace(),
        readonly isLemma: boolean = false,
    ) { }
}

Token.prototype.toString = function (this: Token): string {
    return `{${this.value.replace('\n', '\\n')}}`;
};