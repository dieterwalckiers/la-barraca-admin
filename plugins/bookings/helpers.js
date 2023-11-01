import { omit } from "ramda";
import moment from "moment";
import { normalizePerformanceCalendar } from "../shared/helpers";
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

  const { timeID } = performanceRaw;

  const dateStr = timeID.substring(0, 8);
  const date = moment(dateStr, "YYYYMMDD");

  return {
    ...performanceRaw,
    timeString: toTimeString(performanceRaw.timeID),
    date,
  };
}

export function countVisitors(performanceSet) {
  return performanceSet.reduce((acc, performance) => {
    const { visitors } = performance;
    return acc + visitors.reduce(
      (acc2, visitor) => acc2 +
        (visitor.quantity ? parseInt(`${visitor.quantity}`) : 0) +
        (visitor.studentQuantity ? parseInt(`${visitor.studentQuantity}`) : 0),
      0
    );
  }, 0);
}

export function buildPerformanceSet(
  productionID,
  performanceCalendarStr = undefined, // These are the defined performances in the production
  productionPerformances = [], // These are the performances that have been booked
) {
  const performanceCalendar = normalizePerformanceCalendar(performanceCalendarStr);

  for (const performanceDefinedInProd of performanceCalendar) {
    const { timeID } = performanceDefinedInProd;
    const performanceMatch = productionPerformances.find((p) => p.timeID === timeID);
    if (!performanceMatch) {
      productionPerformances.push({
        date: performanceDefinedInProd.date,
        productionID,
        timeID: performanceDefinedInProd.timeID,
        timeString: toTimeString(performanceDefinedInProd.timeID),
        visitors: [],
      });
    }
  }

  return productionPerformances.sort(({ date: date1 }, { date: date2 }) => date1.isBefore(date2) ? -1 : 1);
}