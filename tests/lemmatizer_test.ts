import contractions from "../contractions";
import Lemmatize from "../lemmatizer";
import stackexchange from "../stackexchange";
import Token from "../token";
import Tokenize from "../tokenizer";
import testrun from "./testrun";
import IDictionary from "../dictionary";

const test = new testrun('lemmatizer');

{
	// Ensure that Lemmatize handles input of tokens or string
	const text = 'I ❤️ Rails -- and aspNET and react js and node-js. and C++ and tcp/IP';
	const lemmatizedString = Array.from(Lemmatize(text, stackexchange));
	const tokens = Tokenize(text);
	const lemmatizedTokens = Array.from(Lemmatize(tokens, stackexchange));

	test.assert(lemmatizedString.length === lemmatizedTokens.length, `lemmasByString has ${lemmatizedString.length} elements, lemmasByToken has ${lemmatizedTokens.length} elements`);

	for (let i = 0; i < lemmatizedString.length; i++) {
		const byString = lemmatizedString[i];
		const byToken = lemmatizedTokens[i];
		test.assert(byString.equals(byToken), `${byString} != ${byToken}`);
	}
}

type expected = { value: string, isLemma: boolean; };

function testDict(tokens: Iterable<Token>, expecteds: Iterable<expected>) {
	let gotLookup: { [value: string]: Token; } = {};

	for (const token of tokens) {
		gotLookup[token.value] = token;
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
	const dict = stackexchange;
	const lemmatized = Lemmatize(text, dict);

	const expecteds: Array<expected> = [
		{ value: 'ruby-on-rails', isLemma: true },
		{ value: 'asp.net', isLemma: true },
		{ value: 'reactjs', isLemma: true },
		{ value: 'c++', isLemma: true },
		{ value: 'tcpip', isLemma: true },
		{ value: 'node.js', isLemma: true },
		{ value: '❤️', isLemma: false },
	];

	testDict(lemmatized, expecteds);
}

{
	// Test stackexchange stop words
	const text = 'I ❤️ Rails react and react js.';
	const stop = ['react'];
	const dict = stackexchange.withStopWords(stop);
	const lemmatized = Lemmatize(text, dict);

	const expecteds: Array<expected> = [
		{ value: 'ruby-on-rails', isLemma: true },
		{ value: 'reactjs', isLemma: true },
		{ value: 'react', isLemma: false },
		{ value: '❤️', isLemma: false },
	];

	testDict(lemmatized, expecteds);
}

{
	// Test contractions
	const text = "He's here and we’d be there.";
	const dict = contractions;
	const lemmatized = Lemmatize(text, dict);

	const expecteds: Array<expected> = [
		{ value: 'He', isLemma: true },
		{ value: 'is', isLemma: true },
		{ value: 'we', isLemma: true },
		{ value: 'would', isLemma: true },
		{ value: 'here', isLemma: false },
	];

	testDict(lemmatized, expecteds);
}

{
	// Test multiple dictionaries
	const text = "She'd enjoy react.js";
	const lemmatized = Lemmatize(text, stackexchange, contractions);

	const expecteds: Array<expected> = [
		{ value: 'She', isLemma: true },
		{ value: 'would', isLemma: true },
		{ value: 'reactjs', isLemma: true },
		{ value: 'enjoy', isLemma: false },
	];

	testDict(lemmatized, expecteds);
}

{
	// Test no dictionary
	const text = "She'd enjoy react.js";
	let caught: string | undefined;
	try {
		Lemmatize(text);
	} catch (error) {
		caught = error;
	}
	test.assert(caught !== undefined, `lack of dictionary should throw`);
}

{
	// Test bad dictionary
	const text = "She'd enjoy react.js";
	let caught: string | undefined;
	try {
		Lemmatize(text, {} as IDictionary);
	} catch (error) {
		caught = error;
	}
	test.assert(caught !== undefined, `non-dictionary should throw`);
}

{
	// Test Lemmas()
	const text = 'I ❤️ Rails -- and aspNET and react js and node-js. and C++ and tcp/IP';
	const dict = stackexchange;
	const lemmatized = Lemmatize(text, dict);
	const lemmas = lemmatized.Lemmas();

	for (const lemma of lemmas) {
		test.assert(lemma.isLemma, `all tokens should be lemmas, but got ${lemma}`);
	}
}

test.report();

