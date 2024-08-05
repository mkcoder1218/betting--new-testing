import React, { useState, useEffect } from "react";
import moment, { Moment } from "moment";
import Live from "./Live";
interface Time {
  isLive: (val: boolean) => void;
  _time: string;
  isgameActive?: boolean;
}
const Timer: React.FC<Time> = ({ isLive, _time, isgameActive }) => {
  const initialTime = 0.5 * 60; // Initial time set to 3 seconds
  const [time, setTime] = useState<number>(
    moment(_time).diff(moment(), "seconds")
  ); // State to track the countdown
  const [isgetLive, setisLive] = useState(false);
  const [currentGame, setCurrentGame] = useState(false);
  useEffect(() => {
    const timerId = setInterval(() => {
      setTime((prevTime) => (prevTime === 0 ? initialTime : prevTime - 1));
    }, 1000);

    if (moment(_time).diff(moment(), "seconds") < 0) {
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
        <div className="Timer">{moment(time * 1000).format("mm:ss")}</div>
      )}
    </>
  );
};

export default Timer;
