import { omit } from "ramda";

export function normalizeReaction(reactionRaw) {
    return {
        ...omit(["_key"], reactionRaw),
        id: reactionRaw._key,
        score: `${reactionRaw.score}` === "-1" ? undefined : reactionRaw.score,
    };
}