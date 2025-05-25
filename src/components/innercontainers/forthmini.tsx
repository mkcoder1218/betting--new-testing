import React, { useEffect, useState } from "react";
import generatehover, { disablehover } from "../../utils/generatehover";
import {
  addToBetSlip,
  removeFromBetSlip,
} from "../../features/slices/pickerSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { OddNUMBERMap } from "../../utils/odd";
import Circle from "../svg/circle";
import {
  removemessage,
  setIsClearCircle,
} from "../../features/slices/gameType";
interface FirstMiniProp {
  gameId?: any;
  gameNumber?: any;
  gameIdofBack?: string;
  gameStartTime?: any;
}
type CircleState = {
  first12: boolean;
  second12: boolean;
  third12: boolean;
  forth: boolean;
  fifth: boolean;
  sixth: boolean;
};
function Forthmini(prop: FirstMiniProp) {
  const dispatch = useAppDispatch();
  const betSlip = useAppSelector((state) => state.picker.betSlip);
  const gameState = useAppSelector((state) => state.game);
  const gameCreatedDate = gameState.game && new Date(gameState.game?.createdAt);
  const expiryOfGame = gameCreatedDate?.setMinutes(
    gameCreatedDate.getMinutes() + 5
  );
  const ticketExpiry = useAppSelector((state) => state.expiry.expiry);

  const checkIsSelected = (oddType: string) => {
    for (let item of betSlip) {
      if (item.oddType === oddType) {
        dispatch(removeFromBetSlip(betSlip.indexOf(item)));
        return true;
      }
    }
    return false;
  };
  const isCircle = useAppSelector((state) => state.gameType.isClearCircle);

  const [circleState, setCircleState] = useState<CircleState>({
    first12: false,
    second12: false,
    third12: false,
    forth: false,
    fifth: false,
    sixth: false,
  });
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

    if (!checkIsSelected(oddType)) {
      dispatch(removemessage(!removemessage));

      dispatch(
        addToBetSlip({
          selected: selected,
          expiry: ticketExpiry,
          stakeInformation: stakeInfo,
          multiplier: Multiplier,
          gameId: prop.gameId,
          stake: stake,
          oddType: oddType,
          startTime: prop.gameStartTime + "",
          gameNumber: prop.gameNumber,
          gameType: "SpinAndWin",
          toWin: 10,
        })
      );
    }
  };
  return (
    <div className="forthmini_container">
      <div className="childmini childmini3">
        <p
          className="orange cursor-pointer relative"
          onMouseEnter={() => generatehover(".orangenumber")}
          onMouseLeave={() => disablehover(".orangenumber")}
          onClick={() => {
            handleCircleClick(
              "first12",
              10,
              OddNUMBERMap.Sec,
              [32, 15, 19, 4, 21, 2],
              "Selector(color)",
              "Selector(color)1"
            );
          }}
        >
          32/15/19/4/21/2{circleState.first12 && <Circle />}
        </p>
        <p
          className="blue cursor-pointer relative"
          onMouseEnter={() => generatehover(".bluenumber")}
          onMouseLeave={() => disablehover(".bluenumber")}
          onClick={() => {
            handleCircleClick(
              "second12",
              10,
              OddNUMBERMap.Sec,
              [25, 17, 34, 6, 27, 13],
              "Selector(color)",
              "Selector(color)2"
            );
          }}
        >
          25/17/34/6/27/13{circleState.second12 && <Circle />}
        </p>
        <p
          className="rose cursor-pointer relative"
          onMouseEnter={() => generatehover(".rosenumber")}
          onMouseLeave={() => disablehover(".rosenumber")}
          onClick={() => {
            handleCircleClick(
              "third12",
              10,
              OddNUMBERMap.Sec,
              [36, 11, 30, 8, 23, 10],
              "Selector(color)",
              "Selector(color)3"
            );
          }}
        >
          36/11/30/8/23/10{circleState.third12 && <Circle />}
        </p>
        <p
          className="lightgreen cursor-pointer relative"
          onMouseEnter={() => generatehover(".greennumber")}
          onMouseLeave={() => disablehover(".greennumber")}
          onClick={() => {
            handleCircleClick(
              "forth",
              10,
              OddNUMBERMap.Sec,
              [5, 24, 16, 33, 1, 20],
              "Selector(color)",
              "Selector(color)4"
            );
          }}
        >
          5/24/16/33/1/20{circleState.forth && <Circle />}
        </p>
        <p
          className="yellow cursor-pointer relative"
          onMouseEnter={() => generatehover(".yellownumber")}
          onMouseLeave={() => disablehover(".yellownumber")}
          onClick={() => {
            handleCircleClick(
              "fifth",
              10,
              OddNUMBERMap.Sec,
              [14, 31, 9, 22, 18, 29],
              "Selector(color)",
              "Selector(color)5"
            );
          }}
        >
          14/31/9/22/18/29{circleState.fifth && <Circle />}
        </p>
        <p
          className="white cursor-pointer relative"
          onMouseEnter={() => generatehover(".whitenumber")}
          onMouseLeave={() => disablehover(".whitenumber")}
          onClick={() => {
            handleCircleClick(
              "sixth",
              10,
              OddNUMBERMap.Sec,
              [7, 28, 12, 35, 3, 26],
              "Selector(color)",
              "Selector(color)6"
            );
          }}
        >
          7/28/12/35/3/26{circleState.sixth && <Circle />}
        </p>
      </div>
    </div>
  );
}

export default Forthmini;
