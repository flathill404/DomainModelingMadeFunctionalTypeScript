import { Schema } from "@effect/schema";
import { createDecorder } from "./utils";

// Constrained to be a decimal between 0.0 and 1000.00
export const Price = Schema.Number.pipe(
	Schema.between(0, 1000),
	Schema.brand("Price"),
);
export type Price = Schema.Schema.Type<typeof Price>;

export const decodePrice = createDecorder(Price);

export const multiplyPrice = (qty: number, price: Price) =>
	decodePrice(qty * price);

// Constrained to be a decimal between 0.0 and 10000.00
export const BillingAmount = Schema.Number.pipe(
	Schema.between(0, 10000),
	Schema.brand("BillingAmount"),
);
export type BillingAmount = Schema.Schema.Type<typeof BillingAmount>;

export const decodeBillingAmount = createDecorder(BillingAmount);

export const sumPrices = (prices: Price[]) => {
	const total = prices.reduce((sum, current) => sum + current, 0);
	return decodeBillingAmount(total);
};

export const PromotionCode = Schema.String.pipe(
	Schema.minLength(3),
	Schema.maxLength(10),
	Schema.brand("PromotionCode"),
);
export type PromotionCode = Schema.Schema.Type<typeof PromotionCode>;

export const decodePromotionCode = createDecorder(PromotionCode);
