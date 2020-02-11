import testrun from "./testrun";
import jargon from "../jargon";
import * as lemmatizer from "../lemmatizer";
import * as tokenizer from "../tokenizer";

// test the main API

const test = new testrun('jargon api');

test.assert(jargon.Tokenize === tokenizer.Tokenize, `the exposed jargon.Tokenize should be the implementation in tokenizer.ts`);
test.assert(jargon.Lemmatize === lemmatizer.Lemmatize, `the exposed jargon.Lemmatize should be the implementation in lemmatizer.ts`);

test.report();