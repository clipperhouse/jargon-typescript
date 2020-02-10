export interface Dictionary {
    Lookup(input: string[]): string | null;
    maxGramLength: number;
}
