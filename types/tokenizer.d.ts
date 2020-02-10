import { Token } from "./token";
import "./unicode";
export declare function Tokenize(input: string): Tokens;
export declare class Tokens implements Iterable<Token> {
    private readonly incoming;
    private readonly outgoing;
    constructor(input: string);
    [Symbol.iterator](): IterableIterator<Token>;
    toArray(): Array<Token>;
    toString(): string;
    private accept;
    private token;
    private readWord;
}
