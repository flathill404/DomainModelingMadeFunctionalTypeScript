import { describe, expect, test } from "bun:test";
import { Either } from "effect";
import { decodePdfAttachment } from "./pdfAttachment.ts";

describe("decodePdfAttachment", () => {
	test("creates a PdfAttachment with the given name and bytes", () => {
		const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // %PDF
		const result = decodePdfAttachment({ name: "invoice.pdf", bytes });
		expect(Either.isRight(result)).toBe(true);
		const attachment = Either.getOrThrow(result);
		expect(attachment.name).toBe("invoice.pdf");
		expect(attachment.bytes).toEqual(bytes);
	});
});
