import testrun from "./testrun";
import Token from "../token";

const test = new testrun('token');

const word = new Token("foo");
test.assert(!word.isPunct, `token ${word} should not be punctuation`);
test.assert(!word.isSpace, `token ${word} should not be space`);

const punct = new Token(",");
test.assert(punct.isPunct, `token ${punct} should be punctuation`);
test.assert(!punct.isSpace, `token ${punct} should not be space`);

const space = new Token(" ");
test.assert(space.isSpace, `token ${space} should be space`);
test.assert(!space.isPunct, `token ${space} should not be punct`);

const lf = new Token("\n");
test.assert(lf.isSpace, `token ${lf} should be space`);
test.assert(lf.isPunct, `token ${lf} should be punct`);

test.report();