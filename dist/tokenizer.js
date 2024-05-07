"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokens = exports.Tokenize = void 0;
const token_1 = __importDefault(require("./token"));
require("./unicode");
const iterables_1 = __importDefault(require("./iterables"));
exports.default = Tokenize;
function Tokenize(input) {
    return new Tokens(input);
}
exports.Tokenize = Tokenize;
class Tokens extends iterables_1.default {
    constructor(input) {
        super();
        if (!input) {
            throw `an input string is required`;
        }
        if (typeof input !== 'string') {
            throw `input must be a string`;
        }
        this.incoming = input[Symbol.iterator]();
        this.outgoing = new Array();
    }
    // Main iterator, caller should use for..of to get tokens
    *[Symbol.iterator]() {
        while (true) {
            const next = this.incoming.next();
            if (next.done) {
                break;
            }
            const rune = next.value;
            if (typeof rune !== 'string') {
                throw `${rune} is not a string`;
            }
            if (!rune.isRune()) {
                throw `${rune} is not a single unicode character (aka rune)`;
            }
            this.accept(rune);
            if (rune.isSpace()) {
                yield this.token();
                continue;
            }
            if (rune.isPunct()) {
                if (!rune.mightBeLeadingPunct()) {
                    // Regular punct, emit it
                    yield this.token();
                    continue;
                }
                // Might be leading punct, like .Net, let's figure it out
                // Lookahead to see if followed by a letter
                // Remember, once we've looked ahead, we need to do something with that value, can't rewind
                const lookahead = this.incoming.next();
                if (lookahead.done) {
                    // Regular punct, emit it
                    yield this.token();
                    continue;
                }
                if (lookahead.value.isPunct() || lookahead.value.isSpace()) {
                    // Rune is a terminator, emit it
                    yield this.token();
                    // Emit the lookahead value
                    this.accept(lookahead.value);
                    yield this.token();
                    continue;
                }
                // Treat it as start of a word & fall through to readWord below
                this.accept(lookahead.value);
            }
            // It's a letter or leading punct
            yield* this.readWord();
        }
        // Anything left in the outgoing buffer is an error
        if (this.outgoing.length > 0) {
            throw "should be nothing left in the buffer, this is a bug";
        }
    }
    ;
    accept(rune) {
        this.outgoing.push(rune);
    }
    token() {
        // Optimization: reuse the same Token for common runes
        //  Primarily a memory (GC) optimization, avoids new'ing up Tokens
        //  Might or might not be a speed improvement
        if (this.outgoing.length === 1) {
            const rune = this.outgoing[0];
            const cached = common.get(rune);
            if (cached) {
                this.outgoing.length = 0;
                return cached;
            }
        }
        const val = this.outgoing.join('');
        this.outgoing.length = 0; // clear it
        return new token_1.default(val);
    }
    *readWord() {
        while (true) {
            const next = this.incoming.next();
            if (next.done) {
                // Emit the buffered word and return to main iterator
                yield this.token();
                return;
            }
            const rune = next.value;
            if (rune.mightBeMidPunct()) {
                // Lookahead to see if current rune is followed by a terminator or EOF
                const lookahead = this.incoming.next();
                if (lookahead.done) {
                    // Rune is regular trailing punct, emit the buffered word
                    yield this.token();
                    // Accept the current punct and emit
                    this.accept(rune);
                    yield this.token();
                    // There's no lookahead rune to worry about
                    // We're done with this word, delegate back to main iterator
                    return;
                }
                if (lookahead.value.isPunct() || lookahead.value.isSpace()) {
                    // Lookahead is a word terminator, implying that current rune is regular punct
                    // Rune is regular trailing punct, emit the buffered word
                    yield this.token();
                    // Accept the current punct and emit
                    this.accept(rune);
                    yield this.token();
                    // Accept the lookahead rune and emit
                    this.accept(lookahead.value);
                    yield this.token();
                    // We're done with this word, delegate back to main iterator
                    return;
                }
                // Rune is mid-word punct, accept it as a word character
                this.accept(rune);
                // The lookahead rune is also a word character, accept and continue
                this.accept(lookahead.value);
                continue;
            }
            if (rune.isPunct() || rune.isSpace()) {
                // Rune is a word terminator
                // Emit the buffered word without the punct
                yield this.token();
                // Emit the punct
                this.accept(rune);
                yield this.token();
                // We're done with this word, delegate back to main iterator
                return;
            }
            // Otherwise it's a word character, keep going
            this.accept(rune);
        }
    }
}
exports.Tokens = Tokens;
const common = {
    tokens: {
        ' ': new token_1.default(' '),
        '\r': new token_1.default('\r'),
        '\n': new token_1.default('\n'),
        '\t': new token_1.default('\t'),
        '.': new token_1.default('.'),
        ',': new token_1.default(','),
    },
    get: function (rune) {
        if (this.tokens.hasOwnProperty(rune)) {
            return this.tokens[rune];
        }
        return null;
    }
};
