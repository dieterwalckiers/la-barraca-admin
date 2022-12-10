import React, { useState, useEffect, useCallback, useMemo } from "react";
import Performance from "./Performance";
import styles from "../../shared/ProductionInfoPlugin.css";
import { countVisitors } from "../helpers";
import moment from "moment";

const PerformanceSet = (props) => {
  const { production, performanceSet, onUpdateVisitors } = props;

  const [expandedTimeIDs, setExpandedTimeIDs] = useState([]);
  const toggleExpandedTimeID = useCallback((timeID) => {
    let updExpandedTimeIDs = [...expandedTimeIDs];
    if (expandedTimeIDs.includes(timeID)) {
      updExpandedTimeIDs = updExpandedTimeIDs.filter(id => id !== timeID);
    } else {
      updExpandedTimeIDs.push(timeID);
    }
    setExpandedTimeIDs(updExpandedTimeIDs);
  }, [expandedTimeIDs]);

  const upcomingTimeIDs = useMemo(() => {
    return performanceSet.filter(performance => performance.date.isSameOrAfter(moment().startOf("day"))).map(p => p.timeID);
  }, [performanceSet]);

  useEffect(() => {
    if (upcomingTimeIDs) {
      setExpandedTimeIDs(upcomingTimeIDs);
    }
  }, [upcomingTimeIDs]);

  const totalVisitorsStr = useMemo(() => {
    const total = countVisitors(performanceSet);
    return total ? ` (totaal: ${total})` : "";
  }, [performanceSet]);

  return (
    <div className={styles.document}>
      {production && (
        <label className={styles.performanceSetTitle}>
          {`Reservaties ${production.title}${totalVisitorsStr}`}
        </label>
      )}
      {performanceSet.map((p) => (
        <Performance
          production={production}
          key={`perf${p.id}`}
          performance={p}
          onUpdateVisitors={onUpdateVisitors}
          expandedTimeIDs={expandedTimeIDs}
          toggleExpandedTimeID={toggleExpandedTimeID}
        />
      ))}
    </div>
  );
};

export default PerformanceSet;
