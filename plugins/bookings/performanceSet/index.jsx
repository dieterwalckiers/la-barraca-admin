import React, { useCallback } from "react";
import Performance from "./Performance";
import styles from "../../shared/ProductionInfoPlugin.css"

const PerformanceSet = (props) => {
  const { production, performanceSet, onUpdateVisitors } = props;

  return (
    <div className={styles.document}>
      {performanceSet.map((p) => (
        <Performance production={production} key={`perf${p.id}`} performance={p} onUpdateVisitors={onUpdateVisitors} />
      ))}
    </div>
  );
};

export default PerformanceSet;
