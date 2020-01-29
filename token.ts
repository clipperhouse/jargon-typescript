// Token represents a piece of text with metadata.
export class Token {
    constructor(
        readonly Value: string,
        readonly IsPunct: boolean = Value.isPunct(),
        readonly IsSpace: boolean = Value.isSpace(),
        readonly IsLemma: boolean = false,
    ) { }
}
