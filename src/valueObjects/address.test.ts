import { describe, expect, test } from "bun:test";
import { Either } from "effect";
import { makeAddress, makeUsStateCode, makeZipCode } from "./address.ts";

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

describe("makeAddress", () => {
	const validAddress = {
		addressLine1: "123 Main St",
		city: "Springfield",
		zipCode: "12345",
		state: "CA",
		country: "US",
	};

	test("accepts a valid address with required fields only", () => {
		const result = makeAddress(validAddress);
		expect(Either.isRight(result)).toBe(true);
		const addr = Either.getOrThrow(result);
		const addressLine1: string = addr.addressLine1;
		const city: string = addr.city;
		expect(addressLine1).toBe("123 Main St");
		expect(city).toBe("Springfield");
	});

	test("accepts a valid address with optional fields", () => {
		const result = makeAddress({
			...validAddress,
			addressLine2: "Apt 4B",
			addressLine3: "Building C",
			addressLine4: "Floor 2",
		});
		expect(Either.isRight(result)).toBe(true);
	});

	test("rejects an address with invalid zip code", () => {
		const result = makeAddress({ ...validAddress, zipCode: "bad" });
		expect(Either.isLeft(result)).toBe(true);
		expect(Either.getOrElse(result, (e) => e)).toBe("Invalid Address format");
	});

	test("rejects an address with invalid state code", () => {
		const result = makeAddress({ ...validAddress, state: "XX" });
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects an address with missing required field", () => {
		const { city, ...missingCity } = validAddress;
		const result = makeAddress(missingCity);
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects an address with empty addressLine1", () => {
		const result = makeAddress({ ...validAddress, addressLine1: "" });
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects an address with addressLine1 over 50 chars", () => {
		const result = makeAddress({
			...validAddress,
			addressLine1: "a".repeat(51),
		});
		expect(Either.isLeft(result)).toBe(true);
	});
});
