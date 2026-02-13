import { Schema } from "@effect/schema";

// Represents a PDF attachment
export const PdfAttachment = Schema.Struct({
	name: Schema.String,
	bytes: Schema.Uint8Array,
});
export type PdfAttachment = Schema.Schema.Type<typeof PdfAttachment>;

export const makePdfAttachment = (
	name: string,
	bytes: Uint8Array,
): PdfAttachment => {
	return { name, bytes };
};
