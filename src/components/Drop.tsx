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
import moment from "moment";
type Entry = {
  WinOdds: number;
};
interface DropProp {
  id: string;
  time: string;
  place: string;
  activeIndexValues?: number;
  Headtext?: string;
  gameData?: GameData;
  data: RootEventData;
  isActiveGame: boolean;
  gameNumber?: number;
}
interface DispatchParams {
  selected: any;
  min_multiplier: number;
  max_multiplier: number;
  toWin: number;
  expiry?: number;
  stake: number;
  gameId: number;
  draw?: number;
  stakeInfo?: string;
  isCombo?: boolean;
  isPastGame?: boolean;
  gameNumber?: number;
}
const Drop: React.FC<DropProp> = ({
  id,
  time,
  place,
  activeIndexValues,
  Headtext,
  gameData,
  data,
  isActiveGame = false,
  isPastGame = false,
  gameNumber,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickIndex, setClickIndex] = useState(0);
  const [removeText, setRemovetext] = useState(true);
  const [isLive, setisLive] = useState(false);
  const gameState = useAppSelector((state) => state.game);
  const [visible, setVisible] = useState(false);
  const [init, setInited] = useState(false);
  const gameType = useAppSelector((state) => state.gameType.gameType);
  const gameCreatedDate = gameState.game && new Date(gameState.game?.createdAt);
  const [selectCombo, setSelectCombo] = useState([]);
  const dispatch = useAppDispatch();
  const expiryOfGame = gameCreatedDate?.setMinutes(
    gameCreatedDate.getMinutes() + 5
  );
  const repeatState = useAppSelector((state) => state.repeat);
  const [BankClick, setBankclick] = useState<number | null>();
  const [ClearTheClick, setClear] = useState(false);
  const [activeGameForIcon, setActiveGame] = useState(false);
  const [isActivedtableButton, setisActivedTableButton] = useState<Set<number>>(
    new Set()
  );
  const [sortedArray, setSortedArray] = useState<Entry[]>([]);
  const betslips = useAppSelector((state) => state.betSlip);
  const handleClick = () => {
    setIsActive(!isActive);
    setActiveGame(false);
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
    setSelectCombo([]);
  };
  const handleSelectCombo = (index: number) => {
    setSelectCombo((prev) => [...prev, index]);
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
  useEffect(() => {
    if (
      data &&
      data.eventDetail &&
      data.eventDetail.Event &&
      data.eventDetail.Event.Race &&
      Array.isArray(data.eventDetail.Event.Race.Entries)
    ) {
      const sorted: Entry[] = [...data.eventDetail.Event.Race.Entries].sort(
        (a, b) => a.WinOdds - b.WinOdds
      );
      setSortedArray(sorted);
    }
  }, [data]);
  const HandleBankClick = (index: number) => {
    setBankclick(index);
  };

  useEffect(() => {
    setActiveGame(isActiveGame);
  }, [isActiveGame]);

  const CombinationDispatch = (params: DispatchParams) => {
    for (let i = 0; i < repeatState.repeat; i++) {
      dispatch(
        addToBetSlip({
          selected: params.selected,
          expiry: expiryOfGame ? expiryOfGame : {},
          min_multiplier: params.min_multiplier,
          max_multiplier: params.max_multiplier,
          toWin: params.toWin,
          stake: params.toWin,
          gameId: params.gameId,
          gameType: gameType,
          draw: params.draw,
          stakeInformation: params.stakeInfo,
          isCombo: params.isCombo,
          gameNumber: params.gameNumber,
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
          backgroundColor: isPastGame
            ? "#a81005"
            : isActive
            ? "#37b34a"
            : "transparent",
        }}
      >
        <div className="timePlace">
          <StartTimer
            text={time}
            onLive={handleLive}
            isgameActive={isActiveGame}
            isActive={isActive}
          />
          <IdandPlace Place={place} Id={id} isActive={isActive} />
        </div>
        <PlusMinus
          onClick={handleClick}
          isActive={isActive}
          isActiveGame={activeGameForIcon}
        />
      </div>
      {isActive || activeGameForIcon ? (
        <div className="container2 flex pb-3 gap-2 w-full">
          <div className="">
            {activeIndexValues !== 1 || isActiveGame ? (
              <BasicTable
                selectedCombos={handleSelectCombo}
                clickCount={handleClickCount}
                isClear={ClearTheClick}
                isActivatedtablebutton={isActivedtableButton}
                handleColorChange={handleColorChange}
                handleBankColorChange={HandleBankClick}
                isActiveBank={BankClick}
                HeadTexttoTable={Headtext}
                data={data}
                gameDatalist={gameData}
                sortedByOdd={sortedArray}
                gameNumber={data.Number}
              />
            ) : activeIndexValues === 1 ? (
              <HeadToHead />
            ) : (
              ""
            )}
          </div>

          <div
            className={`${
              clickCount > 1 && activeIndexValues === 0 ? "miniContainer" : ""
            }`}
          >
            {clickCount === 1 || isActivedtableButton.size === 1 ? (
              <div className="flex-col Need ml-1 text-md mt-16 text-black">
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
              <div className="Need waysbut w-full flex items-center justify-center flex-col h-full">
                <div className="h-full w-full mt-7 flex-col">
                  <div className="waysShow Need gap-2 w-full">
                    <Ways
                      text="QUINELLA"
                      text2="2 any order"
                      text3={`${combinations(clickCount, 2, 1)} Combinations`}
                      onClick={() => {
                        combineSlices();
                        CombinationDispatch({
                          selected: selectCombo.map((number, index) => {
                            return `${index == 0 ? "[" : ""}${
                              index === 0 ? "" : "-"
                            }${number + 1}${
                              index === selectCombo.length - 1 ? "]" : ""
                            }`;
                          }),
                          min_multiplier: 12,
                          max_multiplier: 1,
                          toWin: 100,
                          stake: 10,
                          gameId: data.ID.toString(),
                          stakeInfo: "2 any order",
                          isCombo: true,
                        });
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
                        // CombinationDispatch({
                        //   selected: row.Name,
                        //   multiplier: row.WinOdds,
                        //   toWin: 10,
                        //   stake: 12,
                        //   gameId: row.ID,
                        //   draw: row.Draw,
                        //   stakeInfo: "win",
                        // });
                      }}
                    />

                    <Ways
                      text="EXACTA"
                      text2="2 in order"
                      text3={`${combinations(clickCount, 2, 2)} Combinations`}
                      isvisible={true}
                      onClick={() => {
                        combineSlices();
                        // CombinationDispatch(
                        //   "1st Two any order",
                        //   1,
                        //   10,
                        //   10,
                        //   10,
                        //   4000,
                        //   true,
                        //   gameType
                        // );
                      }}
                    />

                    <Ways
                      text="TRIFECTA"
                      text2="3 in order"
                      text3={`${trifectaCombinations(clickCount)} Combinations`}
                      isvisible={visible}
                      onClick={() => {
                        combineSlices();
                        // CombinationDispatch(
                        //   "1st Two any order",
                        //   1,
                        //   10,
                        //   10,
                        //   10,
                        //   4000,
                        //   true,
                        //   gameType
                        // );
                      }}
                    />

                    <Ways
                      text="SWINGER"
                      text2="2 in 3 any order"
                      text3={`${combinations(clickCount, 2, 1)} Combinations`}
                      isvisible={true}
                      onClick={() => {
                        combineSlices();
                        // CombinationDispatch(
                        //   "1st Two any order",
                        //   1,
                        //   10,
                        //   10,
                        //   10,
                        //   4000,
                        //   true,
                        //   gameType
                        // );
                      }}
                    />
                  </div>
                  <div className="clearbutton ">
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
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Drop;
