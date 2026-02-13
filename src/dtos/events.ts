import { Schema } from "@effect/schema";
import type {
	BillableOrderPlaced,
	OrderAcknowledgmentSent,
	PlaceOrderEvent,
	ShippableOrderPlaced,
} from "../types/events";
import type { Address } from "../valueObjects/address";
import { PdfAttachment } from "../valueObjects/pdfAttachment";

// ShippableOrderPlaced Event DTO
export const ShippableOrderLineDto = Schema.Struct({
	productCode: Schema.String,
	quantity: Schema.Number,
});

export const AddressDto = Schema.Struct({
	addressLine1: Schema.String,
	addressLine2: Schema.NullOr(Schema.String),
	addressLine3: Schema.NullOr(Schema.String),
	addressLine4: Schema.NullOr(Schema.String),
	city: Schema.String,
	zipCode: Schema.String,
	state: Schema.String,
	country: Schema.String,
});
export type AddressDto = Schema.Schema.Type<typeof AddressDto>;

export const fromAddressDomain = (domain: Address): AddressDto => {
	return {
		addressLine1: domain.addressLine1,
		addressLine2: domain.addressLine2 ?? null,
		addressLine3: domain.addressLine3 ?? null,
		addressLine4: domain.addressLine4 ?? null,
		city: domain.city,
		zipCode: domain.zipCode,
		state: domain.state,
		country: domain.country,
	};
};

export const ShippableOrderPlacedDto = Schema.Struct({
	orderId: Schema.String,
	shippingAddress: AddressDto,
	shipmentLines: Schema.Array(ShippableOrderLineDto),
	pdf: PdfAttachment,
});

export const fromShippableOrderPlaced = (
	domain: ShippableOrderPlaced,
): Schema.Schema.Type<typeof ShippableOrderPlacedDto> => {
	return {
		orderId: domain.orderId,
		shippingAddress: fromAddressDomain(domain.shippingAddress),
		shipmentLines: domain.shipmentLines.map((line) => ({
			productCode: line.productCode,
			quantity: line.quantity.value,
		})),
		pdf: domain.pdf,
	};
};

// BillableOrderPlaced Event DTO
export const BillableOrderPlacedDto = Schema.Struct({
	orderId: Schema.String,
	billingAddress: AddressDto,
	amountToBill: Schema.Number,
});

export const fromBillableOrderPlaced = (
	domain: BillableOrderPlaced,
): Schema.Schema.Type<typeof BillableOrderPlacedDto> => {
	return {
		orderId: domain.orderId,
		billingAddress: fromAddressDomain(domain.billingAddress),
		amountToBill: domain.amountToBill,
	};
};

// OrderAcknowledgmentSent Event DTO
export const OrderAcknowledgmentSentDto = Schema.Struct({
	orderId: Schema.String,
	emailAddress: Schema.String,
});

export const fromOrderAcknowledgmentSent = (
	domain: OrderAcknowledgmentSent,
): Schema.Schema.Type<typeof OrderAcknowledgmentSentDto> => {
	return {
		orderId: domain.orderId,
		emailAddress: domain.emailAddress,
	};
};

// PlaceOrderEvent DTO (The Wrapper)
export type PlaceOrderEventDto =
	| { ShippableOrderPlaced: Schema.Schema.Type<typeof ShippableOrderPlacedDto> }
	| { BillableOrderPlaced: Schema.Schema.Type<typeof BillableOrderPlacedDto> }
	| {
			OrderAcknowledgmentSent: Schema.Schema.Type<
				typeof OrderAcknowledgmentSentDto
			>;
	  };

export const fromPlaceOrderEvent = (
	domain: PlaceOrderEvent,
): PlaceOrderEventDto => {
	switch (domain._tag) {
		case "ShippableOrderPlaced":
			return { ShippableOrderPlaced: fromShippableOrderPlaced(domain) };
		case "BillableOrderPlaced":
			return { BillableOrderPlaced: fromBillableOrderPlaced(domain) };
		case "OrderAcknowledgmentSent":
			return { OrderAcknowledgmentSent: fromOrderAcknowledgmentSent(domain) };
	}
};
