import { describe, expect, test } from "bun:test";
import { Either } from "effect";
import {
	makeBillingAmount,
	makePrice,
	multiplyPrice,
	type Price,
	sumPrices,
} from "./price.ts";

describe("makePrice", () => {
	test("accepts a valid price", () => {
		const result = makePrice(99.99);
		expect(Either.isRight(result)).toBe(true);
		const value: number = Either.getOrThrow(result);
		expect(value).toBe(99.99);
	});

	test("accepts 0", () => {
		const result = makePrice(0);
		expect(Either.isRight(result)).toBe(true);
	});

	test("accepts 1000", () => {
		const result = makePrice(1000);
		expect(Either.isRight(result)).toBe(true);
	});

	test("rejects a negative number", () => {
		const result = makePrice(-1);
		expect(Either.isLeft(result)).toBe(true);
		expect(Either.getOrElse(result, (e) => e)).toBe(
			"Price must be between 0 and 1000",
		);
	});

	test("rejects a number over 1000", () => {
		const result = makePrice(1000.01);
		expect(Either.isLeft(result)).toBe(true);
	});
});

describe("multiplyPrice", () => {
	test("multiplies quantity by price", () => {
		const price = Either.getOrThrow(makePrice(10));
		const result = multiplyPrice(5, price);
		expect(Either.isRight(result)).toBe(true);
		const value: number = Either.getOrThrow(result);
		expect(value).toBe(50);
	});

	test("rejects if result exceeds 1000", () => {
		const price = Either.getOrThrow(makePrice(500));
		const result = multiplyPrice(3, price);
		expect(Either.isLeft(result)).toBe(true);
	});
});

describe("makeBillingAmount", () => {
	test("accepts a valid billing amount", () => {
		const result = makeBillingAmount(5000);
		expect(Either.isRight(result)).toBe(true);
		const value: number = Either.getOrThrow(result);
		expect(value).toBe(5000);
	});

	test("accepts 0", () => {
		const result = makeBillingAmount(0);
		expect(Either.isRight(result)).toBe(true);
	});

	test("accepts 10000", () => {
		const result = makeBillingAmount(10000);
		expect(Either.isRight(result)).toBe(true);
	});

	test("rejects a negative number", () => {
		const result = makeBillingAmount(-1);
		expect(Either.isLeft(result)).toBe(true);
		expect(Either.getOrElse(result, (e) => e)).toBe(
			"BillingAmount must be between 0 and 10000",
		);
	});

	test("rejects a number over 10000", () => {
		const result = makeBillingAmount(10000.01);
		expect(Either.isLeft(result)).toBe(true);
	});
});

describe("sumPrices", () => {
	test("sums prices into a billing amount", () => {
		const prices = [100, 200, 300].map((n) => Either.getOrThrow(makePrice(n)));
		const result = sumPrices(prices);
		expect(Either.isRight(result)).toBe(true);
		const value: number = Either.getOrThrow(result);
		expect(value).toBe(600);
	});

	test("returns 0 for an empty price list", () => {
		const result = sumPrices([]);
		expect(Either.isRight(result)).toBe(true);
		const value: number = Either.getOrThrow(result);
		expect(value).toBe(0);
	});

	test("rejects if total exceeds 10000", () => {
		const prices = [
			1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1,
		].map((n) => Either.getOrThrow(makePrice(n))) as Price[];
		const result = sumPrices(prices);
		expect(Either.isLeft(result)).toBe(true);
	});
});
