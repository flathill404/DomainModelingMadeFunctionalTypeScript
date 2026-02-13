import { Schema } from "@effect/schema";
import { Either } from "effect";
import { String50 } from "./common";

// A zip code
const ZipCode = Schema.String.pipe(
	Schema.pattern(/^\d{5}$/),
	Schema.brand("ZipCode"),
);
export type ZipCode = Schema.Schema.Type<typeof ZipCode>;

export const makeZipCode = (input: string) =>
	Schema.decodeUnknownEither(ZipCode)(input).pipe(
		Either.mapLeft(() => `ZipCode must be 5 digits`),
	);

// A US 2 letter state code
const UsStateCode = Schema.String.pipe(
	Schema.pattern(
		/^(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$/,
	),
	Schema.brand("UsStateCode"),
);
export type UsStateCode = Schema.Schema.Type<typeof UsStateCode>;

export const makeUsStateCode = (input: string) =>
	Schema.decodeUnknownEither(UsStateCode)(input).pipe(
		Either.mapLeft(() => `Invalid US State Code`),
	);

// Address
export const Address = Schema.Struct({
	addressLine1: String50,
	addressLine2: Schema.optional(String50),
	addressLine3: Schema.optional(String50),
	addressLine4: Schema.optional(String50),
	city: String50,
	zipCode: ZipCode,
	state: UsStateCode,
	country: String50,
});
export type Address = Schema.Schema.Type<typeof Address>;

export const makeAddress = (input: unknown) => {
	return Schema.decodeUnknownEither(Address)(input).pipe(
		Either.mapLeft(() => `Invalid Address format`),
	);
};
