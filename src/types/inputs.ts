import { Schema } from "@effect/schema";

export const UnvalidatedCustomerInfo = Schema.Struct({
	firstName: Schema.String,
	lastName: Schema.String,
	emailAddress: Schema.String,
	vipStatus: Schema.String,
});
export type UnvalidatedCustomerInfo = Schema.Schema.Type<
	typeof UnvalidatedCustomerInfo
>;

export const UnvalidatedAddress = Schema.Struct({
	addressLine1: Schema.String,
	addressLine2: Schema.String,
	addressLine3: Schema.String,
	addressLine4: Schema.String,
	city: Schema.String,
	zipCode: Schema.String,
	state: Schema.String,
	country: Schema.String,
});
export type UnvalidatedAddress = Schema.Schema.Type<typeof UnvalidatedAddress>;

export const UnvalidatedOrderLine = Schema.Struct({
	orderLineId: Schema.String,
	productCode: Schema.String,
	quantity: Schema.Number,
});
export type UnvalidatedOrderLine = Schema.Schema.Type<
	typeof UnvalidatedOrderLine
>;

export const UnvalidatedOrder = Schema.Struct({
	orderId: Schema.String,
	customerInfo: UnvalidatedCustomerInfo,
	shippingAddress: UnvalidatedAddress,
	billingAddress: UnvalidatedAddress,
	lines: Schema.Array(UnvalidatedOrderLine),
	promotionCode: Schema.String,
});
export type UnvalidatedOrder = Schema.Schema.Type<typeof UnvalidatedOrder>;
