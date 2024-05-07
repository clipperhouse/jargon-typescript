/// <reference lib="dom" />
export default class testrun {
    private readonly name;
    private successes;
    private failures;
    constructor(name: string);
    assert(should: boolean, msg: string): void;
    private success;
    private failure;
    report(): void;
}
