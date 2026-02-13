import { describe, expect, test } from "bun:test";
import { Either } from "effect";
import { makeUsStateCode, makeZipCode } from "./address.ts";

describe("makeZipCode", () => {
	test("accepts a valid 5-digit zip code", () => {
		const result = makeZipCode("12345");
		expect(Either.isRight(result)).toBe(true);
		const value: string = Either.getOrThrow(result);
		expect(value).toBe("12345");
	});

	test("accepts a zip code with leading zero", () => {
		const result = makeZipCode("01234");
		expect(Either.isRight(result)).toBe(true);
	});

	test("rejects a 4-digit string", () => {
		const result = makeZipCode("1234");
		expect(Either.isLeft(result)).toBe(true);
		expect(Either.getOrElse(result, (e) => e)).toBe("ZipCode must be 5 digits");
	});

	test("rejects a 6-digit string", () => {
		const result = makeZipCode("123456");
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects a string containing non-digit characters", () => {
		const result = makeZipCode("1234a");
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects an empty string", () => {
		const result = makeZipCode("");
		expect(Either.isLeft(result)).toBe(true);
	});
});

describe("makeUsStateCode", () => {
	test.each([
		"CA",
		"NY",
		"TX",
		"FL",
		"WA",
	])("accepts valid state code %s", (code) => {
		const result = makeUsStateCode(code);
		expect(Either.isRight(result)).toBe(true);
		const value: string = Either.getOrThrow(result);
		expect(value).toBe(code);
	});

	test("rejects an invalid state code", () => {
		const result = makeUsStateCode("XX");
		expect(Either.isLeft(result)).toBe(true);
		expect(Either.getOrElse(result, (e) => e)).toBe("Invalid US State Code");
	});

	test("rejects lowercase letters", () => {
		const result = makeUsStateCode("ca");
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects a 3-letter string", () => {
		const result = makeUsStateCode("CAL");
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects a 1-letter string", () => {
		const result = makeUsStateCode("C");
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects an empty string", () => {
		const result = makeUsStateCode("");
		expect(Either.isLeft(result)).toBe(true);
	});
});
