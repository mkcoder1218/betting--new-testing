import React from "react";
import generatecircle from "./generatecircle";
function Fourrow() {
  return (
    <div className="svg_Row_container">
      <div className="cirs">{generatecircle(4)}</div>
    </div>
  );
}

export default Fourrow;
