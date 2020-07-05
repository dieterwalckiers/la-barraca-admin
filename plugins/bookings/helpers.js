import { omit } from "ramda";
/*
op 2020 04 09 2000
op 202004102000
*/
function toTimeString(timeID) {
  return `
    ${timeID.substring(6, 8)}/${timeID.substring(4, 6)}/${timeID.substring(0, 4)} om ${timeID.substring(8, 10)}:${timeID.slice(10)}
  `;
}

export function normalizePerformance(performanceRaw) {
  return {
    ...omit(["_id", "timeID"], performanceRaw),
    timeString: toTimeString(performanceRaw.timeID),
    id: performanceRaw._id,
    visitors: JSON.parse(performanceRaw.visitors),
  };
}

export function normalizeProduction(productionRaw) {
  return {
    ...omit(["_key"], productionRaw),
    id: productionRaw._key,
  };
}
