import React from "react";
import Circle from "@mui/icons-material/Circle";
import generatecircle from "./generatecircle";
interface Rows {
  row1: number;
  row2: number;
  row3: number;
  i: number;
}
function fourrowhover(Prop: Rows) {
  return (
    <div className="svg_container">
      <div
        className={`firstrow_circle ${
          Prop.i === 1 || Prop.i === 2 || Prop.i === 3 ? "mt-5" : ""
        } ${Prop.i >= 34 ? "-ml-5" : ""} `}
      >
        {generatecircle(Prop.row1)}
      </div>
      <div className="secondrow_circle">{generatecircle(Prop.row2)}</div>
      <div
        className={`thirdrow_circle ${
          Prop.i === 0 ? "-ml-4 flex flex-col gap-5" : ""
        }`}
      >
        {generatecircle(Prop.row3)}
      </div>
    </div>
  );
}

export default fourrowhover;
