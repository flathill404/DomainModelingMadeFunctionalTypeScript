import { describe, expect, test } from "bun:test";
import { Either } from "effect";
import {
	type Price,
	decodeBillingAmount,
	decodePrice,
	multiplyPrice,
	sumPrices,
} from "./price.ts";

describe("decodePrice", () => {
	test("accepts a valid price", () => {
		const result = decodePrice(99.99);
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result) as number).toBe(99.99);
	});

	test("accepts 0", () => {
		const result = decodePrice(0);
		expect(Either.isRight(result)).toBe(true);
	});

	test("accepts 1000", () => {
		const result = decodePrice(1000);
		expect(Either.isRight(result)).toBe(true);
	});

	test("rejects a negative number", () => {
		const result = decodePrice(-1);
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects a number over 1000", () => {
		const result = decodePrice(1000.01);
		expect(Either.isLeft(result)).toBe(true);
	});
});

describe("multiplyPrice", () => {
	test("multiplies quantity by price", () => {
		const price = Either.getOrThrow(decodePrice(10));
		const result = multiplyPrice(5, price);
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result) as number).toBe(50);
	});

	test("rejects if result exceeds 1000", () => {
		const price = Either.getOrThrow(decodePrice(500));
		const result = multiplyPrice(3, price);
		expect(Either.isLeft(result)).toBe(true);
	});
});

describe("decodeBillingAmount", () => {
	test("accepts a valid billing amount", () => {
		const result = decodeBillingAmount(5000);
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result) as number).toBe(5000);
	});

	test("accepts 0", () => {
		const result = decodeBillingAmount(0);
		expect(Either.isRight(result)).toBe(true);
	});

	test("accepts 10000", () => {
		const result = decodeBillingAmount(10000);
		expect(Either.isRight(result)).toBe(true);
	});

	test("rejects a negative number", () => {
		const result = decodeBillingAmount(-1);
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects a number over 10000", () => {
		const result = decodeBillingAmount(10000.01);
		expect(Either.isLeft(result)).toBe(true);
	});
});

describe("sumPrices", () => {
	test("sums prices into a billing amount", () => {
		const prices = [100, 200, 300].map((n) =>
			Either.getOrThrow(decodePrice(n)),
		);
		const result = sumPrices(prices);
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result) as number).toBe(600);
	});

	test("returns 0 for an empty price list", () => {
		const result = sumPrices([]);
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result) as number).toBe(0);
	});

	test("rejects if total exceeds 10000", () => {
		const prices = [
			1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1,
		].map((n) => Either.getOrThrow(decodePrice(n))) as Price[];
		const result = sumPrices(prices);
		expect(Either.isLeft(result)).toBe(true);
	});
});
