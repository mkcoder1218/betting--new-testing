import React from "react";
import GenerateOption from "../utils/GenerateOption";
import moment from "moment";

interface props {
  time: string;
}
const Timer: React.FC<props> = ({ time }) => {
  return (
    <div className="timecontainer">
      <div className="Nextdraw">
        <p>Next Draw</p>
        <p>{time}</p>
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
};

export default Timer;
