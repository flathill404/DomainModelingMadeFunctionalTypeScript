import { describe, expect, test } from "bun:test";
import { Either } from "effect";
import { decodeAddress, decodeUsStateCode, decodeZipCode } from "./address.ts";

describe("decodeZipCode", () => {
	test("accepts a valid 5-digit zip code", () => {
		const result = decodeZipCode("12345");
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result) as string).toBe("12345");
	});

	test("accepts a zip code with leading zero", () => {
		const result = decodeZipCode("01234");
		expect(Either.isRight(result)).toBe(true);
	});

	test("rejects a 4-digit string", () => {
		expect(Either.isLeft(decodeZipCode("1234"))).toBe(true);
	});

	test("rejects a 6-digit string", () => {
		expect(Either.isLeft(decodeZipCode("123456"))).toBe(true);
	});

	test("rejects a string containing non-digit characters", () => {
		expect(Either.isLeft(decodeZipCode("1234a"))).toBe(true);
	});

	test("rejects an empty string", () => {
		expect(Either.isLeft(decodeZipCode(""))).toBe(true);
	});
});

describe("decodeUsStateCode", () => {
	test.each([
		"CA",
		"NY",
		"TX",
		"FL",
		"WA",
	])("accepts valid state code %s", (code) => {
		const result = decodeUsStateCode(code);
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result) as string).toBe(code);
	});

	test("rejects an invalid state code", () => {
		expect(Either.isLeft(decodeUsStateCode("XX"))).toBe(true);
	});

	test("rejects lowercase letters", () => {
		expect(Either.isLeft(decodeUsStateCode("ca"))).toBe(true);
	});

	test("rejects a 3-letter string", () => {
		expect(Either.isLeft(decodeUsStateCode("CAL"))).toBe(true);
	});

	test("rejects a 1-letter string", () => {
		expect(Either.isLeft(decodeUsStateCode("C"))).toBe(true);
	});

	test("rejects an empty string", () => {
		expect(Either.isLeft(decodeUsStateCode(""))).toBe(true);
	});
});

describe("decodeAddress", () => {
	const validAddress = {
		addressLine1: "123 Main St",
		city: "Springfield",
		zipCode: "12345",
		state: "CA",
		country: "US",
	};

	test("accepts a valid address with required fields only", () => {
		const result = decodeAddress(validAddress);
		expect(Either.isRight(result)).toBe(true);
		const addr = Either.getOrThrow(result);
		const addressLine1: string = addr.addressLine1;
		const city: string = addr.city;
		expect(addressLine1).toBe("123 Main St");
		expect(city).toBe("Springfield");
	});

	test("accepts a valid address with optional fields", () => {
		const result = decodeAddress({
			...validAddress,
			addressLine2: "Apt 4B",
			addressLine3: "Building C",
			addressLine4: "Floor 2",
		});
		expect(Either.isRight(result)).toBe(true);
	});

	test("rejects an address with invalid zip code", () => {
		expect(
			Either.isLeft(decodeAddress({ ...validAddress, zipCode: "bad" })),
		).toBe(true);
	});

	test("rejects an address with invalid state code", () => {
		expect(Either.isLeft(decodeAddress({ ...validAddress, state: "XX" }))).toBe(
			true,
		);
	});

	test("rejects an address with missing required field", () => {
		const { city, ...missingCity } = validAddress;
		expect(Either.isLeft(decodeAddress(missingCity))).toBe(true);
	});

	test("rejects an address with empty addressLine1", () => {
		expect(
			Either.isLeft(decodeAddress({ ...validAddress, addressLine1: "" })),
		).toBe(true);
	});

	test("rejects an address with addressLine1 over 50 chars", () => {
		expect(
			Either.isLeft(
				decodeAddress({
					...validAddress,
					addressLine1: "a".repeat(51),
				}),
			),
		).toBe(true);
	});
});
