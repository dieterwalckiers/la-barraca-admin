import { omit } from "ramda";

export function normalizeSeason(seasonRaw) {
    return {
        ...seasonRaw,
        key: parseInt(seasonRaw.startYear || 0) + parseInt(seasonRaw.endYear || 0),
        productions: seasonRaw.productions.map(p => normalizeProduction(p)),
    }
}

function normalizeProduction(productionRaw) {
    const slug = productionRaw.slug?.current;
    return {
        ...omit(["_key"], productionRaw),
        id: productionRaw._key,
        ...(slug ? { slug } : {}),
    };
}

export function byKey(
    { key: key1 },
    { key: key2 }
) {
    return key2 - key1;
}