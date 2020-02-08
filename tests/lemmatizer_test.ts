import * as jargon from "../jargon";
import * as stackexchange from "../stackexchange/dictionary";

let successes = 0;
let failures = 0;

const text = 'I ❤️ rails -- and asp net. ';

const tokens = jargon.Tokenize(text);
const lem = new jargon.Lemmatizer(stackexchange.Dictionary);
const lemmas = lem.Lemmatize(tokens);

for (const lemma of lemmas) {
	console.log(`${lemma}`);
}

const out = failures > 0 ? console.error : console.log;

out(`${successes} successes and ${failures} failures`);

