import Token from "./token";

export default abstract class Iterables {
	constructor() { }

	public *filter(this: Iterable<Token>, f: (t: Token) => boolean): Iterable<Token> {
		for (const t of this) {
			if (f(t)) {
				yield t;
			}
		}
	}

	public toString(this: Iterable<Token>): string {
		// This looks like a naive implementation but I believe the + operator
		// is pretty optimized these days.
		// Alternative is an intermediate Array.from, with a call to Array.join;
		// the following avoids that approach with a lazier evaluation.

		let result = '';
		for (const t of this) {
			result += t.value;
		}
		return result;
	}
}