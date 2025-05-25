import React from 'react'
import CircleIcon from '@mui/icons-material/Circle';

interface circleProp {
  margin?: boolean;
  pad?: boolean;
}
function circle(prop: circleProp) {
  return (
    <>
      <div
        className={`circleIcon ${prop.margin ? "-ml-2 mt-2" : ""} ${
          prop.pad ? "-ml-10 -mt-5" : ""
        }`}
      >
        <CircleIcon
          className={` ${prop.margin ? "bigFont pt-1.5 pr-2" : ""} ${
            prop.pad ? "" : "relative "
          }`}
          style={{ fontSize: "24px" }}
        />
        <div className={`dash ${prop.pad ? "dash2" : ""}`}></div>
      </div>
    </>
  );
}

export default circle
