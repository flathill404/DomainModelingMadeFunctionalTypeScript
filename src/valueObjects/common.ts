import { Schema } from "@effect/schema";
import { Either } from "effect";

// Constrained to be 50 chars or less, not null
const String50 = Schema.String.pipe(
	Schema.maxLength(50),
	Schema.nonEmptyString(),
	Schema.brand("String50"),
);
export type String50 = Schema.Schema.Type<typeof String50>;

export const makeString50 = (input: string) =>
	Schema.decodeUnknownEither(String50)(input).pipe(
		Either.mapLeft(() => `String50 must not be null, empty or > 50 chars`),
	);

// An email address
const EmailAddress = Schema.String.pipe(
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
