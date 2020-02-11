import Token from "./token";
import "./unicode";
export default Tokenize;
export { Tokenize, Tokens };
declare function Tokenize(input: string): Tokens;
declare class Tokens implements Iterable<Token> {
    private readonly incoming;
    private readonly outgoing;
    constructor(input: string);
    [Symbol.iterator](): IterableIterator<Token>;
    toString(): string;
    private accept;
    private token;
    private readWord;
}
