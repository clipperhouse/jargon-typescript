import { Dictionary } from "./dictionary";
import { Token } from "./token";
import { Tokens, Tokenize } from "./tokenizer";

export function Lemmatize(input: Iterable<Token> | string, dictionary: Dictionary): LemmaTokens {
	if (typeof input === 'string') {
		// Easy mistake to make given the API; handle it
		input = Tokenize(input);
	}

	if (input instanceof Tokens) {
		return new LemmaTokens(dictionary, input);
	}

	throw `input needs to be an Iterable<Token> or a string. You probably need to Tokenize() first and pass that result into Lemmatize().`;
};

class LemmaTokens implements Iterable<Token> {
	private readonly buffer = new Array<Token>();
	private readonly iterator: Iterator<Token>;

	constructor(private readonly dictionary: Dictionary, incoming: Iterable<Token>) {
		this.iterator = incoming[Symbol.iterator]();
	}

	*[Symbol.iterator](): IterableIterator<Token> {
		while (true) {
			// Ensure at least one item in buffer
			this.fill(1);

			if (this.buffer.length === 0) {
				// We're done
				return;
			}

			const token = this.buffer[0];   // next
			if (token.isPunct || token.isSpace) {
				this.drop(1);
				yield token;
				continue;
			}

			yield* this.ngrams();
		}
	}

	public toArray(): Array<Token> {
		let result = new Array<Token>();
		for (const token of this) {
			result.push(token);
		}
		return result;
	}

	private *ngrams() {
		// Try n-grams, longest to shortest (greedy)
		for (let take = this.dictionary.maxGramLength; take > 0; take--) {
			const { taken, count, success } = this.wordrun(take);

			if (!success) {
				continue; // on to the next n-gram
			}

			const canonical = this.dictionary.Lookup(taken);

			if (canonical) {
				const token = new Token(canonical, true);
				this.drop(count); // discard the incoming tokens that comprised the lemma
				yield token;
				return;
			}

			if (take === 1) {
				// No n-grams, just emit
				const original = this.buffer[0];
				this.drop(1);		 // take it out of the buffer
				yield original;
				return;
			}
		}
		throw "did not find a token. this should never happen";
	}

	private wordrun(take: number): { taken: Array<string>, count: number, success: boolean; } {
		const nothing = { taken: [], count: 0, success: false };

		let taken = new Array<string>();
		let count = 0;

		while (taken.length < take) {
			const ok = this.fill(count);
			if (!ok) {
				// Not enough (buffered) tokens to continue
				// So, a word run of length `take` is impossible
				return nothing;
			}

			const token = this.buffer[count];

			// Note: test for punct before space; newlines and tabs can be
			// considered both punct and space (depending on the tokenizer!)
			// and we want to treat them as breaking word runs.
			if (token.isPunct) {
				return nothing;
			}

			if (token.isSpace) {
				// Ignore and continue
				count++;
				continue;
			}

			// Found a word
			taken.push(token.value);
			count++;
		}

		return { taken, count, success: true };
	}
	private drop(n: number) {
		this.buffer.splice(0, n);
	}

	private fill(count: number): boolean {
		while (count >= this.buffer.length) {
			const next = this.iterator.next();
			if (next.done) {
				// EOF
				return false;
			}
			this.buffer.push(next.value);
		}
		return true;
	}
}