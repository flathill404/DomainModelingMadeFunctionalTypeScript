import { Schema } from "@effect/schema";
import { Either } from "effect";

// Constrained to be a decimal between 0.0 and 1000.00
export const Price = Schema.Number.pipe(
	Schema.between(0, 1000),
	Schema.brand("Price"),
);
export type Price = Schema.Schema.Type<typeof Price>;

export const makePrice = (input: number) =>
	Schema.decodeUnknownEither(Price)(input).pipe(
		Either.mapLeft(() => `Price must be between 0 and 1000`),
	);

export const multiplyPrice = (
	qty: number,
	price: Price,
): Either.Either<Price, string> => {
	return makePrice(qty * price);
};

// Constrained to be a decimal between 0.0 and 10000.00
export const BillingAmount = Schema.Number.pipe(
	Schema.between(0, 10000),
	Schema.brand("BillingAmount"),
);
export type BillingAmount = Schema.Schema.Type<typeof BillingAmount>;

export const makeBillingAmount = (input: number) =>
	Schema.decodeUnknownEither(BillingAmount)(input).pipe(
		Either.mapLeft(() => `BillingAmount must be between 0 and 10000`),
	);

export const sumPrices = (
	prices: Price[],
): Either.Either<BillingAmount, string> => {
	const total = prices.reduce((sum, current) => sum + current, 0);
	return makeBillingAmount(total);
};

export const PromotionCode = Schema.String.pipe(
	Schema.minLength(3),
	Schema.maxLength(10),
	Schema.brand("PromotionCode"),
);
export type PromotionCode = Schema.Schema.Type<typeof PromotionCode>;

export const makePromotionCode = (input: string) =>
	Schema.decodeUnknownEither(PromotionCode)(input).pipe(
		Either.mapLeft(
			() => `PromotionCode must be between 3 and 10 characters in length`,
		),
	);
