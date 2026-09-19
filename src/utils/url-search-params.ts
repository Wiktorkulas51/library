/**
 * Returns the query value only when it belongs to the allowed list.
 */
export function pickSearchParam<T extends string>(
	params: URLSearchParams,
	key: string,
	allowed: readonly T[],
	fallback: T,
): T {
	const v = params.get(key);
	return (allowed as readonly string[]).includes(v || '') ? (v as T) : fallback;
}
