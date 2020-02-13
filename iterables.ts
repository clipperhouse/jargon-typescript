import Token from "./token";

export default class Iterables {
	constructor() { }

	public *filter<T>(this: Iterable<T>, f: (t: T) => boolean): Iterable<T> {
		for (const t of this) {
			if (f(t)) {
				yield t;
			}
		}
	}

	public *map<TFrom, TTo>(this: Iterable<TFrom>, f: (t: TFrom) => TTo): Iterable<TTo> {
		for (const t of this) {
			yield f(t);
		}
	}

	public toString(this: Iterable<Token>): string {
		return Array.from(this).map(t => t.value).join('');
	}
}