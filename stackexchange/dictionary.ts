import { tags } from "./tags";
import { synonyms } from "./synonyms";
import { tagSet } from "./tagset";
import { Dictionary } from "../dictionary";

// Dictionary is the main exported Dictionary of Stack Exchange tags and synonyms, from the following Stack Exchange sites: Stack Overflow,
// Server Fault, Game Dev and Data Science. It's indended to identify canonical tags (technologies),
// e.g. Ruby on Rails (3 words) will be replaced with ruby-on-rails (1 word).
// It includes the most popular 2530 tags and 2022 synonyms

class dict implements Dictionary {
	constructor(private readonly tags: tagSet, private readonly synonyms: tagSet) { }

	public Lookup(input: string[]): string | null {
		const gram = input.join('');
		const key = normalize(gram);

		const tag = tryGet(key, this.tags);
		if (tag) {
			return tag;
		}

		const synonym = tryGet(key, this.synonyms);
		if (synonym) {
			return synonym;
		}

		return null;
	}
	public readonly maxGramLength = 3;
}

const Dictionary = new dict(tags, synonyms);

export { Dictionary };
export default { Dictionary };

function tryGet(key: string, set: tagSet): string | null {
	if (set.hasOwnProperty(key)) {
		return set[key];
	}
	return null;
}

const remove = /[.\-\/]/g;
function normalize(s: string): string {
	return s.replace(remove, '').toLowerCase();
};