import { Token } from "./token";
import { Dictionary } from "./dictionary";
export declare class Lemmatizer {
    private readonly dictionary;
    constructor(dictionary: Dictionary);
    Lemmatize(input: Iterable<Token> | string): LemmaTokens;
}
declare class LemmaTokens implements Iterable<Token> {
    private readonly dictionary;
    private readonly buffer;
    private readonly iterator;
    constructor(dictionary: Dictionary, incoming: Iterable<Token>);
    [Symbol.iterator](): IterableIterator<Token>;
    toArray(): Array<Token>;
    private ngrams;
    private wordrun;
    private drop;
    private fill;
}
export {};
