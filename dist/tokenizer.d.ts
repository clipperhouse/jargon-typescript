import Token from "./token";
import "./unicode";
import Iterables from "./iterables";
export default Tokenize;
export { Tokenize, Tokens };
declare function Tokenize(input: string): Tokens;
declare class Tokens extends Iterables implements Iterable<Token> {
    private readonly incoming;
    private readonly outgoing;
    constructor(input: string);
    [Symbol.iterator](): IterableIterator<Token>;
    private accept;
    private token;
    private readWord;
}
