import React, { useCallback } from "react";
import Performance from "./Performance";
import styles from "../Bookings.css";

const PerformanceSet = (props) => {
  const { performanceSet, onUpdateVisitors } = props;

  return (
    <div className={styles.performanceSet}>
      {performanceSet.map((p) => (
        <Performance key={`perf${p.id}`} performance={p} onUpdateVisitors={onUpdateVisitors} />
      ))}
    </div>
  );
};

export default PerformanceSet;
