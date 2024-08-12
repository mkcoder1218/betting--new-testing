import React from "react";
import Timer from "./Timer";
import Live from "./Live";
import moment from "moment";

interface TimerTextProp {
  text: string;
  onLive: (val: boolean) => void;
  isActive: boolean;
  isgameActive: boolean;
  pastGame?: boolean;
}
const StartTimer: React.FC<TimerTextProp> = ({
  text,
  onLive,
  isActive = false,
  isgameActive,
  pastGame,
}) => {
  return (
    <div className="StartTime">
      {isgameActive && (
        <Timer
          isLive={onLive}
          _time={text}
          isgameActive={isgameActive}
          isPastGame={pastGame}
        />
      )}
      <p style={{ color: isActive ? "white" : "" }}>
        {moment(text).format("hh:mm")}
      </p>
    </div>
  );
};

export default StartTimer;
