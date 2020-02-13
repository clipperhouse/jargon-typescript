import Token from "./token";

export default abstract class Iterables<T> implements Iterable<T> {
	constructor() { }

	abstract [Symbol.iterator](): IterableIterator<T>;

	public *filter<T>(this: Iterable<T>, f: (t: T) => boolean): Iterable<T> {
		for (const t of this) {
			if (f(t)) {
				yield t;
			}
		}
	}

	private join<T>(this: Iterable<T>, f: (t: T) => string): string {
		// This looks like a naive implementation but I believe the + operator
		// is pretty optimized these days.
		// Alternative is an intermediate Array.from, with a call to Array.join;
		// the following avoids that approach with a lazier evaluation.

		let result = '';
		for (const t of this) {
			result += f(t);
		}
		return result;
	}

	public toString(this: Iterables<Token>): string {
		return this.join(t => t.value);
	}
}