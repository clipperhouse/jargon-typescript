export declare class Token {
    readonly value: string;
    readonly isLemma: boolean;
    readonly isPunct: boolean;
    readonly isSpace: boolean;
    constructor(value: string, isLemma?: boolean);
    static fromToken(token: Token, isLemma?: boolean): Token;
    equals(token: Token): boolean;
    toString(this: Token): string;
}
