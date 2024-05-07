"use strict";
/// <reference lib="dom"/>
Object.defineProperty(exports, "__esModule", { value: true });
class testrun {
    constructor(name) {
        this.name = name;
        this.successes = 0;
        this.failures = 0;
        console.log(`[${this.name}]\tbegin test run`);
    }
    assert(should, msg) {
        if (should) {
            this.success();
        }
        else {
            this.failure(msg);
        }
    }
    success() {
        this.successes++;
    }
    failure(msg) {
        console.error(`[${this.name}]\t${msg}`);
        this.failures++;
    }
    report() {
        const out = this.failures > 0 ? console.error : console.log;
        out(`[${this.name}]\t${this.successes} successes and ${this.failures} failures`);
    }
}
exports.default = testrun;
