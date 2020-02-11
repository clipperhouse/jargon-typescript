import Dictionary from "../dictionary";
import { variations } from "./variations";

class dict implements Dictionary {
	constructor() { }

	public Lookup(input: string[]): string | null {
		if (input.length !== 1) {
			return null;
		}

		const key = input[0];

		const variation = variations.get(key);
		if (variation) {
			return variation;
		}

		return null;
	}

	public readonly maxGramLength = 1;
}

const Dictionary = new dict();

export { Dictionary };
export default { Dictionary };
