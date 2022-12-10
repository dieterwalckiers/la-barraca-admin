import { omit } from "ramda";
import moment from "moment";
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
    ...omit(["_id"], performanceRaw),
    timeString: toTimeString(performanceRaw.timeID),
    date,
    id: performanceRaw._id,
    visitors: JSON.parse(performanceRaw.visitors),
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