import { Tokens } from "./tokenizers";

export function Tokenize(input: string) {
    return new Tokens(input);
}
