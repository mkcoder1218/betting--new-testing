import React, { useState, useEffect, useRef } from "react";
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
  const timerIdRef = useRef(null); // Ref to hold the interval ID

  useEffect(() => {
    // Set initial countdown time based on _time
    const initialTime = moment(_time).diff(moment(), "seconds");
    setTime(initialTime > 0 ? initialTime : 0);

    // Clear any existing interval before setting a new one
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
    }

    // Set up a new interval to countdown and check live status
    timerIdRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timerIdRef.current);
          timerIdRef.current = null;
          return 0;
        }
        return prevTime - 1;
      });

      // Check if the event should be marked as live
      if (moment(_time).diff(moment(), "seconds") < 1 && !isLive) {
        setIsLive(true);
        isbecomeLive(true);
        clearInterval(timerIdRef.current); // Clear interval when event goes live
        timerIdRef.current = null;
      }
    }, 1000);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, [_time, isbecomeLive]);
  return (
    <>
      <div className="Timer">{moment(time * 1000).format("mm:ss")}</div>
    </>
  );
};

export default Timer;
