import * as request from 'superagent';
import getConfig from "./config";
const { performancesEndpoint } = getConfig();

export async function getPerformancesForProduction(productionSlug) {
    try {
        const response = await request.get(`${performancesEndpoint}/${productionSlug}`);
        return response.text;
    } catch (error) {
        console.error(error);
    }
}

export async function createPerformance(
    productionID,
    productionName,
    productionSlug,
    timeID,
    visitors,
) {
    try {
        const response = await request.post(`${performancesEndpoint}`)
            .send({
                productionID,
                productionName,
                productionSlug,
                timeID,
                visitors,
            });
        return response.text;
    } catch (error) {
        console.error(error);
    }
}

export async function updatePerformance(productionSlug, timeID, visitors) {
    try {
        const response = await request.put(`${performancesEndpoint}/${productionSlug}/${timeID}`)
            .send({
                visitors,
            });
        return response.text;
    } catch (error) {
        console.error(error);
    }
}