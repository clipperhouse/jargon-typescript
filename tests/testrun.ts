
export class testrun {
	private successes = 0;
	private failures = 0;
	constructor(private readonly name: string) {
		console.log(`[${this.name}]\tbegin test run`);
	}
	success() {
		this.successes++;
	}
	failure(msg: string) {
		console.error(`[${this.name}]\t${msg}`);
		this.failures++;
	}
	report() {
		const out = this.failures > 0 ? console.error : console.log;

		out(`[${this.name}]\t${this.successes} successes and ${this.failures} failures`);
	}
}

