import React, { useState, useEffect, useRef, memo } from "react";
import moment from "moment";

interface Time {
  isLive: boolean;
  _time: string;
  isgameActive: boolean;
  isPastGame?: boolean;
  isbecomeLive?: (val: boolean) => void;
  onTimerEnd?: () => void; // Add callback for when timer reaches 0
}

const Timer: React.FC<Time> = ({ _time, isbecomeLive, onTimerEnd }) => {
  const [time, setTime] = useState<number>(
    moment(_time).diff(moment(), "seconds")
  ); // State to track the countdown
  const [isLive, setIsLive] = useState(false);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null); // Ref to hold the interval ID

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
          if (timerIdRef.current) {
            clearInterval(timerIdRef.current);
            timerIdRef.current = null;
          }
          // Call onTimerEnd when timer reaches 0 to trigger new game fetch
          if (onTimerEnd) {
            onTimerEnd();
          }
          return 0;
        }
        return prevTime - 1;
      });

      // Check if the event should be marked as live
      if (moment(_time).diff(moment(), "seconds") < 1 && !isLive) {
        setIsLive(true);
        if(isbecomeLive)
        isbecomeLive(true);
        if (timerIdRef.current) {
          clearInterval(timerIdRef.current); // Clear interval when event goes live
          timerIdRef.current = null;
        }
        // Also call onTimerEnd when game goes live to ensure new games are fetched
        if (onTimerEnd) {
          onTimerEnd();
        }
      }
    }, 1000);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, [_time, isbecomeLive, onTimerEnd]);
  return (
    <>
      <div className="Timer">{moment(time * 1000).format("mm:ss")}</div>
    </>
  );
};

export default memo(Timer);
