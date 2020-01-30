import * as jargon from "../jargon";
import { Token } from "../token";

let successes = 0;
let failures = 0;
{
    const word = new Token("foo");
    if (word.isPunct) {
        console.error(`token ${word} should not be punctuation`);
        failures++;
    } else {
        successes++;
    }
    if (word.isSpace) {
        console.error(`token ${word} should not be space`);
        failures++;
    } else {
        successes++;
    }
}
{
    const punct = new Token(",");
    if (!punct.isPunct) {
        console.error(`token ${punct} should be punctuation`);
        failures++;
    } else {
        successes++;
    }
    if (punct.isSpace) {
        console.error(`token ${punct} should not be space`);
        failures++;
    } else {
        successes++;
    }
}
{
    const space = new Token(" ");
    if (!space.isSpace) {
        console.error(`token ${space} should be space`);
        failures++;
    } else {
        successes++;
    }
    if (space.isPunct) {
        console.error(`token ${space} should not be punct`);
        failures++;
    } else {
        successes++;
    }
}
{
    const lf = new Token("\n");
    if (!lf.isSpace) {
        console.error(`token ${lf} should be space`);
        failures++;
    } else {
        successes++;
    }
    if (!lf.isPunct) {
        console.error(`token ${lf} should be punct`);
        failures++;
    } else {
        successes++;
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
        console.error(`expected to find token ${e}, but did not.`);
        failures++;
        continue;
    }
    successes++;
}

// Check that last .
let nextToLast = gotArray[gotArray.length - 2];

if (nextToLast != ".") {
    console.error(`next-to-last token should be ., got ${nextToLast}`);
    failures++;
} else {
    successes++;
}

// Check that last \n
let last = gotArray[gotArray.length - 1];
if (last != "\n") {
    console.error(`last token should be \\n, got ${last}`);
    failures++;
} else {
    successes++;
}

// No trailing punctuation
for (const value of gotArray) {
    if (value.isRune()) {
        // Skip actual (not trailing) punctuation
        continue;
    }

    if (value.endsWith('.') || value.endsWith(',')) {
        console.error(`found trailing punctuation in ${value}`);
        failures++;
    } else {
        successes++;
    }
}

const out = failures > 0 ? console.error : console.log;

out(`${successes} successes and ${failures} failures`);

