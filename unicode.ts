export { }; // needs to be a module to declare global

declare global {
    interface String {
        isRune(): boolean;
        in(map: runeMap): boolean;
        isPunct(): boolean;
        isSpace(): boolean;
        mightBeLeadingPunct(): boolean;
        mightBeMidPunct(): boolean;
    }
}

// Rune is one Unicode 'character' (2 bytes? 4 bytes?)
// We can't enforce it statically via types, but can provide hints via naming and tests
type rune = string;

/// Indicates whether a string represents a single Unicode 'character' or code point
String.prototype.isRune = function (this: string) {
    return [...this].length === 1;  // https://dev.to/coolgoose/quick-and-easy-way-of-counting-utf-8-characters-in-javascript-23ce
};

type runeMap = { [rune: string]: boolean; };
String.prototype.in = function (this: rune, map: runeMap) {
    return map.hasOwnProperty(this) && map[this] === true;
};

// Unicode category P from https://stackoverflow.com/a/37668315
const unicodeP = /^[!-#%-*,-/\:;?@\[-\]_\{\}\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]+$/;
const punctAsSymbol: runeMap = {
    // In some cases, we want to treat a punct a symbol, as part of a word
    // e.g. asp.net, TCP/IP, email@example.com, #hashtag, @handle
    // See http://www.unicode.org/faq/punctuation_symbols.html
    '-': true,
    '#': true,
    '@': true,
    '*': true,
    '%': true,
    '_': true,
    '/': true,
    '\\': true,
};

const spaceAsPunct: runeMap = {
    '\n': true,
    '\r': true,
    '\t': true,
};
String.prototype.isPunct = function (this: rune) {
    return (unicodeP.test(this) || this.in(spaceAsPunct)) && !this.in(punctAsSymbol);
};

const space = /^\s+$/;
String.prototype.isSpace = function (this: rune): boolean {
    return space.test(this);
};

const leadingPunct: runeMap = {
    // Punctuation that can lead a word, like .Net
    '.': true,
};
String.prototype.mightBeLeadingPunct = function (this: rune): boolean {
    return this.in(leadingPunct);
};

const midPunct: runeMap = {
    // Punctuation that can appear mid-word
    '.': true,
    '\'': true,
    '’': true,
    ':': true,
    '?': true,
    '&': true,
};

String.prototype.mightBeMidPunct = function (this: rune): boolean {
    return this.in(midPunct);
};