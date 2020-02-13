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

	protected *map<TFrom, TTo>(this: Iterable<TFrom>, f: (t: TFrom) => TTo): Iterable<TTo> {
		for (const t of this) {
			yield f(t);
		}
	}

	private join<T>(this: Iterable<T>, f: (t: T) => string, separator: string): string {
		return Array.from(this).map(f).join(separator);
	}

	public toString(this: Iterables<Token>): string {
		return this.join<Token>(t => t.value, '');
	}
}