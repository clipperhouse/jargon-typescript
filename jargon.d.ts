/// <reference lib="es2015" />
import { Token } from "./token";
import { Tokens } from "./tokenizer";
import { Lemmatizer } from "./lemmatizer";
import { Dictionary } from "./dictionary";
export declare function Tokenize(input: string): Tokens;
export { Token };
export { Lemmatizer, Dictionary };
