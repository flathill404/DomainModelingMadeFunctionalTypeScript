import { Schema } from "@effect/schema";
import type { Effect } from "effect";
import type { PricingError, ValidationError } from "../types/errors";
import type { PlaceOrderEvent } from "../types/events";
import type { UnvalidatedAddress, UnvalidatedOrder } from "../types/inputs";
import { Address } from "../valueObjects/address";
import { CustomerInfo, EmailAddress } from "../valueObjects/customer";
import {
	OrderId,
	OrderLineId,
	OrderQuantity,
	ProductCode,
} from "../valueObjects/order";
import { BillingAmount, Price, PromotionCode } from "../valueObjects/price";

// Address validation error (internal use)
export type AddressValidationError = "InvalidFormat" | "AddressNotFound";

// CheckedAddress (Wrapper)
export interface CheckedAddress {
	readonly _tag: "CheckedAddress";
	readonly value: UnvalidatedAddress;
}

// PricingMethod
export const PricingMethod = Schema.Union(
	Schema.Literal("Standard"),
	Schema.Struct({
		_tag: Schema.Literal("Promotion"),
		promotionCode: PromotionCode,
	}),
);
export type PricingMethod = Schema.Schema.Type<typeof PricingMethod>;

// ValidatedOrderLine
export const ValidatedOrderLine = Schema.Struct({
	orderLineId: OrderLineId,
	productCode: ProductCode,
	quantity: OrderQuantity,
});
export type ValidatedOrderLine = Schema.Schema.Type<typeof ValidatedOrderLine>;

// ValidatedOrder
export const ValidatedOrder = Schema.Struct({
	orderId: OrderId,
	customerInfo: CustomerInfo,
	shippingAddress: Address,
	billingAddress: Address,
	lines: Schema.Array(ValidatedOrderLine),
	pricingMethod: PricingMethod,
});
export type ValidatedOrder = Schema.Schema.Type<typeof ValidatedOrder>;

// PricedOrderLine
export const PricedOrderProductLine = Schema.Struct({
	orderLineId: OrderLineId,
	productCode: ProductCode,
	quantity: OrderQuantity,
	linePrice: Price,
});
export type PricedOrderProductLine = Schema.Schema.Type<
	typeof PricedOrderProductLine
>;

export const PricedOrderLine = Schema.Union(
	Schema.Struct({
		_tag: Schema.Literal("ProductLine"),
		value: PricedOrderProductLine,
	}),
	Schema.Struct({
		_tag: Schema.Literal("CommentLine"),
		comment: Schema.String,
	}),
);
export type PricedOrderLine = Schema.Schema.Type<typeof PricedOrderLine>;

// PricedOrder
export const PricedOrder = Schema.Struct({
	orderId: OrderId,
	customerInfo: CustomerInfo,
	shippingAddress: Address,
	billingAddress: Address,
	amountToBill: BillingAmount,
	lines: Schema.Array(PricedOrderLine),
	pricingMethod: PricingMethod,
});
export type PricedOrder = Schema.Schema.Type<typeof PricedOrder>;

export const ShippingMethod = Schema.Union(
	Schema.Literal("PostalService"),
	Schema.Literal("Fedex24"),
	Schema.Literal("Fedex48"),
	Schema.Literal("Ups48"),
);
export type ShippingMethod = Schema.Schema.Type<typeof ShippingMethod>;

export const ShippingInfo = Schema.Struct({
	shippingMethod: ShippingMethod,
	shippingCost: Price,
});
export type ShippingInfo = Schema.Schema.Type<typeof ShippingInfo>;

export const PricedOrderWithShippingMethod = Schema.Struct({
	shippingInfo: ShippingInfo,
	pricedOrder: PricedOrder,
});
export type PricedOrderWithShippingMethod = Schema.Schema.Type<
	typeof PricedOrderWithShippingMethod
>;

export const HtmlString = Schema.String.pipe(Schema.brand("HtmlString"));
export type HtmlString = Schema.Schema.Type<typeof HtmlString>;

export const OrderAcknowledgment = Schema.Struct({
	emailAddress: EmailAddress,
	letter: HtmlString,
});
export type OrderAcknowledgment = Schema.Schema.Type<
	typeof OrderAcknowledgment
>;

// Validation Dependencies
export type CheckProductCodeExists = (
	code: ProductCode,
) => Effect.Effect<boolean>;

export type CheckAddressExists = (
	address: UnvalidatedAddress,
) => Effect.Effect<CheckedAddress, AddressValidationError>;

// Pricing Dependencies
export type GetProductPrice = (code: ProductCode) => Effect.Effect<Price>;
export type GetPromotionPrice = (code: ProductCode) => Effect.Effect<Price>;

// Shipping Dependencies
export type CalculateShippingCost = (
	order: PricedOrder,
) => Effect.Effect<Price>;

// Acknowledgment Dependencies
export type CreateOrderAcknowledgmentLetter = (
	order: PricedOrderWithShippingMethod,
) => HtmlString;

export type SendOrderAcknowledgment = (
	ack: OrderAcknowledgment,
) => Effect.Effect<void>;

// Validation Step
export type ValidateOrder = (
	unvalidatedOrder: UnvalidatedOrder,
) => Effect.Effect<
	ValidatedOrder,
	ValidationError,
	CheckProductCodeExists | CheckAddressExists
>;

// Pricing Step
export type PriceOrder = (
	validatedOrder: ValidatedOrder,
) => Effect.Effect<PricedOrder, PricingError, GetProductPrice>;

// Acknowledge Step
export type AcknowledgeOrder = (
	order: PricedOrderWithShippingMethod,
) => Effect.Effect<
	PlaceOrderEvent | null,
	never,
	CreateOrderAcknowledgmentLetter | SendOrderAcknowledgment
>;
