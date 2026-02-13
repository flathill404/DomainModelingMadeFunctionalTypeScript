import type { Effect } from "effect";
import type { PlaceOrderError } from "./errors";
import type { PlaceOrderEvent } from "./events";
import type { UnvalidatedOrder } from "./inputs";

export type PlaceOrder = (
	unvalidatedOrder: UnvalidatedOrder,
) => Effect.Effect<PlaceOrderEvent[], PlaceOrderError>;
