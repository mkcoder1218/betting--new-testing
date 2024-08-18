import { RiDeleteBin6Line } from "react-icons/ri";
import SlipItem from "./SlipItem";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  Ticket,
  addToBetSlip,
  clearNumbers,
} from "../features/slices/pickerSlice";
import React, { useEffect, useState } from "react";
import { OddMultiplier } from "../features/slices/oddSlice";
import { defaultStake } from "../config/constants";
import { GameData } from "../features/slices/RacingGameSlice";
import moment from "moment";
import PlusMinus from "../ui/PlusMinus";
import { removemessage } from "../features/slices/gameType";
// import { writeToPrinter } from "./SlipPrinter";
interface TicketHolderProp {
  gameType: string;
  gameData: GameData;
  update: boolean;
}

const TicketSlipHolder: React.FC<TicketHolderProp> = ({
  gameType,
  gameData,
  update,
}) => {
  const pickedNumbers = useAppSelector((state) => state.picker.selected);
  const betSlip = useAppSelector((state) => state.picker.betSlip);
  const betState = useAppSelector((state) => state.betSlip);
  const gameState = useAppSelector((state) => state.game);
  const gameCreatedDate = gameState.game && new Date(gameState.game?.createdAt);

  const expiryOfGame = gameCreatedDate?.setMinutes(
    gameCreatedDate.getMinutes() + 5
  );
  const ticketExpiry = useAppSelector((state) => state.expiry.expiry);
  const currentDate = new Date().getTime();
  const [error, setError] = useState("");

  const odd = useAppSelector((state) => state.odd);
  const [odds, setOdds] = useState<OddMultiplier[]>([]);
  const repeatState = useAppSelector((state) => state.repeat);
  const dispatch = useAppDispatch();

  const clearList = () => {
    dispatch(clearNumbers());
    setOdds([]);
  };

  useEffect(() => {
    if (update) clearList();
  }, [update]);

  const addToSlip = ({
    selected,
    multiplier,
    toWin,
    stake,
    gameId,
    stakeInformation,
  }: Ticket) => {
    for (let item of betSlip) {
      if (selected === item.selected) {
        return;
      }
    }

    // if (currentDate > ticketExpiry) {
    //   return;
    // }

    for (let i = 0; i < repeatState.repeat; i++) {
      dispatch(
        addToBetSlip({
          selected: selected,
          expiry: new Date(gameData.startTime).getTime(),
          multiplier,
          toWin,
          stake,
          gameId: gameData.id,
          gameType,
          stakeInformation: stakeInformation,
          oddType: "Win",
        })
      );
    }

    dispatch(clearNumbers());
  };

  const calculateHitsAndWins = (userPicks: number[]) => {
    let rule = odd.odd?.OddMultipliers.filter(
      (rule) => rule.numberLength === userPicks.length
    );

    if (rule && rule?.length < 1) {
      return;
    }

    rule = rule?.sort((a, b) => a.winLength - b.winLength);

    rule ? setOdds([...rule]) : setOdds([]);
  };

  useEffect(() => {
    calculateHitsAndWins(pickedNumbers);

    if (betState.loading) {
      setOdds([]);
    }

    if (pickedNumbers.length < 1) {
      setOdds([]);
    }

    // writeToPrinter();
  }, [pickedNumbers]);
  const [isAddbutton, setIsAddbutton] = useState(true);
  const handleAddandRemove = () => {
    setIsAddbutton(!isAddbutton);
  };
  return (
    <div
      className=""
      style={{
        width: "80%",
        position: "relative",
        left: "10px",
        margin: "0px",
      }}
    >
      <button
        // disabled={!gameState.game || odds.length < 1}
        onClick={clearList}
        className="flex items-center gap-1 bg-rose-400 text-white p-1 pl-3 pr-3 disabled:bg-red-300 ml-5 mb-4 clearAdd"
      >
        CLEAR{" "}
        <span>
          <RiDeleteBin6Line />
        </span>{" "}
      </button>
      {pickedNumbers.length > 0 ? (
        /*gameState.game &&*/ <>
          <button
            style={{ backgroundColor: "#37B34A" }}
            // disabled={currentDate > ticketExpiry}
            onClick={() => {
              addToSlip({
                selected: pickedNumbers,
                multiplier: odds[odds.length - 1].multiplier,
                toWin: odds[odds.length - 1].multiplier,
                expiry: ticketExpiry,
                stake: defaultStake,
                gameId: gameState.game?.gamenumber,
                gameType: gameType,
                stakeInformation: "Win",
              });
              dispatch(removemessage(!removemessage));
            }}
            className="p-1 addtobetButton pl-3 pr-3 text-white text-lg mt-2"
          >
            ADD TO BETSLIP
          </button>

          <div className="slip-container w-64 md:w-68 max-lg:-ml-16 -ml-10 md:-ml-14 mt-3 flex flex-col">
            <div
              className={`slip-head ${
                isAddbutton
                  ? "bg-green-500 text-white"
                  : "border text-green-600 border-t-green-700"
              } flex justify-between text-start font-bold text-lg `}
            >
              HIGHEST PAYOUT {Math.max(...odds.map((item) => item.multiplier))}{" "}
              FROM {pickedNumbers.length}
              <PlusMinus onClick={handleAddandRemove} isActive={isAddbutton} />
            </div>
            {isAddbutton ? (
              <>
                {" "}
                {odds.map((item, index) => {
                  return (
                    <SlipItem
                      selected={item.winLength}
                      maxWin={item.multiplier}
                      key={index}
                    />
                  );
                })}
                <div className="slip-footer pl-10 pr-10 text-black flex justify-between items-center p-1.5">
                  <span>Hits</span>
                  <span>Pays</span>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default TicketSlipHolder;
