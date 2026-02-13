import { describe, expect, test } from "bun:test";
import { Either } from "effect";
import {
	makeOrderId,
	makeOrderLineId,
	makeOrderQuantity,
	makeProductCode,
} from "./order.ts";

describe("makeOrderId", () => {
	test("accepts a valid order id", () => {
		const result = makeOrderId("ORD-001");
		expect(Either.isRight(result)).toBe(true);
		const value: string = Either.getOrThrow(result);
		expect(value).toBe("ORD-001");
	});

	test("accepts a string of exactly 10 characters", () => {
		const result = makeOrderId("a".repeat(10));
		expect(Either.isRight(result)).toBe(true);
	});

	test("rejects a string longer than 10 characters", () => {
		const result = makeOrderId("a".repeat(11));
		expect(Either.isLeft(result)).toBe(true);
		expect(Either.getOrElse(result, (e) => e)).toBe(
			"OrderId must be a non-empty string < 10 chars",
		);
	});

	test("rejects an empty string", () => {
		const result = makeOrderId("");
		expect(Either.isLeft(result)).toBe(true);
	});
});

describe("makeOrderLineId", () => {
	test("accepts a valid order line id", () => {
		const result = makeOrderLineId("LINE-01");
		expect(Either.isRight(result)).toBe(true);
		const value: string = Either.getOrThrow(result);
		expect(value).toBe("LINE-01");
	});

	test("accepts a string of exactly 10 characters", () => {
		const result = makeOrderLineId("a".repeat(10));
		expect(Either.isRight(result)).toBe(true);
	});

	test("rejects a string longer than 10 characters", () => {
		const result = makeOrderLineId("a".repeat(11));
		expect(Either.isLeft(result)).toBe(true);
		expect(Either.getOrElse(result, (e) => e)).toBe(
			"OrderLineId must be a non-empty string < 10 chars",
		);
	});

	test("rejects an empty string", () => {
		const result = makeOrderLineId("");
		expect(Either.isLeft(result)).toBe(true);
	});
});

describe("makeProductCode", () => {
	test("accepts a valid WidgetCode (W + 4 digits)", () => {
		const result = makeProductCode("W1234");
		expect(Either.isRight(result)).toBe(true);
		const value: string = Either.getOrThrow(result);
		expect(value).toBe("W1234");
	});

	test("accepts a valid GizmoCode (G + 3 digits)", () => {
		const result = makeProductCode("G123");
		expect(Either.isRight(result)).toBe(true);
		const value: string = Either.getOrThrow(result);
		expect(value).toBe("G123");
	});

	test("rejects a WidgetCode with wrong digit count", () => {
		const result = makeProductCode("W123");
		expect(Either.isLeft(result)).toBe(true);
		expect(Either.getOrElse(result, (e) => e)).toBe(
			"Format not recognized 'W123'",
		);
	});

	test("rejects a GizmoCode with wrong digit count", () => {
		const result = makeProductCode("G1234");
		expect(Either.isLeft(result)).toBe(true);
		expect(Either.getOrElse(result, (e) => e)).toBe(
			"Format not recognized 'G1234'",
		);
	});

	test("rejects an unrecognized prefix", () => {
		const result = makeProductCode("X999");
		expect(Either.isLeft(result)).toBe(true);
		expect(Either.getOrElse(result, (e) => e)).toBe(
			"Format not recognized 'X999'",
		);
	});

	test("rejects an empty string", () => {
		const result = makeProductCode("");
		expect(Either.isLeft(result)).toBe(true);
		expect(Either.getOrElse(result, (e) => e)).toBe(
			"Must not be null or empty",
		);
	});
});

describe("makeOrderQuantity", () => {
	test("creates a Unit quantity for a WidgetCode", () => {
		const productCode = Either.getOrThrow(makeProductCode("W1234"));
		const result = makeOrderQuantity(productCode, 10);
		expect(Either.isRight(result)).toBe(true);
		const qty = Either.getOrThrow(result);
		expect(qty._tag).toBe("Unit");
		const value: number = qty.value;
		expect(value).toBe(10);
	});

	test("floors the quantity for a WidgetCode", () => {
		const productCode = Either.getOrThrow(makeProductCode("W1234"));
		const result = makeOrderQuantity(productCode, 10.7);
		expect(Either.isRight(result)).toBe(true);
		const qty = Either.getOrThrow(result);
		expect(qty._tag).toBe("Unit");
		const value: number = qty.value;
		expect(value).toBe(10);
	});

	test("creates a Kilogram quantity for a GizmoCode", () => {
		const productCode = Either.getOrThrow(makeProductCode("G123"));
		const result = makeOrderQuantity(productCode, 5.5);
		expect(Either.isRight(result)).toBe(true);
		const qty = Either.getOrThrow(result);
		expect(qty._tag).toBe("Kilogram");
		const value: number = qty.value;
		expect(value).toBe(5.5);
	});

	test("rejects a Unit quantity of 0", () => {
		const productCode = Either.getOrThrow(makeProductCode("W1234"));
		const result = makeOrderQuantity(productCode, 0);
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects a Unit quantity over 1000", () => {
		const productCode = Either.getOrThrow(makeProductCode("W1234"));
		const result = makeOrderQuantity(productCode, 1001);
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects a Kilogram quantity below 0.05", () => {
		const productCode = Either.getOrThrow(makeProductCode("G123"));
		const result = makeOrderQuantity(productCode, 0.01);
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects a Kilogram quantity over 100", () => {
		const productCode = Either.getOrThrow(makeProductCode("G123"));
		const result = makeOrderQuantity(productCode, 100.01);
		expect(Either.isLeft(result)).toBe(true);
	});
});
