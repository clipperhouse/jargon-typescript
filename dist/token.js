"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./unicode");
// Token represents a piece of text with metadata.
class Token {
    constructor(value, isLemma = false) {
        this.value = value;
        this.isLemma = isLemma;
        this.isPunct = this.value.isPunct();
        this.isSpace = this.value.isSpace();
    }
    static fromToken(token, isLemma) {
        return new Token(token.value, isLemma || token.isLemma);
    }
    equals(token) {
        return token.value === this.value &&
            token.isPunct === this.isPunct &&
            token.isSpace === this.isSpace &&
            token.isLemma === this.isLemma;
    }
    toString() {
        let out = new Array();
        const val = `'${this.value.replace('\n', '\\n').replace('\r', '\\r').replace('\t', '\\t')}'`;
        out.push(val);
        this.isPunct && out.push('isPunct');
        this.isSpace && out.push('isSpace');
        this.isLemma && out.push('isLemma');
        return `{${out.join(',')}}`;
    }
    ;
}
exports.default = Token;
;
