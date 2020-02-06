// Token represents a piece of text with metadata.
export class Token {
    constructor(
        readonly value: string,
        readonly isPunct: boolean = value.isPunct(),
        readonly isSpace: boolean = value.isSpace(),
        readonly isLemma: boolean = false,
    ) { }
    toString(this: Token): string {
        let out = new Array<string>();

        const val = `'${this.value.replace('\n', '\\n').replace('\r', '\\r').replace('\t', '\\t')}'`;
        out.push(val);

        this.isPunct && out.push('isPunct');
        this.isSpace && out.push('isSpace');
        this.isLemma && out.push('isLemma');
        return `{${out.join(',')}}`;
    };
};
