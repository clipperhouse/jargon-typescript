
let successes = 0;
export function success() {
	successes++;
}

let failures = 0;
export function failure(msg: string) {
	console.error(msg);
	failures++;
}

export function report() {
	const out = failures > 0 ? console.error : console.log;

	out(`${successes} successes and ${failures} failures`);
}