export default interface Dictionary {
    Lookup(input: string[]): string | undefined;
    maxGramLength: number;
}
