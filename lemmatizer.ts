import { Dictionary } from "./dictionary";
import { Token } from "./token";
import { Tokens, Tokenize } from "./tokenizer";

export function Lemmatize(input: Iterable<Token> | string, dictionary: Dictionary): LemmaTokens {
	if (!dictionary) {
		throw `a dictionary is required; consider importing jargon/stackexchange`;
	}

	if (typeof input === 'string') {
		input = Tokenize(input);
	}

	if (input instanceof Tokens) {
		return new LemmaTokens(dictionary, input);
	}

	throw `input needs to be an Iterable<Token> (via Tokenize) or a string`;
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
		return Array.from(this);
	}

	public toString() {
		return Array.from(this).map(t => t.value).join('');
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
				// canonical might be multiple words
				const tokens = Tokenize(canonical);

				for (let token of tokens) {
					const lemma = Token.fromToken(token, true);
					this.drop(count); // discard the incoming tokens that comprised the lemma
					yield lemma;
				}

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