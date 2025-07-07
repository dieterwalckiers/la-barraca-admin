import * as request from 'superagent';
import getConfig from "./config";
const { performancesEndpoint } = getConfig();

export async function getPerformancesForProduction(googleSheetId) {
    try {
        const response = await request.get(`${performancesEndpoint}/${googleSheetId}`);
        
        // Try to get data from response.body first (auto-parsed JSON)
        let data = response.body;
        
        // If body is not available or not an array, try parsing text
        if (!Array.isArray(data)) {
            try {
                data = JSON.parse(response.text);
            } catch (parseError) {
                data = [];
            }
        }
        
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
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