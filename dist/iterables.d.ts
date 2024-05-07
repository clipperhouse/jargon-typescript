import Token from "./token";
export default abstract class Iterables {
    constructor();
    filter(this: Iterable<Token>, f: (t: Token) => boolean): Iterable<Token>;
    toString(this: Iterable<Token>): string;
}
