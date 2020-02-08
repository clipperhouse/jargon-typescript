// Token represents a piece of text with metadata.
export class Token {

	readonly isPunct: boolean = this.value.isPunct();
	readonly isSpace: boolean = this.value.isSpace();

	constructor(
		readonly value: string,
		readonly isLemma: boolean = false,
	) { }

	static fromToken(token: Token, isLemma?: boolean): Token {
		return new Token(token.value, isLemma || token.isLemma);
	}

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
