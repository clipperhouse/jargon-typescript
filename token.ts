// Token represents a piece of text with metadata.
export class Token {
    constructor(
        readonly value: string,
        readonly isPunct: boolean = value.isPunct(),
        readonly isSpace: boolean = value.isSpace(),
        readonly isLemma: boolean = false,
    ) { }
    toString(this: Token): string {
        const val = this.value.replace('\n', '\\n');
        const isPunct = this.isPunct ? 'isPunct' : '';
        const isSpace = this.isSpace ? 'isSpace' : '';
        const isLemma = this.isLemma ? 'isLemma' : '';
        const out = [val, isPunct, isSpace, isLemma].join(',');
        return `{${out}}`;
    };
};
