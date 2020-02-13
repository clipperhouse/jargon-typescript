import IDictionary from "./dictionary";
import Token from "./token";
export default Lemmatize;
export { Lemmatize, LemmatizedTokens };
declare function Lemmatize(input: Iterable<Token> | string, ...dictionaries: Array<IDictionary>): Iterable<Token>;
declare class LemmatizedTokens implements Iterable<Token> {
    private readonly dictionary;
    private readonly buffer;
    private readonly iterator;
    constructor(dictionary: IDictionary, incoming: Iterable<Token>);
    [Symbol.iterator](): IterableIterator<Token>;
    toString(): string;
    private ngrams;
    private wordrun;
    private drop;
    private fill;
}
