import React, { useEffect, useState } from "react";
import generatehover, { disablehover } from "../../utils/generatehover";
import Circle from "../svg/circle";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { addToBetSlip, removeFromBetSlip } from "../../features/slices/pickerSlice";
import { MapRedAndBlack } from "../../utils/redblackMap";
import { removemessage, setIsClearCircle } from "../../features/slices/gameType";
import { OddNUMBERMap } from "../../utils/odd";
import { range } from "../../utils/range";
import { generateEvenAndOddArrays } from "../../utils/evenoddgenerate";
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
  gameNumber?: any;
  gameIdofBack?: string;
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
    const gameState = useAppSelector((state) => state.game);
    const gameCreatedDate =
      gameState.game && new Date(gameState.game?.createdAt);
    const expiryOfGame = gameCreatedDate?.setMinutes(
      gameCreatedDate.getMinutes() + 5
    );
    const ticketExpiry = useAppSelector((state) => state.expiry.expiry);
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
  const betSlip = useAppSelector((state) => state.picker.betSlip);

  const checkIsSelected = (oddType: string) => {
    for (let value of betSlip) {
      if (value.oddType === oddType) {
        dispatch(removeFromBetSlip(betSlip.indexOf(value)));
        return true;
      }
    }


    return false;
  };
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
      if (!checkIsSelected(oddType)) {
    dispatch(removemessage(!removemessage));

        dispatch(
          addToBetSlip({
            selected: selected,
            expiry:ticketExpiry,
            stakeInformation: stakeInfo,
            multiplier: Multiplier,
            gameId: prop.gameId,
            stake: stake,
            oddType: oddType,
            gameType: "SpinAndWin",
            gameNumber: prop.gameNumber,
            toWin:10
          })
        );
      }
    };
   
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
                OddNUMBERMap.HL,
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
                OddNUMBERMap.OE,
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
                OddNUMBERMap.COLOR,
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
                OddNUMBERMap.COLOR,
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
              handleCircleClick(
                "fifth",
                10,
                OddNUMBERMap.OE,
                odds,
                "Even/odd",
                "Even/odd2"
              );
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
                OddNUMBERMap.HL,
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
