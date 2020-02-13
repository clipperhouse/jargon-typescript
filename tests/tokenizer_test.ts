import Tokenize from "../tokenizer";
import testrun from "./testrun";

const test = new testrun('tokenizer');

const text = `Hi! This is a test of tech terms. "😀"
It should consider F#, C++, .net, Node.JS and 3.141592 and -123 to be their own tokens. 
Similarly, #hashtag and @handle should work, as should an first.last+@example.com.
It should—wait for it—break on things like em-dashes and "quotes" and it ends.
It'd be great it it’ll handle apostrophes.
`;
const tokens = Tokenize(text);

let got = Array.from(tokens);
const gotSet = new Set<string>(got.map(t => t.value));

const expecteds = [
	"Hi", "!", "a", '"', "😀",
	"F#", "C++", ".net", "Node.JS", "3.141592", "-123",
	"#hashtag", "@handle", "first.last+@example.com",
	"should", "—", "wait", "it", "break", "em-dashes", "quotes", "ends",
	"It'd", "it’ll", "apostrophes",
];

for (const expected of expecteds) {
	test.assert(gotSet.has(expected), `expected to find token ${expected}`);
}

// Check that last .
let nextToLast = got[got.length - 2];
test.assert(nextToLast.value === ".", `next-to-last token should be ., got ${nextToLast}`);

// Check that last \n
let last = got[got.length - 1];
test.assert(last.value === "\n", `last token should be \\n, got ${last}`);

// No trailing punctuation
for (const token of got) {
	if (token.value.isRune()) {
		// Skip actual (not trailing) punctuation
		continue;
	}

	const ok = !token.value.endsWith('.') && !token.value.endsWith(',');
	test.assert(ok, `found trailing punctuation in ${token}`);
}

{
	// Test filter
	const text = 'Hello and good day';
	const tokens = Tokenize(text);
	const spaces = tokens.filter(t => t.isSpace);
	for (const space of spaces) {
		test.assert(space.isSpace, `all tokens should be space, but got ${space}`);
	}
}

{
	// Test toString()
	const text = 'I am a string';
	const lemmatized = Tokenize(text);

	const s = lemmatized.toString();
	test.assert(s === text, `toString should result in ${text}, got ${s}`);
}


test.report();
