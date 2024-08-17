import React, { useState } from "react";
import Timer from "./Timer";
import Live from "./Live";
import moment from "moment";

interface TimerTextProp {
  text: string;
  onLive: (val: boolean) => void;
  isActive: boolean;
  isgameActive: boolean;
  isPastGame?: boolean;
}
const StartTimer: React.FC<TimerTextProp> = ({
  text,
  onLive,
  isActive = false,
  isgameActive,
  isPastGame,
}) => {
  const [isgameLive, setisLive] = useState(false);
  const handleLive = (val: boolean) => {
    setisLive(val);
  };
  return (
    <div className="StartTime">
      {isPastGame ? (
        <Live />
      ) : (
        isgameActive && (
          <Timer
            isLive={onLive}
            _time={text}
            isgameActive={isgameActive}
            isPastGame={isPastGame}
            isbecomeLive={handleLive}
          />
        )
      )}
      <p style={{ color: isActive || isPastGame ? "white" : "" }}>
        {moment(text).format("hh:mm")}
      </p>
    </div>
  );
};

export default StartTimer;
