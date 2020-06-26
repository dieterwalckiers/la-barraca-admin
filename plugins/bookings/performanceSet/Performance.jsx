import React from "react";

const Performance = (props) => {
  const { performance } = props;
  const { timeID, visitors } = performance;
  return <li>{`op ${timeID}: ${visitors}`}</li>;
};

export default Performance;
