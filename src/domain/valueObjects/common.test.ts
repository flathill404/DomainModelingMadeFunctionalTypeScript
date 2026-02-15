import { describe, expect, test } from "bun:test";
import { Either } from "effect";
import { decodeString50 } from "./common.ts";

describe("decodeString50", () => {
	test("accepts a valid string", () => {
		const result = decodeString50("hello");
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result) as string).toBe("hello");
	});

	test("accepts a string of exactly 50 characters", () => {
		const result = decodeString50("a".repeat(50));
		expect(Either.isRight(result)).toBe(true);
	});

	test("rejects a string longer than 50 characters", () => {
		expect(Either.isLeft(decodeString50("a".repeat(51)))).toBe(true);
	});

	test("rejects an empty string", () => {
		expect(Either.isLeft(decodeString50(""))).toBe(true);
	});
});
