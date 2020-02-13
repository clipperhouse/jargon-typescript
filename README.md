Jargon is a TypeScript/JavaScript library for tokenization and lemmatization. It finds variations on canonical terms and converts them to a single form.

For example, in tech, you might see 'node js' or 'NodeJS' or 'node.js' and want them understood as the same term. That’s lemmatization.

## Quick start

```
npm install "@clipperhouse/jargon@latest"
```

Then create a file, preferably TypeScript.

```ts
// demo.ts

import jargon from '@clipperhouse/jargon';	
import stackexchange from '@clipperhouse/jargon/stackexchange';	// a dictionary

const text = 'I ❤️ Ruby on Rails and vue';

const lemmatized = jargon.Lemmatize(text, stackexchange);

console.log(lemmatized.toString());

// I ❤️ ruby-on-rails and vue.js

```

```js
// demo.js

const jargon = require('@clipperhouse/jargon');
const stackexchange = require('@clipperhouse/jargon/stackexchange');

const text = 'I ❤️ Ruby on Rails and vue';

const lemmatized = jargon.Lemmatize(text, stackexchange);
console.log(lemmatized.toString());

// I ❤️ ruby-on-rails and vue.js
```

## What’s it doing?

`jargon` tokenizes the incoming text — it’s not search-and-replace or regex. It understands tech-ish terms as single words, such as Node.js and TCP/IP, and #hashtags and @handles, where other tokenizers might split those words. It does pretty well with email addresses and URLs.

Tokens go to the lemmatizer, with a `dictionary`. The lemmatizer passes over tokens, and asks the dictionary if it recognizes them. It greedily looks for multi-token phrases like 'Ruby on Rails', converting them a single `ruby-on-rails` token.

The lemmatizer returns a lazy iterable. You should consume tokens with `for..of`.

## Dictionaries

Two dictionaries are included.

The `stackexchange` dictionary looks for technology terms, using tags and synonyms from Stack Overflow. It is insensitive to spaces, hyphens, dots, slashes and case, so variations like ASPNET and asp.net are recognized as the same thing. It also understands synonyms such as ecmascript ↔ javascript.

Another example is the `contractions` dictionary. It splits tokens like `it'll` into two tokens `it` and `will`.

You can pass multiple dictionaries to the lemmatizer.

```ts
// demo.ts

import jargon from '@clipperhouse/jargon';
import stackexchange from '@clipperhouse/jargon/stackexchange';
import contractions from '@clipperhouse/jargon/contractions';

const text = 'She’ll use react js and type script';

const lemmatized = jargon.Lemmatize(text, stackexchange, contractions);

console.log(lemmatized.toString());

// She will use react.js and typescript

```