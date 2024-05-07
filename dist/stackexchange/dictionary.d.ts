import IDictionary from "../dictionary";
declare class dictionary implements IDictionary {
    private readonly stopWords;
    constructor(stopWords?: Iterable<string>);
    Lookup(input: string[]): string | undefined;
    readonly maxGramLength = 3;
    withStopWords(words: Iterable<string>): dictionary;
}
declare const Dictionary: dictionary;
export default Dictionary;
export { Dictionary };
