import { Token } from "./token";
import { Tokens } from "./tokenizer";
import { Lemmatizer } from "./lemmatizer";
import { Dictionary } from "./dictionary";

export function Tokenize(input: string) {
	return new Tokens(input);
}

export { Token };

export { Lemmatizer, Dictionary };