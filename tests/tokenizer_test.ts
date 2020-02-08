import * as jargon from "../jargon";
import { testrun } from "./testrun";

const test = new testrun('tokenizer');

{
	const word = new jargon.Token("foo");
	if (word.isPunct) {
		test.failure(`token ${word} should not be punctuation`);
	} else {
		test.success();
	}

	if (word.isSpace) {
		test.failure(`token ${word} should not be space`);
	} else {
		test.success();
	}
}
{
	const punct = new jargon.Token(",");
	if (!punct.isPunct) {
		test.failure(`token ${punct} should be punctuation`);
	} else {
		test.success();
	}
	if (punct.isSpace) {
		test.failure(`token ${punct} should not be space`);
	} else {
		test.success();
	}
}
{
	const space = new jargon.Token(" ");
	if (!space.isSpace) {
		test.failure(`token ${space} should be space`);
	} else {
		test.success();
	}
	if (space.isPunct) {
		test.failure(`token ${space} should not be punct`);
	} else {
		test.success();
	}
}
{
	const lf = new jargon.Token("\n");
	if (!lf.isSpace) {
		test.failure(`token ${lf} should be space`);
	} else {
		test.success();
	}
	if (!lf.isPunct) {
		test.failure(`token ${lf} should be punct`);
	} else {
		test.success();
	}
}

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
	const found = e.in(gotLookup);
	if (!found) {
		test.failure(`expected to find token ${e}, but did not.`);
		continue;
	}
	test.success();
}

// Check that last .
let nextToLast = gotArray[gotArray.length - 2];

if (nextToLast != ".") {
	test.failure(`next-to-last token should be ., got ${nextToLast}`);
} else {
	test.success();
}

// Check that last \n
let last = gotArray[gotArray.length - 1];
if (last != "\n") {
	test.failure(`last token should be \\n, got ${last}`);
} else {
	test.success();
}

// No trailing punctuation
for (const value of gotArray) {
	if (value.isRune()) {
		// Skip actual (not trailing) punctuation
		continue;
	}

	if (value.endsWith('.') || value.endsWith(',')) {
		test.failure(`found trailing punctuation in ${value}`);
	} else {
		test.success();
	}
}

test.report();
