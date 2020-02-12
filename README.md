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

const lemmas = jargon.Lemmatize(text, stackexchange);

console.log(lemmas.toString());

// I ❤️ ruby-on-rails and vue.js

```

```js
// demo.js

const jargon = require('@clipperhouse/jargon');
const stackexchange = require('@clipperhouse/jargon/stackexchange');

const text = 'I ❤️ Ruby on Rails and vue';

const lemmas = jargon.Lemmatize(text, stackexchange);
console.log(lemmas.toString());

// I ❤️ ruby-on-rails and vue.js
```

## What’s it doing?

`jargon` tokenizes the incoming text, identifying punctuation and spaces. It understands tech-ish terms as single words, such as asp.net and TCP/IP, and #hangtags and @handles (other tokenizers would see two words).

Those tokens go to the lemmatizer, with a `dictionary`. The lemmatizer passes over tokens, and asks the dictionary if it recognizes them. It handles multi-token phrases like 'Ruby on Rails', converting it a single `ruby-on-rails` token.

It is insensitive to spaces, hyphens, dots, slashes and case -- so it handles a lot of variation that would be difficult to get right with simple search-and-replace or regex.

These rules are defined in a Dictionary. In the above examples, `stackexchange` is the dictionary, and it knows about react vs react.js. It also understands synonyms, such as ecmascript ↔ javascript.

Another example is the `contractions` dictionary. It'll split tokens like `it'll` into two tokens `it` and `will`.