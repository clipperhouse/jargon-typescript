Jargon is a TypeScript/JavaScript library for tokenization and lemmatization.

## Quick start

```
npm install "@clipperhouse/jargon@latest"
```

Then create a file, preferably TypeScript.

```ts
// demo.ts

import jargon from '@clipperhouse/jargon';
import stackexchange from '@clipperhouse/jargon/stackexchange';

const text = 'I ❤️ Ruby on Rails and vue';

const lemmas = jargon.Lemmatize(text, stackexchange.Dictionary);

console.log(lemmas.toString());

// I ❤️ ruby-on-rails and vue.js

```

```js
// demo.js

const jargon = require('@clipperhouse/jargon');
const stackexchange = require('@clipperhouse/jargon/stackexchange');

const text = 'I ❤️ Ruby on Rails and vue';

const lemmas = jargon.Lemmatize(text, stackexchange.Dictionary);
console.log(lemmas.toString());

// I ❤️ ruby-on-rails and vue.js
```