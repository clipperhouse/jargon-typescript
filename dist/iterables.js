"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Iterables {
    constructor() { }
    *filter(f) {
        for (const t of this) {
            if (f(t)) {
                yield t;
            }
        }
    }
    toString() {
        // This looks like a naive implementation but I believe the + operator
        // is pretty optimized these days.
        // Alternative is an intermediate Array.from, with a call to Array.join;
        // the following avoids that approach with a lazier evaluation.
        let result = '';
        for (const t of this) {
            result += t.value;
        }
        return result;
    }
}
exports.default = Iterables;
