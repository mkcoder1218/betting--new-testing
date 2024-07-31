import React, { useEffect, useState } from "react";
import StartTimer from "../ui/StartTimer";
import IdandPlace from "../ui/IdandPlace";
import PlusMinus from "../ui/PlusMinus";
import BasicTable from "../ui/Table";
import Ways from "../ui/Ways";
import ButtonSizes from "../ui/Win";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Message from "../ui/Message";
import HeadToHead from "../ui/HeadtoHead";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  Ticket,
  addToBetSlip,
  clearNumbers,
} from "../features/slices/pickerSlice";
import { combineSlices } from "@reduxjs/toolkit";
import { GameData, RootEventData } from "../features/slices/RacingGameSlice";
interface DropProp {
  id: string;
  time: string;
  place: string;
  activeIndexValues?: number;
  gameData?: GameData;
  data: RootEventData;
  isActiveGame: boolean;
  Headtext?: string;
}
const Drop: React.FC<DropProp> = ({
  id,
  time,
  place,
  activeIndexValues,
  gameData,
  data,
  isActiveGame = false,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickIndex, setClickIndex] = useState(0);
  const [removeText, setRemovetext] = useState(true);
  const [isLive, setisLive] = useState(false);
  const gameState = useAppSelector((state) => state.game);
  const [visible, setVisible] = useState(false);
  const gameType = useAppSelector((state) => state.gameType.gameType);
  const gameCreatedDate = gameState.game && new Date(gameState.game?.createdAt);

  const dispatch = useAppDispatch();
  const expiryOfGame = gameCreatedDate?.setMinutes(
    gameCreatedDate.getMinutes() + 5
  );
  const repeatState = useAppSelector((state) => state.repeat);
  const [BankClick, setBankclick] = useState<number | null>();
  const [ClearTheClick, setClear] = useState(false);
  const [isActivedtableButton, setisActivedTableButton] = useState<Set<number>>(
    new Set()
  );
  const handleClick = () => {
    setIsActive(!isActive);
  };
  const handleClickCount = (val: number) => {
    setClickCount(val);
    setClear(false);
  };
  const handleLive = (val: boolean) => {
    setisLive(val);
  };
  const handleClear = () => {
    setClear(true);
    setVisible(false);
    setisActivedTableButton(new Set());
    setBankclick(null);
  };

const handleColorChange = (index: number) => {
  setisActivedTableButton((prevActiveButtons) => {
    const updatedButtons = new Set(prevActiveButtons);
    if (updatedButtons.has(index)) {
      updatedButtons.delete(index);
    } else {
      updatedButtons.add(index);
    }
    return updatedButtons;
  });
};
useEffect(() => {
  if (clickCount > 2) {
    setVisible(true);
  }
}, [clickCount]);
const HandleBankClick = (index: number) => {
  setBankclick(index);
};
const CombinationDispatch = (
  selected: any,
  multiplier: number,
  toWin: number,
  expiry: number,
  stake: number,
  gameId: number,
  isCombo: boolean,
  gameType: string | undefined
) => {
  for (let i = 0; i < repeatState.repeat; i++) {
    dispatch(
      addToBetSlip({
        selected: selected,
        expiry: expiryOfGame ? expiryOfGame : ticketExpiry,
        multiplier: multiplier,
        toWin: toWin,
        stake: toWin,
        gameId: gameId,
        isCombo: isCombo,
        gameType: gameType,
      })
    );
  }
};
function factorial(n: number) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}
function combinations(
  number: number,
  combination: number,
  multiplayer: number
) {
  if (combination === 3 && number <= 2) {
    return 0;
  }
  const calculate =
    factorial(number) /
    (factorial(combination) * factorial(number - combination));
  return calculate * multiplayer;
}
function trifectaCombinations(n: number) {
  if (n < 3) {
    return 0;
  }
  if (n === 3) {
    return 1;
  }
  return factorial(n) / Math.abs(factorial(n - 3));
}
return (
  <div className="DropContainer">
    <div
      className="container"
      style={{
        backgroundColor: isLive
          ? "#a81005"
          : isActive
          ? "#37b34a"
          : "transparent",
      }}
    >
      <div className="timePlace">
        <StartTimer text={time} onLive={handleLive} />
        <IdandPlace Place={place} Id={id} />
      </div>
      <PlusMinus onClick={handleClick} isActive={isActive} />
    </div>
    {isActive ? (
      <div className="container2">
        {activeIndexValues === 0 ? (
          <BasicTable
            clickCount={handleClickCount}
            isClear={ClearTheClick}
            isActivatedtablebutton={isActivedtableButton}
            handleColorChange={handleColorChange}
            handleBankColorChange={HandleBankClick}
            isActiveBank={BankClick}
          />
        ) : activeIndexValues === 1 ? (
          <HeadToHead />
        ) : (
          ""
        )}

          {clickCount === 1 || isActivedtableButton.size === 1 ? (
            <div className="flex-col Need text-lg mt-20 text-black">
              <Message text="Need a minimum of two selections to create a combo" />
              <ButtonSizes
                text="Clear"
                isActive={false}
                SvgIconComponent={DeleteOutlineOutlinedIcon}
                onClick={() => {
                  handleClear();
                  setClickCount(0);
                }}
              />
            </div>
          ) : clickCount > 1 && activeIndexValues === 0 ? (
            <div
              className="Need w-1/4 waysbut flex-col items-center"
              style={{ width: "30%" }}
            >
              <div className="h-full flex-col items-end justify-end">
                <div className="waysShow Need gap-2 mt-20 h-2/3">
                  <Ways
                    text="QUINELLA"
                    text2="2 any order"
                    text3={`${combinations(clickCount, 2, 1)} Combinations`}
                    onClick={() => {
                      combineSlices();
                      CombinationDispatch(
                        "1st Two any order",
                        1,
                        10,
                        10,
                        10,
                        4000,
                        true,
                        gameType
                      );
                    }}
                    isvisible={true}
                  />

                  <Ways
                    text="TRIO"
                    text2="3 any order"
                    text3={`${combinations(clickCount, 3, 1)} Combinations`}
                    isvisible={visible}
                    onClick={() => {
                      combineSlices();
                      CombinationDispatch(
                        "1st Two any order",
                        1,
                        10,
                        10,
                        10,
                        4000,
                        true,
                        gameType
                      );
                    }}
                  />

                  <Ways
                    text="EXACTA"
                    text2="2 in order"
                    text3={`${combinations(clickCount, 2, 2)} Combinations`}
                    isvisible={true}
                    onClick={() => {
                      combineSlices();
                      CombinationDispatch(
                        "1st Two any order",
                        1,
                        10,
                        10,
                        10,
                        4000,
                        true,
                        gameType
                      );
                    }}
                  />

                  <Ways
                    text="TRIFECTA"
                    text2="3 in order"
                    text3={`${trifectaCombinations(clickCount)} Combinations`}
                    isvisible={visible}
                    onClick={() => {
                      combineSlices();
                      CombinationDispatch(
                        "1st Two any order",
                        1,
                        10,
                        10,
                        10,
                        4000,
                        true,
                        gameType
                      );
                    }}
                  />

                  <Ways
                    text="SWINGER"
                    text2="2 in 3 any order"
                    text3={`${combinations(clickCount, 2, 1)} Combinations`}
                    isvisible={true}
                    onClick={() => {
                      combineSlices();
                      CombinationDispatch(
                        "1st Two any order",
                        1,
                        10,
                        10,
                        10,
                        4000,
                        true,
                        gameType
                      );
                    }}
                  />
                </div>
                <ButtonSizes
                  text="Clear"
                  isActive={false}
                  SvgIconComponent={DeleteOutlineOutlinedIcon}
                  onClick={() => {
                    handleClear();
                    setClickCount(0);
                  }}
                />
              </div>
            </div>
          ) : activeIndexValues === 0 ? (
            <>
              {removeText ? (
                <div className="flex-col Need text-lg text-black mt-20 w-full items-start">
                  <Message text="Select to create combination bets" />
                  <ButtonSizes
                    text="Clear"
                    isActive={false}
                    SvgIconComponent={DeleteOutlineOutlinedIcon}
                    onClick={() => {
                      setRemovetext(false);
                      handleClear();
                    }}
                  />
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Drop;
