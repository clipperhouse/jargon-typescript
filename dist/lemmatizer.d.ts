import IDictionary from "./dictionary";
import Token from "./token";
import Iterables from "./iterables";
export default Lemmatize;
export { Lemmatize, LemmatizedTokens };
declare function Lemmatize(input: Iterable<Token> | string, ...dictionaries: Array<IDictionary>): LemmatizedTokens;
declare class LemmatizedTokens extends Iterables implements Iterable<Token> {
    private readonly dictionary;
    private readonly buffer;
    private readonly iterator;
    constructor(dictionary: IDictionary, incoming: Iterable<Token>);
    [Symbol.iterator](): IterableIterator<Token>;
    private ngrams;
    private wordrun;
    private drop;
    private fill;
}
