import * as request from 'superagent';
import getConfig from "./config";
const { performancesEndpoint, apiKey } = getConfig();

export async function getPerformancesForProduction(productionKey) {
    try {
        const response = await request
            .get(`${performancesEndpoint}/${productionKey}`)
            .set("X-Api-Key", apiKey);
        return response.text;
    } catch (error) {
        console.error(error);
    }
}

export async function createPerformance(
    productionKey,
    timeID,
    visitors,
) {
    try {
        const response = await request.post(`${performancesEndpoint}`)
            .set("X-Api-Key", apiKey)
            .send({
                productionKey,
                timeID,
                visitors,
            });
        return response.text;
    } catch (error) {
        console.error(error);
    }
}

export async function updatePerformance(productionKey, timeID, visitors) {
    try {
        const response = await request.put(`${performancesEndpoint}/${productionKey}/${timeID}`)
            .set("X-Api-Key", apiKey)
            .send({
                visitors,
            });
        return response.text;
    } catch (error) {
        console.error(error);
    }
}