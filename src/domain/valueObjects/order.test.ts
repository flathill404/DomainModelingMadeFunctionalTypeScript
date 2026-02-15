import { describe, expect, test } from "bun:test";
import { Either } from "effect";
import {
	decodeOrderId,
	decodeOrderLineId,
	decodeOrderQuantity,
	decodeProductCode,
} from "./order.ts";

describe("decodeOrderId", () => {
	test("accepts a valid order id", () => {
		const result = decodeOrderId("ORD-001");
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result) as string).toBe("ORD-001");
	});

	test("accepts a string of exactly 10 characters", () => {
		const result = decodeOrderId("a".repeat(10));
		expect(Either.isRight(result)).toBe(true);
	});

	test("rejects a string longer than 10 characters", () => {
		const result = decodeOrderId("a".repeat(11));
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects an empty string", () => {
		const result = decodeOrderId("");
		expect(Either.isLeft(result)).toBe(true);
	});
});

describe("decodeOrderLineId", () => {
	test("accepts a valid order line id", () => {
		const result = decodeOrderLineId("LINE-01");
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result) as string).toBe("LINE-01");
	});

	test("accepts a string of exactly 10 characters", () => {
		const result = decodeOrderLineId("a".repeat(10));
		expect(Either.isRight(result)).toBe(true);
	});

	test("rejects a string longer than 10 characters", () => {
		const result = decodeOrderLineId("a".repeat(11));
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects an empty string", () => {
		const result = decodeOrderLineId("");
		expect(Either.isLeft(result)).toBe(true);
	});
});

describe("decodeProductCode", () => {
	test("accepts a valid WidgetCode (W + 4 digits)", () => {
		const result = decodeProductCode("W1234");
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result) as string).toBe("W1234");
	});

	test("accepts a valid GizmoCode (G + 3 digits)", () => {
		const result = decodeProductCode("G123");
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result) as string).toBe("G123");
	});

	test("rejects a WidgetCode with wrong digit count", () => {
		const result = decodeProductCode("W123");
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects a GizmoCode with wrong digit count", () => {
		const result = decodeProductCode("G1234");
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects an unrecognized prefix", () => {
		const result = decodeProductCode("X999");
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects an empty string", () => {
		const result = decodeProductCode("");
		expect(Either.isLeft(result)).toBe(true);
	});
});

describe("decodeOrderQuantity", () => {
	test("creates a Unit quantity for a WidgetCode", () => {
		const productCode = Either.getOrThrow(decodeProductCode("W1234"));
		const result = decodeOrderQuantity(productCode, 10);
		expect(Either.isRight(result)).toBe(true);
		const qty = Either.getOrThrow(result);
		expect(qty._tag).toBe("Unit");
		if (qty._tag === "Unit") {
			const value: number = qty.value;
			expect(value).toBe(10);
		}
	});

	test("floors the quantity for a WidgetCode", () => {
		const productCode = Either.getOrThrow(decodeProductCode("W1234"));
		const result = decodeOrderQuantity(productCode, 10.7);
		expect(Either.isRight(result)).toBe(true);
		const qty = Either.getOrThrow(result);
		expect(qty._tag).toBe("Unit");
		if (qty._tag === "Unit") {
			const value: number = qty.value;
			expect(value).toBe(10);
		}
	});

	test("creates a Kilogram quantity for a GizmoCode", () => {
		const productCode = Either.getOrThrow(decodeProductCode("G123"));
		const result = decodeOrderQuantity(productCode, 5.5);
		expect(Either.isRight(result)).toBe(true);
		const qty = Either.getOrThrow(result);
		expect(qty._tag).toBe("Kilogram");
		if (qty._tag === "Kilogram") {
			const value: number = qty.value;
			expect(value).toBe(5.5);
		}
	});

	test("rejects a Unit quantity of 0", () => {
		const productCode = Either.getOrThrow(decodeProductCode("W1234"));
		const result = decodeOrderQuantity(productCode, 0);
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects a Unit quantity over 1000", () => {
		const productCode = Either.getOrThrow(decodeProductCode("W1234"));
		const result = decodeOrderQuantity(productCode, 1001);
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects a Kilogram quantity below 0.05", () => {
		const productCode = Either.getOrThrow(decodeProductCode("G123"));
		const result = decodeOrderQuantity(productCode, 0.01);
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects a Kilogram quantity over 100", () => {
		const productCode = Either.getOrThrow(decodeProductCode("G123"));
		const result = decodeOrderQuantity(productCode, 100.01);
		expect(Either.isLeft(result)).toBe(true);
	});
});
