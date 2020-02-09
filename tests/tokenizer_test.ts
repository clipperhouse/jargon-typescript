import * as jargon from "../jargon";
import { testrun } from "./testrun";

const test = new testrun('tokenizer');

const word = new jargon.Token("foo");
test.assert(!word.isPunct, `token ${word} should not be punctuation`);
test.assert(!word.isSpace, `token ${word} should not be space`);

const punct = new jargon.Token(",");
test.assert(punct.isPunct, `token ${punct} should be punctuation`);
test.assert(!punct.isSpace, `token ${punct} should not be space`);

const space = new jargon.Token(" ");
test.assert(space.isSpace, `token ${space} should be space`);
test.assert(!space.isPunct, `token ${space} should not be punct`);

const lf = new jargon.Token("\n");
test.assert(lf.isSpace, `token ${lf} should be space`);
test.assert(lf.isPunct, `token ${lf} should be punct`);


const text = `Hi! This is a test of tech terms. "😀"
It should consider F#, C++, .net, Node.JS and 3.141592 and -123 to be their own tokens. 
Similarly, #hashtag and @handle should work, as should an first.last+@example.com.
It should—wait for it—break on things like em-dashes and "quotes" and it ends.
It'd be great it it’ll handle apostrophes.
`;
const tokens = jargon.Tokenize(text);
let gotLookup: { [value: string]: boolean; } = {};
let gotArray: string[] = [];

for (const token of tokens) {
	gotLookup[token.value] = true;
	gotArray.push(token.value);
}

const expected = [
	"Hi", "!", "a", '"', "😀",
	"F#", "C++", ".net", "Node.JS", "3.141592", "-123",
	"#hashtag", "@handle", "first.last+@example.com",
	"should", "—", "wait", "it", "break", "em-dashes", "quotes", "ends",
	"It'd", "it’ll", "apostrophes",
];

for (const e of expected) {
	test.assert(e.in(gotLookup), `expected to find token ${e}`);
}

// Check that last .
let nextToLast = gotArray[gotArray.length - 2];
test.assert(nextToLast === ".", `next-to-last token should be ., got ${nextToLast}`);

// Check that last \n
let last = gotArray[gotArray.length - 1];
test.assert(last === "\n", `last token should be \\n, got ${last}`);

// No trailing punctuation
for (const value of gotArray) {
	if (value.isRune()) {
		// Skip actual (not trailing) punctuation
		continue;
	}

	const ok = !value.endsWith('.') && !value.endsWith(',');
	test.assert(ok, `found trailing punctuation in ${value}`);
}

test.report();
