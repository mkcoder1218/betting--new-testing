import React, { useState, useEffect } from "react";
import moment, { Moment } from "moment";
import Live from "./Live";
interface Time {
  isLive: (val: boolean) => void;
}
const Timer: React.FC<Time> = ({ isLive }) => {
  const initialTime = 0.5 * 60; // Initial time set to 3 seconds
  const [time, setTime] = useState<number>(initialTime); // State to track the countdown
  const [isgetLive, setisLive] = useState(false);
  useEffect(() => {
    const timerId = setInterval(() => {
      setTime((prevTime) => (prevTime === 0 ? initialTime : prevTime - 1));
    }, 1000);
    if (time === 0) {
      setisLive(true);
      isLive(true);
    }
    return () => clearInterval(timerId);
  }, [time, isLive, isgetLive]);
  return (
    <>
      {isgetLive ? (
        <Live />
      ) : (
        <div className="Timer">{moment.utc(time * 1000).format("mm:ss")}</div>
      )}
    </>
  );
};

export default Timer;
