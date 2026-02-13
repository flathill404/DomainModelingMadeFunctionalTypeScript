import { Schema } from "@effect/schema";
import { Address } from "../valueObjects/address";
import { EmailAddress } from "../valueObjects/customer";
import { OrderId, OrderQuantity, ProductCode } from "../valueObjects/order";
import { PdfAttachment } from "../valueObjects/pdfAttachment";
import { BillingAmount } from "../valueObjects/price";

export const OrderAcknowledgmentSent = Schema.Struct({
	_tag: Schema.Literal("OrderAcknowledgmentSent"),
	orderId: OrderId,
	emailAddress: EmailAddress,
});
export type OrderAcknowledgmentSent = Schema.Schema.Type<
	typeof OrderAcknowledgmentSent
>;

export const ShippableOrderLine = Schema.Struct({
	productCode: ProductCode,
	quantity: OrderQuantity,
});
export type ShippableOrderLine = Schema.Schema.Type<typeof ShippableOrderLine>;

export const ShippableOrderPlaced = Schema.Struct({
	_tag: Schema.Literal("ShippableOrderPlaced"),
	orderId: OrderId,
	shippingAddress: Address,
	shipmentLines: Schema.Array(ShippableOrderLine),
	pdf: PdfAttachment,
});
export type ShippableOrderPlaced = Schema.Schema.Type<
	typeof ShippableOrderPlaced
>;

export const BillableOrderPlaced = Schema.Struct({
	_tag: Schema.Literal("BillableOrderPlaced"),
	orderId: OrderId,
	billingAddress: Address,
	amountToBill: BillingAmount,
});
export type BillableOrderPlaced = Schema.Schema.Type<
	typeof BillableOrderPlaced
>;

export const PlaceOrderEvent = Schema.Union(
	ShippableOrderPlaced,
	BillableOrderPlaced,
	OrderAcknowledgmentSent,
);
export type PlaceOrderEvent = Schema.Schema.Type<typeof PlaceOrderEvent>;
