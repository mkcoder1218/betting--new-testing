import React, { useState, useEffect } from "react";
import moment from "moment";
import Live from "./Live";
import { useAppSelector } from "../features/hooks";

interface Time {
  isLive: boolean;
  _time: string;
  isgameActive: boolean;
  isPastGame?: boolean;
  isbecomeLive?: (val: boolean) => void;
}

const Timer: React.FC<Time> = ({ _time, isPastGame, isbecomeLive }) => {
  const initialTime = 0.5 * 60; // Initial time set to 30 seconds
  const [time, setTime] = useState<number>(
    moment(_time).diff(moment(), "seconds")
  ); // State to track the countdown
  const [isLive, setIsLive] = useState(false);
  const livegame = useAppSelector((state) => state.gameType.isLive);
  useEffect(() => {
    // Update the countdown every second
    const timerId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timerId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    // Check if the event is live
    const checkTime = () => {
      if (moment(_time).diff(moment(), "seconds") < 1) {
        setIsLive(true);
        isbecomeLive(true);
      }
    };
    const checkLiveInterval = setInterval(checkTime, 1000);
    return () => {
      clearInterval(timerId);
      clearInterval(checkLiveInterval);
    };
  }, [_time, isbecomeLive]);

  return (
    <>
      <div className="Timer">{moment(time * 1000).format("mm:ss")}</div>
    </>
  );
};

export default Timer;
