import { Token } from "./token";

export class LemmaTokens implements Iterable<Token> {
    constructor(private readonly incoming: Iterable<Token>) { }

    *[Symbol.iterator](): IterableIterator<Token> {
        for (const token of this.incoming) {
            console.log(`Incoming: ${token}`);
            const lemma = Token.fromToken(token, true);
            console.log(`Lemma: ${lemma}`);
            yield lemma;
        }
    }
}