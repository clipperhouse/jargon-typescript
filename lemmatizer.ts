import IDictionary from "./dictionary";
import Token from "./token";
import Tokenize, { Tokens } from "./tokenizer";
import Iterables from "./iterables";

export default Lemmatize;
export { Lemmatize, LemmatizedTokens };

function Lemmatize(input: Iterable<Token> | string, ...dictionaries: Array<IDictionary>): LemmatizedTokens {
	if (typeof input === 'string') {
		input = Tokenize(input);
	}

	let result = input;

	const iterable: boolean = result instanceof Tokens || result instanceof LemmatizedTokens;
	if (!iterable) {
		throw `input needs to be string or an iterable of Token`;
	}

	if (!dictionaries || dictionaries.length === 0) {
		throw `a dictionary is required; consider importing @clipperhouse/jargon/stackexchange`;
	}

	for (const dictionary of dictionaries) {
		const dict = checkDictionary(dictionary);

		if (!dict) {
			throw `not a dictionary: ${dictionary}`;
		}

		result = new LemmatizedTokens(dict, result);
	}

	// If we got this far, result has to be LemmatizedTokens,
	// but TypeScript control flow doesn't know that apparently,
	// so force the assertion.
	if (!(result instanceof LemmatizedTokens)) {
		throw `result should be LemmatizedTokens; this is a bug`;
	}

	return result;
};

function hasDictionaryMembers(dictionary: any) {
	const ok = typeof dictionary.Lookup === 'function' && typeof dictionary.maxGramLength === 'number';
	return ok;
}

function checkDictionary(dictionary: any) {
	// In TypeScript targeting commonjs, default happens automagically
	// In JavaScript, not so much; try to find it
	// Too much magic? Probably.

	if (hasDictionaryMembers(dictionary)) {
		return dictionary;
	}

	const def = dictionary.default;
	if (def && hasDictionaryMembers(def)) {
		return def;
	}

	return undefined;
}

class LemmatizedTokens extends Iterables implements Iterable<Token>  {
	private readonly buffer = new Array<Token>();
	private readonly iterator: Iterator<Token>;

	constructor(private readonly dictionary: IDictionary, incoming: Iterable<Token>) {
		super();
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

	private *ngrams() {
		// Try n-grams, longest to shortest (greedy)
		for (let take = this.dictionary.maxGramLength; take > 0; take--) {
			const wordrun = this.wordrun(take);

			if (!wordrun.success) {
				continue; // on to the next n-gram
			}

			const canonical = this.dictionary.Lookup(wordrun.taken);

			if (canonical) {
				// canonical might be multiple words
				const tokens = Tokenize(canonical);

				for (let token of tokens) {
					const lemma = Token.fromToken(token, true);
					yield lemma;
				}
				this.drop(wordrun.consumed); // discard the incoming tokens that comprised the lemma

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

	private wordrun(take: number): wordrun {
		let taken = new Array<string>();
		let consumed = 0;

		while (taken.length < take) {
			const ok = this.fill(consumed);
			if (!ok) {
				// Not enough (buffered) tokens to continue
				// So, a word run of length `take` is impossible
				return nothing;
			}

			const token = this.buffer[consumed];

			// Note: test for punct before space; newlines and tabs can be
			// considered both punct and space (depending on the tokenizer!)
			// and we want to treat them as breaking word runs.
			if (token.isPunct) {
				return nothing;
			}

			if (token.isSpace) {
				// Ignore and continue
				consumed++;
				continue;
			}

			// Found a word
			taken.push(token.value);
			consumed++;
		}

		const result: wordrun = { taken, consumed, success: true };
		return result;
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

type wordrun = { taken: Array<string>, consumed: number, success: boolean; };
const nothing: wordrun = { taken: new Array<string>(0), consumed: 0, success: false };

