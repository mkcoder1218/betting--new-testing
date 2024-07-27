import React from "react";
import Timer from "./Timer";
import Live from "./Live";

interface TimerTextProp {
  text: string;
  onLive: (val: boolean) => void;
}
const StartTimer: React.FC<TimerTextProp> = ({ text, onLive }) => {
  return (
    <div className="StartTime">
      <Timer isLive={onLive} />

      <p>{text}</p>
    </div>
  );
};

export default StartTimer;
