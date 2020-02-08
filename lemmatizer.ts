import { Token } from "./token";

export interface Dictionary {
    Lookup(input: string[]): string | null,
}

export class Lemmatizer {
    constructor(private readonly dictionary: Dictionary) { };

    Lemmatize(incoming: Iterable<Token>): LemmaTokens {
        return new LemmaTokens(this.dictionary, incoming);
    };
}

class LemmaTokens implements Iterable<Token> {
    constructor(
        private readonly dictionary: Dictionary,
        private readonly incoming: Iterable<Token>,
    ) { }

    *[Symbol.iterator](): IterableIterator<Token> {
        for (const token of this.incoming) {
            if (token.isPunct || token.isSpace) {
                yield token;
                continue;
            }

            const run = [token.value];  // fake
            const canonical = this.dictionary.Lookup(run);

            if (canonical) {
                yield new Token(canonical, true);
                continue;
            }

            yield token;
        }
    }
}