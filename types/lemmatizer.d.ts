import IDictionary from "./dictionary";
import Token from "./token";
export default Lemmatize;
export { Lemmatize, LemmaTokens };
declare function Lemmatize(input: Iterable<Token> | string, dictionary: IDictionary): LemmaTokens;
declare class LemmaTokens implements Iterable<Token> {
    private readonly dictionary;
    private readonly buffer;
    private readonly iterator;
    constructor(dictionary: IDictionary, incoming: Iterable<Token>);
    [Symbol.iterator](): IterableIterator<Token>;
    toString(): string;
    Lemmatize(dictionary: IDictionary): LemmaTokens;
    private ngrams;
    private wordrun;
    private drop;
    private fill;
}
