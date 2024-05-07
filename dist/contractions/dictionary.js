"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dictionary = void 0;
const variations_1 = __importDefault(require("./variations"));
class dictionary {
    constructor() {
        this.maxGramLength = 1;
    }
    Lookup(input) {
        if (input.length !== 1) {
            return undefined;
        }
        const key = input[0];
        const variation = variations_1.default.get(key);
        if (variation) {
            return variation;
        }
        return undefined;
    }
}
const Dictionary = new dictionary();
exports.Dictionary = Dictionary;
exports.default = Dictionary;
