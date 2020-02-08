import * as jargon from "../jargon";
import * as stackexchange from "../stackexchange/dictionary";

let successes = 0;
let failures = 0;

const text = 'I ❤️ Rails -- and aspNET and react js and node-js. and C++ and tcp/IP';

const tokens = jargon.Tokenize(text);
const lem = new jargon.Lemmatizer(stackexchange.Dictionary);
const lemmas = lem.Lemmatize(tokens);

let gotLookup: { [value: string]: jargon.Token; } = {};

for (const lemma of lemmas) {
	gotLookup[lemma.value] = lemma;
}

type expected = { value: string, isLemma: boolean; };
const expected = [
	{ value: 'ruby-on-rails', isLemma: true },
	{ value: 'asp.net', isLemma: true },
	{ value: 'reactjs', isLemma: true },
	{ value: 'c++', isLemma: true },
	{ value: 'tcpip', isLemma: true },
	{ value: 'node.js', isLemma: true },
	{ value: '❤️', isLemma: false },
];

for (const e of expected) {
	const found = gotLookup[e.value];
	if (!found) {
		console.error(`expected to find ${e.value}, but did not`);
		failures++;
		continue;
	}
	if (found.isLemma !== e.isLemma) {
		console.error(`found ${e.value}, expected isLemma to be ${e.isLemma}, but it's ${found.isLemma}`);
		failures++;
		continue;
	}
	successes++;
}

const out = failures > 0 ? console.error : console.log;

out(`${successes} successes and ${failures} failures`);

