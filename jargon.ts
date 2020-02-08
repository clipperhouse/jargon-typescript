import { Token } from "./token";
import { Tokens } from "./tokenizer";
import { Lemmatizer, Dictionary } from "./lemmatizer";

export function Tokenize(input: string) {
    return new Tokens(input);
}

export { Token };

export { Lemmatizer, Dictionary };