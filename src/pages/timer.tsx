import React, { memo } from "react";
import GenerateOption from "../utils/GenerateOption";
import moment from "moment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface props {
  time: string;
  gameID?: number;
}
const Timer: React.FC<props> = ({ time, gameID }) => {
  return (
    <div className="timecontainer">
      <div className="Nextdraw">
        <p>Next Draw</p>
        <p>{time}</p>
      </div>
      <div className="Repeat">
        <p>Repeat</p>
        <div className="select-wrapper">
          <select name="" id="" aria-label="Repeat count" defaultValue={1}>
            {GenerateOption("option", 1, 10, "", gameID?.toString(), () => {}, () => {})}
          </select>
          <KeyboardArrowDownIcon className="select-arrow" />
        </div>
      </div>
    </div>
  );
};

export default memo(Timer);
