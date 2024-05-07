import IDictionary from "../dictionary";
declare class dictionary implements IDictionary {
    constructor();
    Lookup(input: string[]): string | undefined;
    readonly maxGramLength = 1;
}
declare const Dictionary: dictionary;
export default Dictionary;
export { Dictionary };
