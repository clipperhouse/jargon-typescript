import IDictionary from "../dictionary";
import variations from "./variations";

class dictionary implements IDictionary {
	constructor() { }

	public Lookup(input: string[]): string | undefined {
		if (input.length !== 1) {
			return undefined;
		}

		const key = input[0];

		const variation = variations.get(key);
		if (variation) {
			return variation;
		}

		return undefined;
	}

	public readonly maxGramLength = 1;
}

const Dictionary = new dictionary();

export default Dictionary;
export { Dictionary };