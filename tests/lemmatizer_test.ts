import * as jargon from "../jargon";
import * as stackexchange from "../stackexchange/dictionary";
import { testrun } from "./testrun";

const test = new testrun('lemmatizer');

const text = 'I ❤️ Rails -- and aspNET and react js and node-js. and C++ and tcp/IP';

const tokens = jargon.Tokenize(text);
const lem = new jargon.Lemmatizer(stackexchange.Dictionary);
const lemmas = lem.Lemmatize(tokens);

let gotLookup: { [value: string]: jargon.Token; } = {};

for (const lemma of lemmas) {
	gotLookup[lemma.value] = lemma;
}

type test = { value: string, isLemma: boolean; };
const expecteds: Array<test> = [
	{ value: 'ruby-on-rails', isLemma: true },
	{ value: 'asp.net', isLemma: true },
	{ value: 'reactjs', isLemma: true },
	{ value: 'c++', isLemma: true },
	{ value: 'tcpip', isLemma: true },
	{ value: 'node.js', isLemma: true },
	{ value: '❤️', isLemma: false },
];

for (const expected of expecteds) {
	const found = gotLookup[expected.value];

	const ok = found !== undefined;
	test.assert(ok, `expected to find ${expected.value}`);
	if (!found) continue;

	test.assert(found.isLemma === expected.isLemma, `found ${expected.value}, expected isLemma to be ${expected.isLemma}, but it's ${found.isLemma}`);
}

{
	// Ensure that Lemmatize handles input of tokens or string
	const lemmasByString = lem.Lemmatize(text).toArray();
	const tokens = jargon.Tokenize(text);
	const lemmasByToken = lem.Lemmatize(tokens).toArray();

	test.assert(lemmasByString.length === lemmasByToken.length, `lemmasByString has ${lemmasByString.length} elements, lemmasByToken has ${lemmasByToken.length} elements`);

	for (let i = 0; i < lemmasByString.length; i++) {
		const byString = lemmasByString[i];
		const byToken = lemmasByToken[i];
		test.assert(byString.equals(byToken), `${byString} != ${byToken}`);
	}
}


test.report();

