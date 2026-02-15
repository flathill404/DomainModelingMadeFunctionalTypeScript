import { Schema, TreeFormatter } from "@effect/schema";
import { Either } from "effect";
import { ValidationError } from "../../types/errors";

export const createDecorder = <A, I>(schema: Schema.Schema<A, I>) => {
	const decode = Schema.decodeUnknownEither(schema);

	return (input: unknown): Either.Either<A, ValidationError> => {
		return decode(input).pipe(
			Either.mapLeft((parseError) => {
				const message = TreeFormatter.formatErrorSync(parseError);
				return new ValidationError({ message });
			}),
		);
	};
};
