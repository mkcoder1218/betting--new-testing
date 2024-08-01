import React from "react";
import Timer from "./Timer";
import Live from "./Live";
import moment from "moment";

interface TimerTextProp {
  text: string;
  onLive: (val: boolean) => void;
  isActive: boolean;
}
const StartTimer: React.FC<TimerTextProp> = ({
  text,
  onLive,
  isActive = false,
}) => {
  return (
    <div className="StartTime">
      {isActive && <Timer isLive={onLive} _time={text} />}
      <p style={{ color: isActive ? "white" : "" }}>
        {moment(text).format("hh:mm")}
      </p>
    </div>
  );
};

export default StartTimer;
