import React, { useState } from "react";
import generatehover, { disablehover } from "../../utils/generatehover";
import { addToBetSlip } from "../../features/slices/pickerSlice";
import { useAppDispatch } from "../../features/hooks";
interface FirstMiniProp {
  gameId?: any;
}
type CircleState = {
  first12: boolean;
  second12: boolean;
  third12: boolean;
  forth: boolean;
  fifth: boolean;
  sixth: boolean;
};
function forthmini(prop: FirstMiniProp) {
  const dispatch = useAppDispatch();
  const [circleState, setCircleState] = useState<CircleState>({
    first12: false,
    second12: false,
    third12: false,
    forth: false,
    fifth: false,
    sixth: false,
  });
  const handleCircleClick = (
    area: keyof CircleState,
    stake: number,
    Multiplier: number,
    selected: string,
    stakeInfo: string
  ) => {
    setCircleState((prevState) => ({
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
      })
    );
  };
  return (
    <div className="forthmini_container">
      <div className="childmini childmini3">
        <p
          className="orange"
          onMouseEnter={() => generatehover(".orangenumber")}
          onMouseLeave={() => disablehover(".orangenumber")}
          onClick={() => {
            handleCircleClick(
              "first12",
              10,
              10,
              "32/15/19/4/21/2",
              "Selector(color)"
            );
          }}
        >
          32/15/19/4/21/2
        </p>
        <p
          className="blue"
          onMouseEnter={() => generatehover(".bluenumber")}
          onMouseLeave={() => disablehover(".bluenumber")}
          onClick={() => {
            handleCircleClick(
              "second12",
              10,
              10,
              " 25/17/34/6/27/13",
              "Selector(color)"
            );
          }}
        >
          25/17/34/6/27/13
        </p>
        <p
          className="rose"
          onMouseEnter={() => generatehover(".rosenumber")}
          onMouseLeave={() => disablehover(".rosenumber")}
          onClick={() => {
            handleCircleClick(
              "third12",
              10,
              10,
              "36/11/30/8/23/10",
              "Selector(color)"
            );
          }}
        >
          36/11/30/8/23/10
        </p>
        <p
          className="lightgreen"
          onMouseEnter={() => generatehover(".greennumber")}
          onMouseLeave={() => disablehover(".greennumber")}
          onClick={() => {
            handleCircleClick(
              "forth",
              10,
              10,
              "5/24/16/33/1/20",
              "Selector(color)"
            );
          }}
        >
          5/24/16/33/1/20
        </p>
        <p
          className="yellow"
          onMouseEnter={() => generatehover(".yellownumber")}
          onMouseLeave={() => disablehover(".yellownumber")}
          onClick={() => {
            handleCircleClick(
              "fifth",
              10,
              10,
              "14/31/9/22/18/29",
              "Selector(color)"
            );
          }}
        >
          14/31/9/22/18/29
        </p>
        <p
          className="white"
          onMouseEnter={() => generatehover(".whitenumber")}
          onMouseLeave={() => disablehover(".whitenumber")}
          onClick={() => {
            handleCircleClick(
              "sixth",
              10,
              10,
              "7/28/12/35/3/26",
              "Selector(color)"
            );
          }}
        >
          7/28/12/35/3/26
        </p>
      </div>
    </div>
  );
}

export default forthmini;
