export default interface IDictionary {
	Lookup(input: string[]): string | undefined;
	maxGramLength: number;
}
