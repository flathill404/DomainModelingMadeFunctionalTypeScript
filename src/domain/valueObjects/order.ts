import { Schema } from "@effect/schema";
import { Either } from "effect";
import type { ValidationError } from "../../types/errors";
import { createDecorder } from "./utils";

// An Id for Orders. Constrained to be a non-empty string < 10 chars
export const OrderId = Schema.String.pipe(
	Schema.maxLength(10),
	Schema.nonEmptyString(),
	Schema.brand("OrderId"),
);
export type OrderId = Schema.Schema.Type<typeof OrderId>;

export const decodeOrderId = createDecorder(OrderId);

// An Id for OrderLines. Constrained to be a non-empty string < 10 chars
export const OrderLineId = Schema.String.pipe(
	Schema.maxLength(10),
	Schema.nonEmptyString(),
	Schema.brand("OrderLineId"),
);
export type OrderLineId = Schema.Schema.Type<typeof OrderLineId>;

export const decodeOrderLineId = createDecorder(OrderLineId);

// The codes for Widgets start with a "W" and then four digits
const WidgetCode = Schema.String.pipe(
	Schema.pattern(/^W\d{4}$/),
	Schema.brand("WidgetCode"),
);
export type WidgetCode = Schema.Schema.Type<typeof WidgetCode>;

// The codes for Gizmos start with a "G" and then three digits.
const GizmoCode = Schema.String.pipe(
	Schema.pattern(/^G\d{3}$/),
	Schema.brand("GizmoCode"),
);
export type GizmoCode = Schema.Schema.Type<typeof GizmoCode>;

// A ProductCode is either a Widget or a Gizmo
export const ProductCode = Schema.Union(WidgetCode, GizmoCode);
export type ProductCode = Schema.Schema.Type<typeof ProductCode>;

export const decodeProductCode = createDecorder(ProductCode);

// Constrained to be a integer between 1 and 1000
const UnitQuantity = Schema.Number.pipe(
	Schema.int(),
	Schema.between(1, 1000),
	Schema.brand("UnitQuantity"),
);
export type UnitQuantity = Schema.Schema.Type<typeof UnitQuantity>;

export const decodeUnitQuantity = createDecorder(UnitQuantity);

// Constrained to be a decimal between 0.05 and 100.00
const KilogramQuantity = Schema.Number.pipe(
	Schema.between(0.05, 100.0), // TODO: Decimal
	Schema.brand("KilogramQuantity"),
);
export type KilogramQuantity = Schema.Schema.Type<typeof KilogramQuantity>;

export const decodeKilogramQuantity = createDecorder(KilogramQuantity);

// A Quantity is either a Unit or a Kilogram
export const OrderQuantity = Schema.Union(
	Schema.Struct({ _tag: Schema.Literal("Unit"), value: UnitQuantity }),
	Schema.Struct({ _tag: Schema.Literal("Kilogram"), value: KilogramQuantity }),
);
export type OrderQuantity = Schema.Schema.Type<typeof OrderQuantity>;

export const decodeOrderQuantity = (
	productCode: ProductCode,
	quantity: number,
): Either.Either<OrderQuantity, ValidationError> => {
	if (Schema.is(WidgetCode)(productCode)) {
		return decodeUnitQuantity(Math.floor(quantity)).pipe(
			Either.map((q): OrderQuantity => ({ _tag: "Unit", value: q })),
		);
	}
	return decodeKilogramQuantity(quantity).pipe(
		Either.map((q): OrderQuantity => ({ _tag: "Kilogram", value: q })),
	);
};
