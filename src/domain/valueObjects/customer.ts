import { Schema } from "@effect/schema";
import { String50 } from "./common";
import { createDecorder } from "./utils";

// An email address
export const EmailAddress = Schema.String.pipe(
	Schema.pattern(/.+@.+/),
	Schema.brand("EmailAddress"),
);
export type EmailAddress = Schema.Schema.Type<typeof EmailAddress>;

export const decodeEmailAddress = createDecorder(EmailAddress);

// Customer's VIP status
const VipStatus = Schema.Union(Schema.Literal("Normal"), Schema.Literal("VIP"));
export type VipStatus = Schema.Schema.Type<typeof VipStatus>;

export const decodeVipStatus = createDecorder(VipStatus);

// PersonalName
const PersonalName = Schema.Struct({
	firstName: String50,
	lastName: String50,
});
export type PersonalName = Schema.Schema.Type<typeof PersonalName>;

export const decodePersonalName = createDecorder(PersonalName);

// CustomerInfo
export const CustomerInfo = Schema.Struct({
	name: PersonalName,
	emailAddress: EmailAddress,
	vipStatus: VipStatus,
});
export type CustomerInfo = Schema.Schema.Type<typeof CustomerInfo>;

export const decodeCustomerInfo = createDecorder(CustomerInfo);
