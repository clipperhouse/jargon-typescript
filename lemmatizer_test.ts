import * as jargon from "./jargon";

let successes = 0;
let failures = 0;

const text = 'Thou art a knave, a beggar, an eater of broken meats!';

const tokens = jargon.Tokenize(text);
const lemmas = jargon.Lemmatize(tokens);

for (const lemma of lemmas) {
    console.log(`${lemma}`);
}

const out = failures > 0 ? console.error : console.log;

out(`${successes} successes and ${failures} failures`);

