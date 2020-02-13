import Token from "./token";
export default abstract class Iterables<T> implements Iterable<T> {
    constructor();
    abstract [Symbol.iterator](): IterableIterator<T>;
    filter<T>(this: Iterable<T>, f: (t: T) => boolean): Iterable<T>;
    private join;
    toString(this: Iterables<Token>): string;
}
