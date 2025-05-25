import React, { useState, memo } from "react";
import Timer from "./Timer";
import Live from "./Live";
import moment from "moment";

interface TimerTextProp {
  text: string;
  onLive: (val: boolean) => void;
  isActive: boolean;
  isgameActive: boolean;
  isPastGame?: boolean;
  onTimerEnd?: () => void; // Add callback for when timer reaches 0
}
const StartTimer: React.FC<TimerTextProp> = ({
  text,
  onLive,
  isActive = false,
  isgameActive,
  isPastGame,
  onTimerEnd,
}) => {
  const [isgameLive, setisLive] = useState(false);
  const handleLive = (val: boolean) => {
    setisLive(val);
    onLive(val);
  };
  return (
    <div className="StartTime">
      {isPastGame ? (
        <Live />
      ) : (
        isgameActive && (
          <Timer
            isLive={isgameLive}
            _time={text}
            isgameActive={isgameActive}
            isPastGame={isPastGame}
            isbecomeLive={handleLive}
            onTimerEnd={onTimerEnd}
          />
        )
      )}
      <p style={{ color: isActive || isPastGame ? "white" : "" }}>
        {moment(text).format("hh:mm")}
      </p>
    </div>
  );
};

export default memo(StartTimer);
