"use strict";
/// <reference lib="ES2015" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lemmatize = exports.Tokenize = void 0;
const tokenizer_1 = __importDefault(require("./tokenizer"));
exports.Tokenize = tokenizer_1.default;
const lemmatizer_1 = __importDefault(require("./lemmatizer"));
exports.Lemmatize = lemmatizer_1.default;
exports.default = { Tokenize: tokenizer_1.default, Lemmatize: lemmatizer_1.default };
