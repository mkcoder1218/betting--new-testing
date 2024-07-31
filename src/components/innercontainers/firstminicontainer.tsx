import React, { useState } from "react";
import { GenerateOption2 } from "../../utils/GenerateOption";
import generatehover, { disablehover } from "../../utils/generatehover";
import Circle from "../svg/circle";
import Fourrowhover from "../svg/fourrowhover";
type CircleState = {
  first12: boolean;
  second12: boolean;
  third12: boolean;
};
function Firstminicontainer() {
  const [circleState, setCircleState] = useState<CircleState>({
    first12: false,
    second12: false,
    third12: false,
  });
  const [iszero, setisZero] = useState(false);
  const [background, setbackground] = useState<CircleState>({
    first12: false,
    second12: false,
    third12: false,
  });
  const handleIsZero = () => {
    setisZero(!iszero);
  };
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
    <div className="first_MiniContainer w-full h-2/5">
      <div className="big_container h-4/5" style={{ width: "85%" }}>
        <div
          className="zero green"
          onMouseEnter={handleIsZero}
          onMouseLeave={handleIsZero}
        >
          <p>0</p>
          {iszero ? <Fourrowhover row1={0} row2={0} row3={4} i={0} /> : ""}
        </div>
        <div className="numbers h-full w-full ">
          <div className="w-full flex items-center h-full justify-center text-center">
            <div className="numbers-row number-row1 border-2 oneto18 relative">
              {GenerateOption2("p", 1, 3)}
            </div>
            <div className="numbers-row number-row1 border-2 oneto18 relative">
              {" "}
              {GenerateOption2("p", 4, 6)}
            </div>
            <div className="numbers-row number-row1 border-2 oneto18 relative">
              {" "}
              {GenerateOption2("p", 7, 9)}
            </div>
            <div className="numbers-row number-row1 border-2 oneto18 relative">
              {" "}
              {GenerateOption2("p", 10, 12)}
            </div>
            <div className="numbers-row number-row2 border-2 oneto18 relative">
              {" "}
              {GenerateOption2("p", 13, 15)}
            </div>
            <div className="numbers-row number-row2 border-2 oneto18 relative">
              {" "}
              {GenerateOption2("p", 16, 18)}
            </div>

            <div className="numbers-row number-row2 border-2 after18 relative">
              {" "}
              {GenerateOption2("p", 19, 21)}
            </div>
            <div className="numbers-row number-row2 border-2 after18 relative">
              {" "}
              {GenerateOption2("p", 22, 24)}
            </div>
            <div className="numbers-row number-row3 border-2 after18 relative">
              {" "}
              {GenerateOption2("p", 25, 27)}
            </div>

            <div className="numbers-row number-row3 border-2 after18 relative">
              {" "}
              {GenerateOption2("p", 28, 30)}
            </div>
            <div className="numbers-row number-row3 border-2 after18 relative">
              {" "}
              {GenerateOption2("p", 31, 33)}
            </div>
            <div className="numbers-row number-row3 border-2 after18 relative">
              {" "}
              {GenerateOption2("p", 34, 36)}
            </div>
          </div>
        </div>
      </div>
      <div className="small_container h-4/5">
        <div
          className={`small_mini_container ${
            background.first12 ? "greenClick relative" : "relative"
          }`}
        >
          <p
            onClick={() => handleCircleClick("first12")}
            onMouseEnter={() => generatehover(".third-row")}
            onMouseLeave={() => {
              disablehover(".third-row");
            }}
            className="relative"
          >
            2 To 1{" "}
          </p>
          <div>{circleState.first12 && <Circle />}</div>
        </div>
        <div
          className={`small_mini_container ${
            background.second12 ? "greenClick relative" : "relative"
          }`}
        >
          <p
            onClick={() => handleCircleClick("second12")}
            onMouseEnter={() => generatehover(".second-row")}
            onMouseLeave={() => {
              disablehover(".second-row");
            }}
            className="relative"
          >
            2 To 1{" "}
          </p>
          <div>{circleState.second12 && <Circle />}</div>
        </div>
        <div
          className={`small_mini_container ${
            background.third12 ? "greenClick relative" : "relative"
          }`}
        >
          <p
            onClick={() => handleCircleClick("third12")}
            onMouseEnter={() => generatehover(".first-row")}
            onMouseLeave={() => {
              disablehover(".first-row");
            }}
            className="relative"
          >
            2 To 1{" "}
          </p>
          <div>{circleState.third12 && <Circle />}</div>
        </div>
      </div>
    </div>
  );
}

export default Firstminicontainer;
