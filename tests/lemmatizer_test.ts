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
	if (!found) {
		test.failure(`expected to find ${expected.value}, but did not`);
		continue;
	}
	if (found.isLemma !== expected.isLemma) {
		test.failure(`found ${expected.value}, expected isLemma to be ${expected.isLemma}, but it's ${found.isLemma}`);
		continue;
	}
	test.success();
}

test.report();

