// Token represents a piece of text with metadata.
export class Token {
    constructor(
        readonly Value: string,
        readonly IsPunct: boolean = false,
        readonly IsSpace: boolean = false,
        readonly IsLemma: boolean = false,
    ) { }
}
