import * as jargon from "../jargon";

let text = `Hi! This is a test of tech terms. "😀"
It should consider F#, C++, .net, Node.JS and 3.141592 and -123 to be their own tokens. 
Similarly, #hashtag and @handle should work, as should an first.last+@example.com.
It should—wait for it—break on things like em-dashes and "quotes" and it ends.
It'd be great it it’ll handle apostrophes.
`;
const tokens = jargon.Tokenize(text);
let gotLookup: { [value: string]: boolean; } = {};
let gotArray: string[] = [];

for (const token of tokens) {
    gotLookup[token.Value] = true;
    gotArray.push(token.Value);
}

const expected = [
    "Hi", "!", "a", '"', "😀",
    "F#", "C++", ".net", "Node.JS", "3.141592", "-123",
    "#hashtag", "@handle", "first.last+@example.com",
    "should", "—", "wait", "it", "break", "em-dashes", "quotes", "ends",
    "It'd", "it’ll", "apostrophes",
];

let successes = 0;
let failures = 0;

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

console.log(`${successes} successes and ${failures} failures`);
