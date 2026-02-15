import { Schema } from "@effect/schema";
import { createDecorder } from "./utils";

// Represents a PDF attachment
export const PdfAttachment = Schema.Struct({
	name: Schema.String,
	bytes: Schema.Uint8ArrayFromSelf,
});
export type PdfAttachment = Schema.Schema.Type<typeof PdfAttachment>;

export const decodePdfAttachment = createDecorder(PdfAttachment);
