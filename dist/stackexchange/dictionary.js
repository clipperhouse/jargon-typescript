"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dictionary = void 0;
const tags_1 = __importDefault(require("./tags"));
const synonyms_1 = __importDefault(require("./synonyms"));
// Dictionary is the main exported Dictionary of Stack Exchange tags and synonyms, from the following Stack Exchange sites: Stack Overflow,
// Server Fault, Game Dev and Data Science. It's indended to identify canonical tags (technologies),
// e.g. Ruby on Rails (3 words) will be replaced with ruby-on-rails (1 word).
// It includes the most popular 2530 tags and 2022 synonyms
const empty = new Set();
class dictionary {
    constructor(stopWords) {
        this.maxGramLength = 3;
        this.stopWords = stopWords ? new Set(stopWords) : empty;
    }
    Lookup(input) {
        if (input.length === 1 && this.stopWords.has(input[0])) {
            return undefined;
        }
        const gram = input.join('');
        const key = normalize(gram);
        const tag = tags_1.default.get(key);
        if (tag) {
            return tag;
        }
        const synonym = synonyms_1.default.get(key);
        if (synonym) {
            return synonym;
        }
        return undefined;
    }
    withStopWords(words) {
        return new dictionary(words);
    }
}
const Dictionary = new dictionary();
exports.Dictionary = Dictionary;
exports.default = Dictionary;
const remove = /[.\-\/]/g;
function normalize(s) {
    return s.replace(remove, '').toLowerCase();
}
;
