import * as request from 'superagent';
import getConfig from "./config";
const { performancesEndpoint } = getConfig();

export async function getPerformancesForProduction(productionKey) {
    try {
        const response = await request.get(`${performancesEndpoint}/${productionKey}`);
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
            .send({
                visitors,
            });
        return response.text;
    } catch (error) {
        console.error(error);
    }
}