export default interface Dictionary {
	Lookup(input: string[]): string | null;
	maxGramLength: number;
}
