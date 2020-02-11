import jargon from "../jargon";
import stackexchange from "../stackexchange";
import contractions from "../contractions";
import Token from "../token";
import testrun from "./testrun";

type test = { value: string, isLemma: boolean; };

const test = new testrun('lemmatizer');

{
	// Ensure that Lemmatize handles input of tokens or string
	const text = 'I ❤️ Rails -- and aspNET and react js and node-js. and C++ and tcp/IP';
	const dict = stackexchange.Dictionary;
	const lemmasByString = Array.from(jargon.Lemmatize(text, dict));
	const tokens = jargon.Tokenize(text);
	const lemmasByToken = Array.from(jargon.Lemmatize(tokens, dict));

	test.assert(lemmasByString.length === lemmasByToken.length, `lemmasByString has ${lemmasByString.length} elements, lemmasByToken has ${lemmasByToken.length} elements`);

	for (let i = 0; i < lemmasByString.length; i++) {
		const byString = lemmasByString[i];
		const byToken = lemmasByToken[i];
		test.assert(byString.equals(byToken), `${byString} != ${byToken}`);
	}
}

function testDict(lemmas: Iterable<Token>, expecteds: Array<test>) {
	let gotLookup: { [value: string]: Token; } = {};

	for (const lemma of lemmas) {
		gotLookup[lemma.value] = lemma;
	}

	for (const expected of expecteds) {
		const found = gotLookup[expected.value];

		const ok = found !== undefined;
		test.assert(ok, `expected to find ${expected.value}`);
		if (!found) continue;

		test.assert(found.isLemma === expected.isLemma, `found ${expected.value}, expected isLemma to be ${expected.isLemma}, but it's ${found.isLemma}`);
	}
}

{
	// Test stackexchange
	const text = 'I ❤️ Rails -- and aspNET and react js and node-js. and C++ and tcp/IP';
	const dict = stackexchange.Dictionary;
	const lemmas = jargon.Lemmatize(text, dict);

	const expecteds: Array<test> = [
		{ value: 'ruby-on-rails', isLemma: true },
		{ value: 'asp.net', isLemma: true },
		{ value: 'reactjs', isLemma: true },
		{ value: 'c++', isLemma: true },
		{ value: 'tcpip', isLemma: true },
		{ value: 'node.js', isLemma: true },
		{ value: '❤️', isLemma: false },
	];

	testDict(lemmas, expecteds);
}

{
	// Test stackexchange stop words
	const text = 'I ❤️ Rails react and react js.';
	const stop = ['react'];
	const dict = stackexchange.Dictionary.withStopWords(stop);
	const lemmas = jargon.Lemmatize(text, dict);

	const expecteds: Array<test> = [
		{ value: 'ruby-on-rails', isLemma: true },
		{ value: 'reactjs', isLemma: true },
		{ value: 'react', isLemma: false },
		{ value: '❤️', isLemma: false },
	];

	testDict(lemmas, expecteds);
}

{
	// Test contractions
	const text = "He's here and we’d be there.";
	const dict = contractions.Dictionary;
	const lemmas = jargon.Lemmatize(text, dict);

	const expecteds: Array<test> = [
		{ value: 'He', isLemma: true },
		{ value: 'is', isLemma: true },
		{ value: 'we', isLemma: true },
		{ value: 'would', isLemma: true },
		{ value: 'here', isLemma: false },
	];

	testDict(lemmas, expecteds);
}

{
	// Test fluent interface
	const text = "She'd enjoy react.js";
	const lemmas = jargon.Lemmatize(text, stackexchange.Dictionary).Lemmatize(contractions.Dictionary);

	const expecteds: Array<test> = [
		{ value: 'She', isLemma: true },
		{ value: 'would', isLemma: true },
		{ value: 'reactjs', isLemma: true },
		{ value: 'enjoy', isLemma: false },
	];

	testDict(lemmas, expecteds);
}

test.report();

