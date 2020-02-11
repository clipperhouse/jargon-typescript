import { tags } from "./tags";
import { synonyms } from "./synonyms";
import IDictionary from "../dictionary";

// Dictionary is the main exported Dictionary of Stack Exchange tags and synonyms, from the following Stack Exchange sites: Stack Overflow,
// Server Fault, Game Dev and Data Science. It's indended to identify canonical tags (technologies),
// e.g. Ruby on Rails (3 words) will be replaced with ruby-on-rails (1 word).
// It includes the most popular 2530 tags and 2022 synonyms

const empty = new Set<string>();

class dictionary implements IDictionary {
	private readonly stopWords: Set<string>;

	constructor(stopWords?: Iterable<string>) {
		this.stopWords = stopWords ? new Set<string>(stopWords) : empty;
	}

	public Lookup(input: string[]): string | undefined {
		if (input.length === 1 && this.stopWords.has(input[0])) {
			return undefined;
		}

		const gram = input.join('');
		const key = normalize(gram);

		const tag = tags.get(key);
		if (tag) {
			return tag;
		}

		const synonym = synonyms.get(key);
		if (synonym) {
			return synonym;
		}

		return undefined;
	}
	public readonly maxGramLength = 3;

	public withStopWords(words: Iterable<string>) {
		return new dictionary(words);
	}
}

const Dictionary = new dictionary();

export { Dictionary };
export default Dictionary;

const remove = /[.\-\/]/g;
function normalize(s: string): string {
	return s.replace(remove, '').toLowerCase();
};