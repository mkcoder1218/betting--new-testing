import React from "react";
import GenerateOption from "../utils/GenerateOption";
function Timer() {
  return (
    <div className="timecontainer">
      <div className="Nextdraw">
        <p>Next Draw</p>
        <p>00:00</p>
      </div>
      <div className="Repeat">
        <p>Repeat</p>
        <select name="" id="">
          {GenerateOption("option", 1, 10, "", () => {
            console.log("");
          })}
        </select>
      </div>
    </div>
  );
}

export default Timer;
