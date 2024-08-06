import React, { useState } from "react";
import generatehover, { disablehover } from "../../utils/generatehover";
import Circle from "../svg/circle";
import { useAppDispatch } from "../../features/hooks";
import { addToBetSlip } from "../../features/slices/pickerSlice";
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
      })
    );
  };
  return (
    <div className="thrmini_container">
      <div className="childmini childmini2 first_twel">
        <p
          className="relative"
          onClick={() => {
            handleCircleClick("first12", 10, 10, "1-18", "High/low");
          }}
          onMouseEnter={() => generatehover(".oneto18")}
          onMouseLeave={() => disablehover(".oneto18")}
        >
          1-18 {circleState.first12 && <Circle />}
        </p>
        <p
          className="relative"
          onClick={() => {
            handleCircleClick("second12", 10, 10, "Even", "Even/odd");
          }}
        >
          Even {circleState.second12 && <Circle />}
        </p>
        <p
          onClick={() => {
            handleCircleClick("third12", 10, 10, "Red", "Color");
          }}
          className="Red relative"
        >
          Red {circleState.third12 && <Circle />}
        </p>
        <p
          onClick={() => {
            handleCircleClick("forth", 10, 10, "Black", "Color");
          }}
          className="black relative"
        >
          Black {circleState.forth && <Circle />}
        </p>
        <p
          onClick={() => {
            handleCircleClick("fifth", 10, 10, "odd", "Even/odd");
          }}
          className="relative"
        >
          odd {circleState.fifth && <Circle />}
        </p>
        <p
          onClick={() => {
            handleCircleClick("sixth", 10, 10, "19-36", "High/low");
          }}
          onMouseEnter={() => generatehover(".after18")}
          onMouseLeave={() => disablehover(".after18")}
          className="relative"
        >
          19-36 {circleState.sixth && <Circle />}
        </p>
      </div>
    </div>
  );
}

export default Thirdminicontainer;
