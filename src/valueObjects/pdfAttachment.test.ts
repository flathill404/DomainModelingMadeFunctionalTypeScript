import { describe, expect, test } from "bun:test";
import { makePdfAttachment } from "./pdfAttachment.ts";

describe("makePdfAttachment", () => {
	test("creates a PdfAttachment with the given name and bytes", () => {
		const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // %PDF
		const attachment = makePdfAttachment("invoice.pdf", bytes);
		expect(attachment.name).toBe("invoice.pdf");
		expect(attachment.bytes).toEqual(bytes);
	});
});
