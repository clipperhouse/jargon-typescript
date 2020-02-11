/// <reference lib="dom"/>

export default class testrun {
	private successes = 0;
	private failures = 0;
	constructor(private readonly name: string) {
		console.log(`[${this.name}]\tbegin test run`);
	}

	assert(should: boolean, msg: string) {
		if (should) {
			this.success();
		} else {
			this.failure(msg);
		}
	}

	private success() {
		this.successes++;
	}
	private failure(msg: string) {
		console.error(`[${this.name}]\t${msg}`);
		this.failures++;
	}
	report() {
		const out = this.failures > 0 ? console.error : console.log;

		out(`[${this.name}]\t${this.successes} successes and ${this.failures} failures`);
	}
}

