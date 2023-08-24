import { omit } from "ramda";
import moment from "moment";

export function normalizeSeason(seasonRaw) {
    return {
        ...seasonRaw,
        key: parseInt(seasonRaw.startYear || 0) + parseInt(seasonRaw.endYear || 0),
        productions: seasonRaw.productions.map(p => normalizeProduction(p)),
    }
}

function normalizeTimePart(timePart) {
    return timePart.length === 1 ? `0${timePart}` : timePart;
}

export function normalizePerformanceCalendar(performanceCalendarStr) {
    const rs = performanceCalendarStr
        ? JSON.parse(performanceCalendarStr)
            .map((performance) => {
                const date = moment(performance.date, "DD-MM-YYYY");
                const time = performance.time
                    .split(":")
                    .map(normalizeTimePart)
                    .join(":");
                return {
                    ...performance,
                    date,
                    time,
                    timeID: `${date.format("YYYYMMDD")}${time.replace(/:/, "")}`,
                }
            })
            .sort(({ date: date1 }, { date: date2 }) => {
                return date1.isBefore(date2) ? -1 : 1;
            })
        : [];
    console.log("normalized", performanceCalendarStr, "to", rs);
    return rs;
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