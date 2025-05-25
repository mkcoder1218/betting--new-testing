import React, { useEffect, useState } from "react";
import generatehover, { disablehover } from "../../utils/generatehover";
import Circle from "../svg/circle";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import {
  addToBetSlip,
  removeFromBetSlip,
} from "../../features/slices/pickerSlice";
import {
  removemessage,
  setIsClearCircle,
} from "../../features/slices/gameType";
import { Input } from "@mui/material";
import { DispatchParams } from "../../ui/Table";
import { OddNUMBERMap } from "../../utils/odd";
import CheckSelection from "../../utils/CheckSelection";
import { range } from "../../utils/range";
type CircleState = {
  first12: boolean;
  second12: boolean;
  third12: boolean;
};

interface FirstMiniProp {
  gameId?: any;
  gameNumber?: any;
  gameIdofBack?: string;
  gameStartTime?: any;
}
function Secondminicontainer(prop: FirstMiniProp) {
  const dispatch = useAppDispatch();

  const isCircle = useAppSelector((state) => state.gameType.isClearCircle);
  const [circleState, setCircleState] = useState<CircleState>({
    first12: false,
    second12: false,
    third12: false,
  });
  const gameState = useAppSelector((state) => state.game);
  const gameCreatedDate = gameState.game && new Date(gameState.game?.createdAt);
  const expiryOfGame = gameCreatedDate?.setMinutes(
    gameCreatedDate.getMinutes() + 5
  );
  const [background, setbackground] = useState<CircleState>({
    first12: false,
    second12: false,
    third12: false,
  });
  useEffect(() => {
    if (isCircle) {
      setbackground({
        first12: false,
        second12: false,
        third12: false,
      });
      setCircleState({
        first12: false,
        second12: false,
        third12: false,
      });
    }
  }, [isCircle]);
  const ticketExpiry = useAppSelector((state) => state.expiry.expiry);

  const betSlip = useAppSelector((state) => state.picker.betSlip);
  const checkIsSelected = (oddType: string) => {
    for (let item of betSlip) {
      if (item.oddType === oddType) {
        dispatch(removeFromBetSlip(betSlip.indexOf(item)));
        return true;
      }
    }

    return false;
  };
  const handleCircleClick = (
    area: keyof CircleState,
    Props: DispatchParams
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
    if (!checkIsSelected(Props.oddType)) {
      dispatch(removemessage(!removemessage));

      dispatch(
        addToBetSlip({
          selected: Props.selected,
          stakeInformation: Props.stakeInfo,
          multiplier: Props.multiplier,
          gameId: prop.gameId,
          stake: Props.stake,
          toWin: Props.toWin,

          expiry: ticketExpiry,
          oddType: Props.oddType,
          gameType: "SpinAndWin",
          gameNumber: prop.gameNumber,
          startTime: prop.gameStartTime,
        })
      );
    }
  };

  return (
    <div className="secmini_container w-full flex justify-center">
      <div className="childmini w-full" style={{ cursor: "pointer" }}>
        <p
          className={`first_twel ${
            background.first12 && !isCircle ? "greenClick relative" : "relative"
          } `}
          onClick={() => {
            handleCircleClick("first12", {
              selected: range(1, 12),
              stakeInfo: "Dozens",
              multiplier: OddNUMBERMap.Dozens,
              gameId: prop.gameId,
              stake: 10,
              toWin: 10,
              oddType: "Dozens1",
              gameNumber: prop.gameNumber,
            });
          }}
          onMouseOver={() => generatehover(".number-row1")}
          onMouseLeave={() => disablehover(".number-row1")}
        >
          1st 12{circleState.first12 && <Circle />}
        </p>
        <p
          className={`first_twel ${
            background.second12 && !isCircle
              ? "greenClick relative"
              : " relative"
          }`}
          onClick={() => {
            handleCircleClick("second12", {
              selected: range(13, 24),
              stakeInfo: "Dozens",
              multiplier: OddNUMBERMap.Dozens,
              gameId: prop.gameId,
              stake: 10,
              toWin: 10,
              oddType: "Dozens2",
              gameNumber: prop.gameNumber,
            });
          }}
          onMouseOver={() => generatehover(".number-row2")}
          onMouseLeave={() => disablehover(".number-row2")}
        >
          2nd 12{circleState.second12 && <Circle />}
        </p>
        <p
          className={`first_twel ${
            background.third12 && !isCircle ? "greenClick relative" : "relative"
          }`}
          onClick={() => {
            handleCircleClick("third12", {
              selected: range(25, 36),
              stakeInfo: "Dozens",
              multiplier: OddNUMBERMap.Dozens,
              gameId: prop.gameId,
              stake: 10,
              toWin: 10,
              oddType: "Dozens3",
              gameNumber: prop.gameNumber,
            });
          }}
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
