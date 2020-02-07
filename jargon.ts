import { Token } from "./token";
import { Tokens } from "./tokenizers";
import { LemmaTokens } from "./lemmatizer";

export function Tokenize(input: string) {
    return new Tokens(input);
}

export function Lemmatize(tokens: Iterable<Token>) {
    return new LemmaTokens(tokens);
}