import { Schema } from "@effect/schema";
import { Either } from "effect";
import { String50 } from "./common";

// An email address
export const EmailAddress = Schema.String.pipe(
	Schema.pattern(/.+@.+/),
	Schema.brand("EmailAddress"),
);
export type EmailAddress = Schema.Schema.Type<typeof EmailAddress>;

export const makeEmailAddress = (input: string) =>
	Schema.decodeUnknownEither(EmailAddress)(input).pipe(
		Either.mapLeft(() => `Invalid email format`),
	);

// Customer's VIP status
const VipStatus = Schema.Union(Schema.Literal("Normal"), Schema.Literal("VIP"));
export type VipStatus = Schema.Schema.Type<typeof VipStatus>;

export const makeVipStatus = (input: string) => {
	if (input.toLowerCase() === "normal") return Either.right("Normal" as const);
	if (input.toLowerCase() === "vip") return Either.right("VIP" as const);
	return Either.left("Must be one of 'Normal', 'VIP'");
};

// PersonalName
const PersonalName = Schema.Struct({
	firstName: String50,
	lastName: String50,
});
export type PersonalName = Schema.Schema.Type<typeof PersonalName>;

export const makePersonalName = (firstName: string, lastName: string) => {
	return Schema.decodeUnknownEither(PersonalName)({
		firstName,
		lastName,
	}).pipe(
		Either.mapLeft(
			() => `Invalid Personal Name: Both must be < 50 chars and not empty`,
		),
	);
};

// CustomerInfo
const CustomerInfo = Schema.Struct({
	name: PersonalName,
	emailAddress: EmailAddress,
	vipStatus: VipStatus,
});
export type CustomerInfo = Schema.Schema.Type<typeof CustomerInfo>;

export const makeCustomerInfo = (input: unknown) => {
	return Schema.decodeUnknownEither(CustomerInfo)(input).pipe(
		Either.mapLeft((errors) => `Invalid Customer Info: ${errors}`),
	);
};
