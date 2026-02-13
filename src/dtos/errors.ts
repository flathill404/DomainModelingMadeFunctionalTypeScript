import { Schema } from "@effect/schema";
import type { PlaceOrderError } from "../types/errors";

export const PlaceOrderErrorDto = Schema.Struct({
	code: Schema.String,
	message: Schema.String,
});
export type PlaceOrderErrorDto = Schema.Schema.Type<typeof PlaceOrderErrorDto>;

export const fromPlaceOrderError = (
	error: PlaceOrderError,
): PlaceOrderErrorDto => {
	switch (error._tag) {
		case "ValidationError":
			return { code: "ValidationError", message: error.message };
		case "PricingError":
			return { code: "PricingError", message: error.message };
		case "RemoteServiceError":
			return {
				code: "RemoteServiceError",
				message: `${error.serviceName}: ${error.originalError}`,
			};
	}
};
