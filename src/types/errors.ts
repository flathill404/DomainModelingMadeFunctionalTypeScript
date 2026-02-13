import { Data } from "effect";

export class ValidationError extends Data.TaggedError("ValidationError")<{
	message: string;
}> {}

export class PricingError extends Data.TaggedError("PricingError")<{
	message: string;
}> {}

export class RemoteServiceError extends Data.TaggedError("RemoteServiceError")<{
	serviceName: string;
	endpoint: string;
	originalError: unknown;
}> {}

export type PlaceOrderError =
	| ValidationError
	| PricingError
	| RemoteServiceError;
