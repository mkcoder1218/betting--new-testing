import React, { useState } from "react";
import generatehover, { disablehover } from "../../utils/generatehover";
import Circle from "../svg/circle";
import { useAppDispatch } from "../../features/hooks";
import { addToBetSlip } from "../../features/slices/pickerSlice";
type CircleState = {
  first12: boolean;
  second12: boolean;
  third12: boolean;
};
interface FirstMiniProp {
  gameId?: any;
}
function Secondminicontainer(prop: FirstMiniProp) {
  const dispatch = useAppDispatch();
  const [circleState, setCircleState] = useState<CircleState>({
    first12: false,
    second12: false,
    third12: false,
  });

  const [background, setbackground] = useState<CircleState>({
    first12: false,
    second12: false,
    third12: false,
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
    <div className="secmini_container w-full flex justify-center">
      <div className="childmini w-full" style={{ cursor: "pointer" }}>
        <p
          className={`first_twel${
            background.first12 ? "greenClick relative" : "relative"
          }`}
          onClick={() =>
            handleCircleClick("first12", 10, 10, "1st 12", "Dozens")
          }
          onMouseOver={() => generatehover(".number-row1")}
          onMouseLeave={() => disablehover(".number-row1")}
        >
          1st 12{circleState.first12 && <Circle />}
        </p>
        <p
          className={`first_twel ${
            background.second12 ? "greenClick relative" : " relative"
          }`}
          onClick={() =>
            handleCircleClick("second12", 10, 10, "2nd 12", "Dozens")
          }
          onMouseOver={() => generatehover(".number-row2")}
          onMouseLeave={() => disablehover(".number-row2")}
        >
          2nd 12{circleState.second12 && <Circle />}
        </p>
        <p
          className={`first_twel ${
            background.third12 ? "greenClick relative" : "relative"
          }`}
          onClick={() =>
            handleCircleClick("third12", 10, 10, "3rd 12", "Dozens")
          }
          onMouseOver={() => generatehover(".number-row3")}
          onMouseLeave={() => disablehover(".number-row3")}
        >
          3rd 12{circleState.third12 && <Circle />}
        </p>
      </div>
    </div>
  );
}

export default Secondminicontainer;
