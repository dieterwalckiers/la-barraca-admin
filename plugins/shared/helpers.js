import { omit } from "ramda";

export function normalizeSeason(seasonRaw) {
    return {
        ...seasonRaw,
        key: parseInt(seasonRaw.startYear || 0) + parseInt(seasonRaw.endYear || 0),
        productions: seasonRaw.productions.map(p => normalizeProduction(p)),
    }
}

function normalizeProduction(productionRaw) {
    return {
        ...omit(["_key"], productionRaw),
        id: productionRaw._key,
        slug: productionRaw.slug.current,
    };
}

export function byKey(
    { key: key1 },
    { key: key2 }
) {
    return key2 - key1;
}