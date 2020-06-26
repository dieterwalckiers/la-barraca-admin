import React from "react";
import Performance from "./Performance";

const PerformanceSet = (props) => {
  const { performances } = props;
  return performances.map((p) => <Performance key={`perf${p.id}`} performance={p} />);
};

export default PerformanceSet;
