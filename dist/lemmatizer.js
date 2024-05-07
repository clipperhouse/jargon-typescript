"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LemmatizedTokens = exports.Lemmatize = void 0;
const token_1 = __importDefault(require("./token"));
const tokenizer_1 = __importStar(require("./tokenizer"));
const iterables_1 = __importDefault(require("./iterables"));
exports.default = Lemmatize;
function Lemmatize(input, ...dictionaries) {
    if (typeof input === 'string') {
        input = (0, tokenizer_1.default)(input);
    }
    let result = input;
    const iterable = result instanceof tokenizer_1.Tokens || result instanceof LemmatizedTokens;
    if (!iterable) {
        throw `input needs to be string or an iterable of Token`;
    }
    if (!dictionaries || dictionaries.length === 0) {
        throw `a dictionary is required; consider importing @clipperhouse/jargon/stackexchange`;
    }
    for (const dictionary of dictionaries) {
        const dict = checkDictionary(dictionary);
        if (!dict) {
            throw `not a dictionary: ${dictionary}`;
        }
        result = new LemmatizedTokens(dict, result);
    }
    // If we got this far, result has to be LemmatizedTokens,
    // but TypeScript control flow doesn't know that apparently,
    // so force the assertion.
    if (!(result instanceof LemmatizedTokens)) {
        throw `result should be LemmatizedTokens; this is a bug`;
    }
    return result;
}
exports.Lemmatize = Lemmatize;
;
function hasDictionaryMembers(dictionary) {
    const ok = typeof dictionary.Lookup === 'function' && typeof dictionary.maxGramLength === 'number';
    return ok;
}
function checkDictionary(dictionary) {
    // In TypeScript targeting commonjs, default happens automagically
    // In JavaScript, not so much; try to find it
    // Too much magic? Probably.
    if (hasDictionaryMembers(dictionary)) {
        return dictionary;
    }
    const def = dictionary.default;
    if (def && hasDictionaryMembers(def)) {
        return def;
    }
    return undefined;
}
class LemmatizedTokens extends iterables_1.default {
    constructor(dictionary, incoming) {
        super();
        this.dictionary = dictionary;
        this.buffer = new Array();
        this.iterator = incoming[Symbol.iterator]();
    }
    *[Symbol.iterator]() {
        while (true) {
            // Ensure at least one item in buffer
            this.fill(1);
            if (this.buffer.length === 0) {
                // We're done
                return;
            }
            const token = this.buffer[0]; // next
            if (token.isPunct || token.isSpace) {
                this.drop(1);
                yield token;
                continue;
            }
            yield* this.ngrams();
        }
    }
    *ngrams() {
        // Try n-grams, longest to shortest (greedy)
        for (let take = this.dictionary.maxGramLength; take > 0; take--) {
            const wordrun = this.wordrun(take);
            if (!wordrun.success) {
                continue; // on to the next n-gram
            }
            const canonical = this.dictionary.Lookup(wordrun.taken);
            if (canonical) {
                // canonical might be multiple words
                const tokens = (0, tokenizer_1.default)(canonical);
                for (let token of tokens) {
                    const lemma = token_1.default.fromToken(token, true);
                    yield lemma;
                }
                this.drop(wordrun.consumed); // discard the incoming tokens that comprised the lemma
                return;
            }
            if (take === 1) {
                // No n-grams, just emit
                const original = this.buffer[0];
                this.drop(1); // take it out of the buffer
                yield original;
                return;
            }
        }
        throw "did not find a token. this should never happen";
    }
    wordrun(take) {
        let taken = new Array();
        let consumed = 0;
        while (taken.length < take) {
            const ok = this.fill(consumed);
            if (!ok) {
                // Not enough (buffered) tokens to continue
                // So, a word run of length `take` is impossible
                return nothing;
            }
            const token = this.buffer[consumed];
            // Note: test for punct before space; newlines and tabs can be
            // considered both punct and space (depending on the tokenizer!)
            // and we want to treat them as breaking word runs.
            if (token.isPunct) {
                return nothing;
            }
            if (token.isSpace) {
                // Ignore and continue
                consumed++;
                continue;
            }
            // Found a word
            taken.push(token.value);
            consumed++;
        }
        const result = { taken, consumed, success: true };
        return result;
    }
    drop(n) {
        this.buffer.splice(0, n);
    }
    fill(count) {
        while (count >= this.buffer.length) {
            const next = this.iterator.next();
            if (next.done) {
                // EOF
                return false;
            }
            this.buffer.push(next.value);
        }
        return true;
    }
}
exports.LemmatizedTokens = LemmatizedTokens;
const nothing = { taken: new Array(0), consumed: 0, success: false };
