import { Schema } from "@effect/schema";
import { Either } from "effect";

// An Id for Orders. Constrained to be a non-empty string < 10 chars
export const OrderId = Schema.String.pipe(
	Schema.maxLength(10),
	Schema.nonEmptyString(),
	Schema.brand("OrderId"),
);
export type OrderId = Schema.Schema.Type<typeof OrderId>;

export const makeOrderId = (input: string) =>
	Schema.decodeUnknownEither(OrderId)(input).pipe(
		Either.mapLeft(() => `OrderId must be a non-empty string < 10 chars`),
	);

// An Id for OrderLines. Constrained to be a non-empty string < 10 chars
export const OrderLineId = Schema.String.pipe(
	Schema.maxLength(10),
	Schema.nonEmptyString(),
	Schema.brand("OrderLineId"),
);
export type OrderLineId = Schema.Schema.Type<typeof OrderLineId>;

export const makeOrderLineId = (input: string) =>
	Schema.decodeUnknownEither(OrderLineId)(input).pipe(
		Either.mapLeft(() => `OrderLineId must be a non-empty string < 10 chars`),
	);

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

export const makeProductCode = (
	code: string,
): Either.Either<ProductCode, string> => {
	if (!code) return Either.left("Must not be null or empty");

	if (code.startsWith("W")) {
		return Schema.decodeUnknownEither(WidgetCode)(code).pipe(
			Either.mapLeft(() => `Format not recognized '${code}'`),
		);
	}

	if (code.startsWith("G")) {
		return Schema.decodeUnknownEither(GizmoCode)(code).pipe(
			Either.mapLeft(() => `Format not recognized '${code}'`),
		);
	}

	return Either.left(`Format not recognized '${code}'`);
};

// Constrained to be a integer between 1 and 1000
const UnitQuantity = Schema.Number.pipe(
	Schema.int(),
	Schema.between(1, 1000),
	Schema.brand("UnitQuantity"),
);
export type UnitQuantity = Schema.Schema.Type<typeof UnitQuantity>;

// Constrained to be a decimal between 0.05 and 100.00
const KilogramQuantity = Schema.Number.pipe(
	Schema.between(0.05, 100.0), // TODO: Decimal
	Schema.brand("KilogramQuantity"),
);
export type KilogramQuantity = Schema.Schema.Type<typeof KilogramQuantity>;

// A Quantity is either a Unit or a Kilogram
export const OrderQuantity = Schema.Union(
	Schema.Struct({ _tag: Schema.Literal("Unit"), value: UnitQuantity }),
	Schema.Struct({ _tag: Schema.Literal("Kilogram"), value: KilogramQuantity }),
);
export type OrderQuantity = Schema.Schema.Type<typeof OrderQuantity>;

export const makeOrderQuantity = (
	productCode: ProductCode,
	quantity: number,
): Either.Either<OrderQuantity, string> => {
	if (Schema.is(WidgetCode)(productCode)) {
		return Schema.decodeUnknownEither(UnitQuantity)(Math.floor(quantity)).pipe(
			Either.map((q) => ({ _tag: "Unit" as const, value: q })),
			Either.mapLeft((e) => String(e)),
		);
	} else {
		return Schema.decodeUnknownEither(KilogramQuantity)(quantity).pipe(
			Either.map((q) => ({ _tag: "Kilogram" as const, value: q })),
			Either.mapLeft((e) => String(e)),
		);
	}
};
