"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dictionary_1 = __importDefault(require("../contractions/dictionary"));
const dictionary_2 = __importDefault(require("../stackexchange/dictionary"));
const lemmatizer_1 = __importDefault(require("../lemmatizer"));
const tokenizer_1 = __importDefault(require("../tokenizer"));
const testrun_1 = __importDefault(require("./testrun"));
const test = new testrun_1.default('lemmatizer');
{
    // Ensure that Lemmatize handles input of tokens or string
    const text = 'I ❤️ Rails -- and aspNET and react js and node-js. and C++ and tcp/IP';
    const lemmatizedString = Array.from((0, lemmatizer_1.default)(text, dictionary_2.default));
    const tokens = (0, tokenizer_1.default)(text);
    const lemmatizedTokens = Array.from((0, lemmatizer_1.default)(tokens, dictionary_2.default));
    test.assert(lemmatizedString.length === lemmatizedTokens.length, `lemmasByString has ${lemmatizedString.length} elements, lemmasByToken has ${lemmatizedTokens.length} elements`);
    for (let i = 0; i < lemmatizedString.length; i++) {
        const byString = lemmatizedString[i];
        const byToken = lemmatizedTokens[i];
        test.assert(byString.equals(byToken), `${byString} != ${byToken}`);
    }
}
function testDict(tokens, expecteds) {
    let gotLookup = {};
    for (const token of tokens) {
        gotLookup[token.value] = token;
    }
    for (const expected of expecteds) {
        const found = gotLookup[expected.value];
        const ok = found !== undefined;
        test.assert(ok, `expected to find ${expected.value}`);
        if (!found)
            continue;
        test.assert(found.isLemma === expected.isLemma, `found ${expected.value}, expected isLemma to be ${expected.isLemma}, but it's ${found.isLemma}`);
    }
}
{
    // Test stackexchange
    const text = 'I ❤️ Rails -- and aspNET and react js and node-js. and C++ and tcp/IP';
    const dict = dictionary_2.default;
    const lemmatized = (0, lemmatizer_1.default)(text, dict);
    const expecteds = [
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
    const dict = dictionary_2.default.withStopWords(stop);
    const lemmatized = (0, lemmatizer_1.default)(text, dict);
    const expecteds = [
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
    const dict = dictionary_1.default;
    const lemmatized = (0, lemmatizer_1.default)(text, dict);
    const expecteds = [
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
    const lemmatized = (0, lemmatizer_1.default)(text, dictionary_2.default, dictionary_1.default);
    const expecteds = [
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
    let caught;
    try {
        (0, lemmatizer_1.default)(text);
    }
    catch (error) {
        caught = error;
    }
    test.assert(caught !== undefined, `lack of dictionary should throw`);
}
{
    // Test bad dictionary
    const text = "She'd enjoy react.js";
    let caught;
    try {
        (0, lemmatizer_1.default)(text, {});
    }
    catch (error) {
        caught = error;
    }
    test.assert(caught !== undefined, `non-dictionary should throw`);
}
{
    // Test filter()
    const text = 'I ❤️ Rails -- and aspNET and react js and node-js. and C++ and tcp/IP';
    const dict = dictionary_2.default;
    const lemmatized = (0, lemmatizer_1.default)(text, dict);
    const lemmas = lemmatized.filter(t => t.isLemma);
    for (const lemma of lemmas) {
        test.assert(lemma.isLemma, `all tokens should be lemmas, but got ${lemma}`);
    }
}
{
    // Test toString()
    const text = 'I am a string';
    const dict = dictionary_2.default;
    const lemmatized = (0, lemmatizer_1.default)(text, dict);
    const s = lemmatized.toString();
    test.assert(s === text, `toString should result in ${text}, got ${s}`);
}
test.report();
