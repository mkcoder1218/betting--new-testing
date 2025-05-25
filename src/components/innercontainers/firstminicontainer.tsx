import React, { useEffect, useState } from "react";
import { GenerateOption2 } from "../../utils/GenerateOption";
import generatehover, { disablehover } from "../../utils/generatehover";
import Circle from "../svg/circle";
import Fourrowhover from "../svg/fourrowhover";
import { Market, RootEventData } from "../../features/slices/RacingGameSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import {
  addToBetSlip,
  removeFromBetSlip,
} from "../../features/slices/pickerSlice";
import { OddMultiplier } from "../../features/slices/oddSlice";
import { ColumnMap } from "../../utils/columnMap";
import {
  removemessage,
  setIsClearCircle,
} from "../../features/slices/gameType";
import { OddNUMBERMap } from "../../utils/odd";
type CircleState = {
  first12: boolean;
  second12: boolean;
  third12: boolean;
  zero?: boolean;
};
interface FirstMiniProp {
  gameId?: any;
  gameNumber?: any;
  gameStartTime?: any;  
  gameIdofBack?: string;
}
function Firstminicontainer(prop: FirstMiniProp) {
  const [circleState, setCircleState] = useState<CircleState>({
    first12: false,
    second12: false,
    third12: false,
    zero: false,
  });
  const gameState = useAppSelector((state) => state.game);
  const gameCreatedDate = gameState.game && new Date(gameState.game?.createdAt);
  const expiryOfGame = gameCreatedDate?.setMinutes(
    gameCreatedDate.getMinutes() + 5
  );
  const [zero, setzero] = useState(false);
  const ticketExpiry = useAppSelector((state) => state.expiry.expiry);

  const [iszero, setisZero] = useState(false);
  const [background, setbackground] = useState<CircleState>({
    first12: false,
    second12: false,
    third12: false,
    zero: false,
  });
  const handleIsZero = () => {
    setisZero(!iszero);
  };
  const isCircle = useAppSelector((state) => state.gameType.isClearCircle);
  const betSlip = useAppSelector((state) => state.picker.betSlip);

  const checkIsSelected = (selected: number[]) => {
    for (let value of betSlip) {
      if (selected.every((item) => value.selected.includes(item))) {
        dispatch(removeFromBetSlip(betSlip.indexOf(value)));
        return true;
      }
    }

    return false;
  };
  useEffect(() => {
    if (isCircle) {
      setbackground({
        first12: false,
        second12: false,
        third12: false,
        zero: false,
      });
      setCircleState({
        first12: false,
        second12: false,
        third12: false,
        zero: false,
      });
    }
  }, [isCircle]);
  const handleCircleClickForZero = (area: keyof CircleState) => {
    dispatch(setIsClearCircle(false));
    setCircleState((prevState) => ({
      ...prevState,
      [area]: !prevState[area],
    }));
    setbackground((prevState) => ({
      ...prevState,
      [area]: !prevState[area],
    }));
  };
  const handleCircleClick = (
    area: keyof CircleState,
    stake?: number,
    Multiplier?: number,
    selected?: any,
    stakeInfo?: string,
    oddType?: string,
    gameNumber?: number
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
    if (!checkIsSelected(selected)) {
      dispatch(removemessage(!removemessage));

      dispatch(
        addToBetSlip({
          selected: selected,
          expiry: ticketExpiry,
          toWin: 10,
          stakeInformation: stakeInfo,
          multiplier: Multiplier,
          gameId: prop.gameId,
          stake: stake,
          startTime: prop.gameStartTime + "",
          oddType: oddType,
          gameType: "SpinAndWin",
          gameNumber: prop.gameNumber,
        })
      );
    }
  };
  const dispatch = useAppDispatch();
  return (
    <div className="first_MiniContainer w-full max-h-[40%]">
      <div className="big_container h-[150px]" style={{ width: "85%" }}>
        <div
          className="zero green border relative"
          onMouseEnter={handleIsZero}
          onMouseLeave={handleIsZero}
          onClick={() => {
            handleCircleClickForZero("zero");
            setzero(!zero);
            if (zero) {
              for (let item of betSlip) {
                if (item.selected[0] === 0) {
                  dispatch(removeFromBetSlip(betSlip.indexOf(item)));
                  return;
                }
              }
            } else {
              dispatch(removemessage(!removemessage));

              dispatch(
                addToBetSlip({
                  selected: [0],
                  expiry: ticketExpiry,
                  toWin: 10,
                  multiplier: OddNUMBERMap.Win,
                  oddType: "Win",
                  stakeInformation: "Win",
                  stake: 10,
                  gameId: prop.gameId,
                  gameType: "SpinAndWin",
                  gameNumber: prop.gameNumber,
                  startTime: prop.gameStartTime + "",
                })
              );
            }
          }}
        >
          <p className="relative">0</p>
          {iszero ? <Fourrowhover row1={0} row2={0} row3={4} i={0} /> : ""}
          <div className="zerocircle">
            {circleState.zero && <Circle pad={true} />}
          </div>
        </div>
        <div className="numbers h-full w-full ">
          <div className="w-full flex items-center h-full justify-center text-center">
            <div className="numbers-row number-row1 border border-1 oneto18 relative">
              {GenerateOption2("p", 1, 3, prop.gameId, prop.gameNumber, prop.gameStartTime
              )}
            </div>
            <div className="numbers-row number-row1 border border-1 oneto18 relative">
              {" "}
              {GenerateOption2("p", 4, 6, prop.gameId, prop.gameNumber, prop.gameStartTime
              )}
            </div>
            <div className="numbers-row number-row1 border border-1 oneto18 relative">
              {" "}
              {GenerateOption2("p", 7, 9, prop.gameId, prop.gameNumber, prop.gameStartTime
              )}
            </div>
            <div className="numbers-row number-row1 border border-1 oneto18 relative">
              {" "}
              {GenerateOption2("p", 10, 12, prop.gameId, prop.gameNumber, prop.gameStartTime
              )}
            </div>
            <div className="numbers-row number-row2 border border-1 oneto18 relative">
              {" "}
              {GenerateOption2("p", 13, 15, prop.gameId, prop.gameNumber, prop.gameStartTime)}
            </div>
            <div className="numbers-row number-row2 border border-1 oneto18 relative">
              {" "}
              {GenerateOption2("p", 16, 18, prop.gameId, prop.gameNumber, prop.gameStartTime)}
            </div>

            <div className="numbers-row number-row2 border border-1 after18 relative">
              {" "}
              {GenerateOption2("p", 19, 21, prop.gameId, prop.gameNumber, prop.gameStartTime)}
            </div>
            <div className="numbers-row number-row2 border border-1 after18 relative">
              {" "}
              {GenerateOption2("p", 22, 24, prop.gameId, prop.gameNumber, prop.gameStartTime)}
            </div>
            <div className="numbers-row number-row3 border border-1 after18 relative">
              {" "}
              {GenerateOption2("p", 25, 27, prop.gameId, prop.gameNumber, prop.gameStartTime)}
            </div>

            <div className="numbers-row number-row3 border border-1 after18 relative">
              {" "}
              {GenerateOption2("p", 28, 30, prop.gameId, prop.gameNumber, prop.gameStartTime)}
            </div>
            <div className="numbers-row number-row3 border border-1 after18 relative">
              {" "}
              {GenerateOption2("p", 31, 33, prop.gameId, prop.gameNumber, prop.gameStartTime)}
            </div>
            <div className="numbers-row number-row3 border border-1 after18 relative">
              {" "}
              {GenerateOption2("p", 34, 36, prop.gameId, prop.gameNumber, prop.gameStartTime)}
            </div>
          </div>
        </div>
      </div>
      <div className="small_container h-[150px]">
        <div
          className={`small_mini_container ${
            background.first12 && !isCircle ? "greenClick relative" : "relative"
          }`}
          onClick={() => {
            handleCircleClick(
              "first12",
              10,
              OddNUMBERMap.Cols,
              ColumnMap.col1,
              "Column",
              "Column",
              prop.gameNumber
            );
          }}
          onMouseEnter={() => generatehover(".third-row")}
          onMouseLeave={() => {
            disablehover(".third-row");
          }}
        >
          <p className="relative">2 To 1 </p>
          <div>{circleState.first12 && <Circle pad={true} />}</div>
        </div>
        <div
          className={`small_mini_container ${
            background.second12 && !isCircle
              ? "greenClick relative"
              : "relative"
          }`}
          onClick={() => {
            handleCircleClick(
              "second12",
              10,
              OddNUMBERMap.Cols,
              ColumnMap.col2,
              "Column",
              "Column",
              prop.gameNumber
            );
          }}
          onMouseEnter={() => generatehover(".second-row")}
          onMouseLeave={() => {
            disablehover(".second-row");
          }}
        >
          <p className="relative">2 To 1 </p>
          <div>{circleState.second12 && <Circle pad={true} />}</div>
        </div>
        <div
          className={`small_mini_container ${
            background.third12 && !isCircle ? "greenClick relative" : "relative"
          }`}
          onClick={() => {
            handleCircleClick(
              "third12",
              10,
              OddNUMBERMap.Cols,
              ColumnMap.col3,
              "Column",
              "Column",
              prop.gameNumber
            );
          }}
          onMouseEnter={() => generatehover(".first-row")}
          onMouseLeave={() => {
            disablehover(".first-row");
          }}
        >
          <p className="relative">2 To 1 </p>
          <div>{circleState.third12 && <Circle pad={true} />}</div>
        </div>
      </div>
    </div>
  );
}

export default Firstminicontainer;
