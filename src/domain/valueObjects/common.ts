import { Schema } from "@effect/schema";
import { createDecorder } from "./utils";

// Constrained to be 50 chars or less, not null
export const String50 = Schema.String.pipe(
	Schema.maxLength(50),
	Schema.nonEmptyString(),
	Schema.brand("String50"),
);
export type String50 = Schema.Schema.Type<typeof String50>;

export const decodeString50 = createDecorder(String50);
