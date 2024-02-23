import * as request from 'superagent';
import getConfig from "./config";
const { performancesEndpoint } = getConfig();

export async function getPerformancesForProduction(googleSheetId) {
    try {
        const response = await request.get(`${performancesEndpoint}/${googleSheetId}`);
        return response.text;
    } catch (error) {
        console.error(error);
    }
}

export async function createPerformance(
    googleSheetId,
    timeID,
    visitors,
) {
    try {
        const response = await request.post(`${performancesEndpoint}`)
            .send({
                googleSheetId,
                timeID,
                visitors,
            });
        return response.text;
    } catch (error) {
        console.error(error);
    }
}

export async function updatePerformance(googleSheetId, timeID, visitors) {
    try {
        const response = await request.put(`${performancesEndpoint}/${googleSheetId}/${timeID}`)
            .send({
                visitors,
            });
        return response.text;
    } catch (error) {
        console.error(error);
    }
}