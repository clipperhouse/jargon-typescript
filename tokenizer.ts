import Token from "./token";
import "./unicode";

export default Tokenize;
export { Tokenize, Tokens };

function Tokenize(input: string) {
	return new Tokens(input);
}

class Tokens implements Iterable<Token> {
	private readonly incoming: IterableIterator<string>;
	private readonly outgoing: Array<string>;
	constructor(input: string) {
		if (!input) {
			throw `an input string is required`;
		}

		if (typeof input !== 'string') {
			throw `input must be a string`;
		}

		this.incoming = input[Symbol.iterator]();
		this.outgoing = new Array<string>();
	}

	// Main iterator, caller should use for..of to get tokens
	*[Symbol.iterator](): IterableIterator<Token> {
		while (true) {
			const next = this.incoming.next();

			if (next.done) {
				break;
			}

			const rune = next.value;
			if (typeof rune !== 'string') { throw `${rune} is not a string`; }
			if (!rune.isRune()) { throw `${rune} is not a single unicode character (aka rune)`; }

			this.accept(rune);

			if (rune.isSpace()) {
				yield this.token();
				continue;
			}

			if (rune.isPunct()) {
				if (!rune.mightBeLeadingPunct()) {
					// Regular punct, emit it
					yield this.token();
					continue;
				}

				// Might be leading punct, like .Net, let's figure it out

				// Lookahead to see if followed by a letter
				// Remember, once we've looked ahead, we need to do something with that value, can't rewind
				const lookahead = this.incoming.next();

				if (lookahead.done) {
					// Regular punct, emit it
					yield this.token();
					continue;
				}

				if (lookahead.value.isPunct() || lookahead.value.isSpace()) {
					// Rune is a terminator, emit it
					yield this.token();

					// Emit the lookahead value
					this.accept(lookahead.value);
					yield this.token();

					continue;
				}

				// Treat it as start of a word & fall through to readWord below
				this.accept(lookahead.value);
			}

			// It's a letter or leading punct
			yield* this.readWord();
		}

		// Anything left in the outgoing buffer is an error
		if (this.outgoing.length > 0) {
			throw "should be nothing left in the buffer, this is a bug";
		}
	};

	public toString() {
		return Array.from(this).map(t => t.value).join('');
	}

	private accept(rune: string) {
		this.outgoing.push(rune);
	}

	private token(): Token {
		// Optimization: reuse the same Token for common runes
		//  Primarily a memory (GC) optimization, avoids new'ing up Tokens
		//  Might or might not be a speed improvement
		if (this.outgoing.length === 1) {
			const rune = this.outgoing[0];
			const cached = common.get(rune);
			if (cached) {
				this.outgoing.length = 0;
				return cached;
			}
		}

		const val = this.outgoing.join('');
		this.outgoing.length = 0;   // clear it

		return new Token(val);
	}

	private *readWord() {
		while (true) {
			const next = this.incoming.next();

			if (next.done) {
				// Emit the buffered word and return to main iterator
				yield this.token();
				return;
			}

			const rune = next.value;

			if (rune.mightBeMidPunct()) {
				// Lookahead to see if current rune is followed by a terminator or EOF
				const lookahead = this.incoming.next();

				if (lookahead.done) {
					// Rune is regular trailing punct, emit the buffered word
					yield this.token();

					// Accept the current punct and emit
					this.accept(rune);
					yield this.token();

					// There's no lookahead rune to worry about

					// We're done with this word, delegate back to main iterator
					return;
				}

				if (lookahead.value.isPunct() || lookahead.value.isSpace()) {
					// Lookahead is a word terminator, implying that current rune is regular punct

					// Rune is regular trailing punct, emit the buffered word
					yield this.token();

					// Accept the current punct and emit
					this.accept(rune);
					yield this.token();

					// Accept the lookahead rune and emit
					this.accept(lookahead.value);
					yield this.token();

					// We're done with this word, delegate back to main iterator
					return;
				}

				// Rune is mid-word punct, accept it as a word character
				this.accept(rune);

				// The lookahead rune is also a word character, accept and continue
				this.accept(lookahead.value);

				continue;
			}

			if (rune.isPunct() || rune.isSpace()) {
				// Rune is a word terminator

				// Emit the buffered word without the punct
				yield this.token();

				// Emit the punct
				this.accept(rune);
				yield this.token();

				// We're done with this word, delegate back to main iterator
				return;
			}

			// Otherwise it's a word character, keep going
			this.accept(rune);
		}
	}
}

type tokenCache = {
	tokens: { [rune: string]: Token; },
	get: (rune: string) => Token | null,
};

const common: tokenCache = {
	tokens: {
		' ': new Token(' '),
		'\r': new Token('\r'),
		'\n': new Token('\n'),
		'\t': new Token('\t'),
		'.': new Token('.'),
		',': new Token(','),
	},

	get: function (rune: string) {
		if (this.tokens.hasOwnProperty(rune)) {
			return this.tokens[rune];
		}
		return null;
	}
};
