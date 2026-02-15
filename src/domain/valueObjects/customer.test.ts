import { describe, expect, test } from "bun:test";
import { Either } from "effect";
import {
	decodeCustomerInfo,
	decodeEmailAddress,
	decodePersonalName,
	decodeVipStatus,
} from "./customer.ts";

describe("decodeEmailAddress", () => {
	test("accepts a valid email address", () => {
		const result = decodeEmailAddress("user@example.com");
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result) as string).toBe("user@example.com");
	});

	test("accepts a minimal email format", () => {
		const result = decodeEmailAddress("a@b");
		expect(Either.isRight(result)).toBe(true);
	});

	test("rejects a string without @", () => {
		const result = decodeEmailAddress("userexample.com");
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects an empty string", () => {
		const result = decodeEmailAddress("");
		expect(Either.isLeft(result)).toBe(true);
	});
});

describe("decodeVipStatus", () => {
	test("accepts 'Normal'", () => {
		const result = decodeVipStatus("Normal");
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result) as string).toBe("Normal");
	});

	test("accepts 'VIP'", () => {
		const result = decodeVipStatus("VIP");
		expect(Either.isRight(result)).toBe(true);
		expect(Either.getOrThrow(result) as string).toBe("VIP");
	});

	test("rejects an invalid status", () => {
		// biome-ignore lint/suspicious/noExplicitAny: testing runtime validation with invalid input
		const result = decodeVipStatus("Gold" as any);
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects an empty string", () => {
		// biome-ignore lint/suspicious/noExplicitAny: testing runtime validation with invalid input
		const result = decodeVipStatus("" as any);
		expect(Either.isLeft(result)).toBe(true);
	});
});

describe("decodePersonalName", () => {
	test("accepts valid first and last name", () => {
		const result = decodePersonalName({ firstName: "John", lastName: "Doe" });
		expect(Either.isRight(result)).toBe(true);
		const name = Either.getOrThrow(result);
		expect(name.firstName as string).toBe("John");
		expect(name.lastName as string).toBe("Doe");
	});

	test("rejects an empty first name", () => {
		const result = decodePersonalName({ firstName: "", lastName: "Doe" });
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects an empty last name", () => {
		const result = decodePersonalName({ firstName: "John", lastName: "" });
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects a first name over 50 chars", () => {
		const result = decodePersonalName({
			firstName: "a".repeat(51),
			lastName: "Doe",
		});
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects a last name over 50 chars", () => {
		const result = decodePersonalName({
			firstName: "John",
			lastName: "a".repeat(51),
		});
		expect(Either.isLeft(result)).toBe(true);
	});
});

describe("decodeCustomerInfo", () => {
	const validCustomerInfo = {
		name: { firstName: "John", lastName: "Doe" },
		emailAddress: "john@example.com",
		vipStatus: "Normal" as const,
	};

	test("accepts valid customer info", () => {
		const result = decodeCustomerInfo(validCustomerInfo);
		expect(Either.isRight(result)).toBe(true);
		const info = Either.getOrThrow(result);
		expect(info.name.firstName as string).toBe("John");
		expect(info.emailAddress as string).toBe("john@example.com");
	});

	test("accepts VIP status", () => {
		const result = decodeCustomerInfo({
			...validCustomerInfo,
			vipStatus: "VIP",
		});
		expect(Either.isRight(result)).toBe(true);
	});

	test("rejects invalid email", () => {
		const result = decodeCustomerInfo({
			...validCustomerInfo,
			emailAddress: "invalid",
		});
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects invalid vipStatus", () => {
		const result = decodeCustomerInfo({
			...validCustomerInfo,
			// biome-ignore lint/suspicious/noExplicitAny: testing runtime validation with invalid input
			vipStatus: "Gold" as any,
		});
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects missing name", () => {
		const { name, ...noName } = validCustomerInfo;
		// biome-ignore lint/suspicious/noExplicitAny: testing runtime validation with invalid input
		const result = decodeCustomerInfo(noName as any);
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects empty first name in name", () => {
		const result = decodeCustomerInfo({
			...validCustomerInfo,
			name: { firstName: "", lastName: "Doe" },
		});
		expect(Either.isLeft(result)).toBe(true);
	});
});
