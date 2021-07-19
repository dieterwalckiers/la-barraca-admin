import { omit } from "ramda";

export function normalizeProduction(productionRaw) {
    return {
        ...omit(["_key"], productionRaw),
        id: productionRaw._key,
    };
}
