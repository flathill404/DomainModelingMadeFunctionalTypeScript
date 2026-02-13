import { describe, expect, test } from "bun:test";
import { Either } from "effect";
import { makeString50 } from "./common.ts";

describe("makeString50", () => {
	test("accepts a valid string", () => {
		const result = makeString50("hello");
		expect(Either.isRight(result)).toBe(true);
		const value: string = Either.getOrThrow(result);
		expect(value).toBe("hello");
	});

	test("accepts a string of exactly 50 characters", () => {
		const input = "a".repeat(50);
		const result = makeString50(input);
		expect(Either.isRight(result)).toBe(true);
	});

	test("rejects a string longer than 50 characters", () => {
		const input = "a".repeat(51);
		const result = makeString50(input);
		expect(Either.isLeft(result)).toBe(true);
		expect(Either.getOrElse(result, (e) => e)).toBe(
			"String50 must not be null, empty or > 50 chars",
		);
	});

	test("rejects an empty string", () => {
		const result = makeString50("");
		expect(Either.isLeft(result)).toBe(true);
	});
});
