import { describe, expect, test } from "bun:test";
import { Either } from "effect";
import { makeEmailAddress, makeString50, makeVipStatus } from "./common.ts";

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

describe("makeEmailAddress", () => {
	test("accepts a valid email address", () => {
		const result = makeEmailAddress("user@example.com");
		expect(Either.isRight(result)).toBe(true);
		const value: string = Either.getOrThrow(result);
		expect(value).toBe("user@example.com");
	});

	test("accepts a minimal email format", () => {
		const result = makeEmailAddress("a@b");
		expect(Either.isRight(result)).toBe(true);
	});

	test("rejects a string without @", () => {
		const result = makeEmailAddress("userexample.com");
		expect(Either.isLeft(result)).toBe(true);
		expect(Either.getOrElse(result, (e) => e)).toBe("Invalid email format");
	});

	test("rejects an empty string", () => {
		const result = makeEmailAddress("");
		expect(Either.isLeft(result)).toBe(true);
	});
});

describe("makeVipStatus", () => {
	test("accepts 'Normal'", () => {
		const result = makeVipStatus("Normal");
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result)).toBe("Normal");
	});

	test("accepts 'VIP'", () => {
		const result = makeVipStatus("VIP");
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result)).toBe("VIP");
	});

	test("accepts case-insensitive input 'normal'", () => {
		const result = makeVipStatus("normal");
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result)).toBe("Normal");
	});

	test("accepts case-insensitive input 'vip'", () => {
		const result = makeVipStatus("vip");
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result)).toBe("VIP");
	});

	test("rejects an invalid status", () => {
		const result = makeVipStatus("Gold");
		expect(Either.isLeft(result)).toBe(true);
		expect(Either.getOrElse(result, (e) => e)).toBe(
			"Must be one of 'Normal', 'VIP'",
		);
	});

	test("rejects an empty string", () => {
		const result = makeVipStatus("");
		expect(Either.isLeft(result)).toBe(true);
	});
});
