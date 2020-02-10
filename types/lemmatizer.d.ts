import { Dictionary } from "./dictionary";
import { Token } from "./token";
export declare function Lemmatize(input: Iterable<Token> | string, dictionary: Dictionary): LemmaTokens;
declare class LemmaTokens implements Iterable<Token> {
    private readonly dictionary;
    private readonly buffer;
    private readonly iterator;
    constructor(dictionary: Dictionary, incoming: Iterable<Token>);
    [Symbol.iterator](): IterableIterator<Token>;
    toArray(): Array<Token>;
    toString(): string;
    private ngrams;
    private wordrun;
    private drop;
    private fill;
}
export {};
