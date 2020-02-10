import { tags } from "./tags";
import { synonyms } from "./synonyms";
import { tagSet } from "./tagset";

// Dictionary is the main exported Dictionary of Stack Exchange tags and synonyms, from the following Stack Exchange sites: Stack Overflow,
// Server Fault, Game Dev and Data Science. It's indended to identify canonical tags (technologies),
// e.g. Ruby on Rails (3 words) will be replaced with ruby-on-rails (1 word).
// It includes the most popular 2530 tags and 2022 synonyms

const Dictionary = {
	Lookup(input: string[]): string | null {
		const gram = input.join('');
		const key = normalize(gram);

		const tag = tryGet(key, tags);
		if (tag) {
			return tag;
		}

		const synonym = tryGet(key, synonyms);
		if (synonym) {
			return synonym;
		}

		return null;
	},
	maxGramLength: 3,
	tags: tags,
	synonyms: synonyms,
};

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