import { Schema } from "@effect/schema";
import { Either } from "effect";

// Constrained to be 50 chars or less, not null
export const String50 = Schema.String.pipe(
	Schema.maxLength(50),
	Schema.nonEmptyString(),
	Schema.brand("String50"),
);
export type String50 = Schema.Schema.Type<typeof String50>;

export const makeString50 = (input: string) =>
	Schema.decodeUnknownEither(String50)(input).pipe(
		Either.mapLeft(() => `String50 must not be null, empty or > 50 chars`),
	);
