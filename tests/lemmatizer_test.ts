import * as jargon from "../jargon";

class RandomDictionary implements jargon.Dictionary {
	Lookup(input: string[]): string | null {
		const rand = Math.random();
		if (rand < .1) {   // 10%
			return `${input.join('-')}-random`;
		}
		return null;
	}
	maxGramLength = 3;
}

let successes = 0;
let failures = 0;

const text = 'Thou art a knave, a beggar, an eater of broken meats!';

const tokens = jargon.Tokenize(text);
const dict = new RandomDictionary();
const lem = new jargon.Lemmatizer(dict);
const lemmas = lem.Lemmatize(tokens);

for (const lemma of lemmas) {
	console.log(`${lemma}`);
}

const out = failures > 0 ? console.error : console.log;

out(`${successes} successes and ${failures} failures`);

