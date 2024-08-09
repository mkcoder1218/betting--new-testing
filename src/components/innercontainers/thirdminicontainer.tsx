import React, { useEffect, useState } from "react";
import generatehover, { disablehover } from "../../utils/generatehover";
import Circle from "../svg/circle";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { addToBetSlip } from "../../features/slices/pickerSlice";
import { MapRedAndBlack } from "../../utils/redblackMap";
import { setIsClearCircle } from "../../features/slices/gameType";
type CircleState = {
  first12: boolean;
  second12: boolean;
  third12: boolean;
  forth: boolean;
  fifth: boolean;
  sixth: boolean;
};
interface FirstMiniProp {
  gameId?: any;
}
function Thirdminicontainer(prop: FirstMiniProp) {
  const dispatch = useAppDispatch();
  const isCircle = useAppSelector((state) => state.gameType.isClearCircle);
  const [circleState, setCircleState] = useState<CircleState>({
    first12: false,
    second12: false,
    third12: false,
    forth: false,
    fifth: false,
    sixth: false,
  });

  const [background, setbackground] = useState<CircleState>({
    first12: false,
    second12: false,
    third12: false,
    forth: false,
    fifth: false,
    sixth: false,
  });
  function range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => i + start);
  }
  useEffect(() => {
    if (isCircle) {
      setCircleState({
        first12: false,
        second12: false,
        third12: false,
        forth: false,
        fifth: false,
        sixth: false,
      });
      setbackground({
        first12: false,
        second12: false,
        third12: false,
        forth: false,
        fifth: false,
        sixth: false,
      });
    }
  }, [isCircle]);
  const handleCircleClick = (
    area: keyof CircleState,
    stake: number,
    Multiplier: number,
    selected: number[],
    stakeInfo: string,
    oddType: string
  ) => {
    dispatch(setIsClearCircle(false));
    setCircleState((prevState) => ({
      ...prevState,
      [area]: !prevState[area],
    }));
    setbackground((prevState) => ({
      ...prevState,
      [area]: !prevState[area],
    }));
    dispatch(
      addToBetSlip({
        selected: selected,
        stakeInformation: stakeInfo,
        multiplier: Multiplier,
        gameId: prop.gameId,
        stake: stake,
        oddType: oddType,
        gameType: "SpinAndWin",
      })
    );
  };
  function generateEvenAndOddArrays(start: number, end: number) {
    const evens: number[] = [];
    const odds: number[] = [];

    for (let i = start; i <= end; i++) {
      if (i % 2 === 0) {
        evens.push(i);
      } else {
        odds.push(i);
      }
    }

    return { evens, odds };
  }
  const { evens, odds } = generateEvenAndOddArrays(1, 36);
  return (
    <div className="thrmini_container">
      <div className={`childmini childmini2 first_twel`}>
        <p
          className={`relative ${
            background.first12 && !isCircle ? "greenClick" : ""
          }`}
          onClick={() => {
            handleCircleClick(
              "first12",
              10,
              10,
              range(1, 18),
              "High/low",
              "High/low1"
            );
          }}
          onMouseEnter={() => generatehover(".oneto18")}
          onMouseLeave={() => disablehover(".oneto18")}
        >
          1-18 {circleState.first12 && <Circle />}
        </p>
        <p
          className={`relative ${
            background.second12 && !isCircle ? "greenClick" : ""
          }`}
          onClick={() => {
            handleCircleClick(
              "second12",
              10,
              10,
              evens,
              "Even/odd",
              "Even/odd1"
            );
          }}
        >
          Even {circleState.second12 && <Circle />}
        </p>
        <p
          onClick={() => {
            handleCircleClick(
              "third12",
              10,
              10,
              MapRedAndBlack.Red,
              "Color",
              "Color1"
            );
          }}
          className="Red relative"
        >
          Red {circleState.third12 && <Circle />}
        </p>
        <p
          onClick={() => {
            handleCircleClick(
              "forth",
              10,
              10,
              MapRedAndBlack.Black,
              "Color",
              "Color2"
            );
          }}
          className="black relative"
        >
          Black {circleState.forth && <Circle />}
        </p>
        <p
          onClick={() => {
            handleCircleClick("fifth", 10, 10, odds, "Even/odd", "Even/odd2");
          }}
          className={`relative ${
            background.fifth && !isCircle ? "greenClick" : ""
          }`}
        >
          odd {circleState.fifth && <Circle />}
        </p>
        <p
          onClick={() => {
            handleCircleClick(
              "sixth",
              10,
              10,
              range(19, 36),
              "High/low",
              "High/low2"
            );
          }}
          onMouseEnter={() => generatehover(".after18")}
          onMouseLeave={() => disablehover(".after18")}
          className={`relative ${
            background.sixth && !isCircle ? "greenClick" : ""
          }`}
        >
          19-36 {circleState.sixth && <Circle />}
        </p>
      </div>
    </div>
  );
}

export default Thirdminicontainer;
