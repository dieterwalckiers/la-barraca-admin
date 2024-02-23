
import getConfig from "./config";
import * as request from "superagent";
import { normalizeReaction } from "./helpers";

export function getReactionsForProduction(googleSheetId) {
    return new Promise(async (resolve, reject) => {
        const response = await request
            .get(`${getConfig().performancesEndpoint}/reactions/${googleSheetId}`)
            .on("error", (err) => reject(err));
        if (response.status === 200) {
            const reactionsRaw = JSON.parse(response.text || "[]");
            const reactions = reactionsRaw.map(reactionRaw => normalizeReaction(reactionRaw));
            return resolve(reactions);
        }
        reject(new Error(`Failed to fetch reactions for production ${googleSheetId} - status ${response.status}`));
    });
}