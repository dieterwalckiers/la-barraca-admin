import React, { useState, useEffect, useCallback, useMemo } from "react";
import Performance from "./Performance";
import styles from "../../shared/ProductionInfoPlugin.css";
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

  const upcomingTimeID = useMemo(() => {
    for (const performance of performanceSet) {
      if (performance.date.isAfter(moment())) {
        return performance.timeID;
      }
    }
    return undefined;
  }, [performanceSet]);

  useEffect(() => {
    if (upcomingTimeID) {
      setExpandedTimeIDs(upcomingTimeID);
    }
  }, [upcomingTimeID]);

  return (
    <div className={styles.document}>
      {production && (
        <label className={styles.performanceSetTitle}>
          {`Reservaties ${production.title}`}
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
