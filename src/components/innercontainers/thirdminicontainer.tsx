import React, { useState } from "react";
import generatehover, { disablehover } from "../../utils/generatehover";
import Circle from "../svg/circle";
type CircleState = {
  first12: boolean;
  second12: boolean;
  third12: boolean;
  forth: boolean;
  fifth: boolean;
  sixth: boolean;
};
function Thirdminicontainer() {
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

  const handleCircleClick = (area: keyof CircleState) => {
    setCircleState((prevState) => ({
      ...prevState,
      [area]: !prevState[area],
    }));
    setbackground((prevState) => ({
      ...prevState,
      [area]: !prevState[area],
    }));
  };
  return (
    <div className="thrmini_container">
      <div className="childmini childmini2 first_twel">
        <p
          className="relative"
          onClick={() => {
            handleCircleClick("first12");
          }}
          onMouseEnter={() => generatehover(".oneto18")}
          onMouseLeave={() => disablehover(".oneto18")}
        >
          1-18 {circleState.first12 && <Circle />}
        </p>
        <p
          className="relative"
          onClick={() => {
            handleCircleClick("second12");
          }}
        >
          Even {circleState.second12 && <Circle />}
        </p>
        <p
          onClick={() => {
            handleCircleClick("third12");
          }}
          className="Red relative"
        >
          Red {circleState.third12 && <Circle />}
        </p>
        <p
          onClick={() => {
            handleCircleClick("forth");
          }}
          className="black relative"
        >
          Black {circleState.forth && <Circle />}
        </p>
        <p
          onClick={() => {
            handleCircleClick("fifth");
          }}
          className="relative"
        >
          odd {circleState.fifth && <Circle />}
        </p>
        <p
          onClick={() => {
            handleCircleClick("sixth");
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
