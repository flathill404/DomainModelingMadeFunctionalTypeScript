import { describe, expect, test } from "bun:test";
import { Either } from "effect";
import {
	makeCustomerInfo,
	makeEmailAddress,
	makePersonalName,
	makeVipStatus,
} from "./customer.ts";

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

describe("makePersonalName", () => {
	test("accepts valid first and last name", () => {
		const result = makePersonalName("John", "Doe");
		expect(Either.isRight(result)).toBe(true);
		const name = Either.getOrThrow(result);
		const firstName: string = name.firstName;
		const lastName: string = name.lastName;
		expect(firstName).toBe("John");
		expect(lastName).toBe("Doe");
	});

	test("rejects an empty first name", () => {
		const result = makePersonalName("", "Doe");
		expect(Either.isLeft(result)).toBe(true);
		expect(Either.getOrElse(result, (e) => e)).toBe(
			"Invalid Personal Name: Both must be < 50 chars and not empty",
		);
	});

	test("rejects an empty last name", () => {
		const result = makePersonalName("John", "");
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects a first name over 50 chars", () => {
		const result = makePersonalName("a".repeat(51), "Doe");
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects a last name over 50 chars", () => {
		const result = makePersonalName("John", "a".repeat(51));
		expect(Either.isLeft(result)).toBe(true);
	});
});

describe("makeCustomerInfo", () => {
	const validCustomerInfo = {
		name: { firstName: "John", lastName: "Doe" },
		emailAddress: "john@example.com",
		vipStatus: "Normal",
	};

	test("accepts valid customer info", () => {
		const result = makeCustomerInfo(validCustomerInfo);
		expect(Either.isRight(result)).toBe(true);
		const info = Either.getOrThrow(result);
		const firstName: string = info.name.firstName;
		const email: string = info.emailAddress;
		expect(firstName).toBe("John");
		expect(email).toBe("john@example.com");
	});

	test("accepts VIP status", () => {
		const result = makeCustomerInfo({
			...validCustomerInfo,
			vipStatus: "VIP",
		});
		expect(Either.isRight(result)).toBe(true);
	});

	test("rejects invalid email", () => {
		const result = makeCustomerInfo({
			...validCustomerInfo,
			emailAddress: "invalid",
		});
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects invalid vipStatus", () => {
		const result = makeCustomerInfo({
			...validCustomerInfo,
			vipStatus: "Gold",
		});
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects missing name", () => {
		const { name, ...noName } = validCustomerInfo;
		const result = makeCustomerInfo(noName);
		expect(Either.isLeft(result)).toBe(true);
	});

	test("rejects empty first name in name", () => {
		const result = makeCustomerInfo({
			...validCustomerInfo,
			name: { firstName: "", lastName: "Doe" },
		});
		expect(Either.isLeft(result)).toBe(true);
	});
});
