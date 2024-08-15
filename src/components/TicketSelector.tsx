import { FaShuffle } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  Ticket,
  addRandomNumbers,
  addToBetSlip,
  removeFromBetSlip,
} from "../features/slices/pickerSlice";
import React, { FormEvent, useState } from "react";
import { defaultStake } from "../config/constants";
interface TicketSelectorProp {
  gameType: string;
}
const TicketSelector: React.FC<TicketSelectorProp> = ({ gameType }) => {
  const dispatch = useAppDispatch();
  const ticketExpiry = useAppSelector((state) => state.expiry.expiry);
  const currentDate = new Date().getTime();
  const [heads, setHeads] = useState(false);
  const [tails, setTails] = useState(false);
  const [evens, setEvens] = useState(false);
  const pickedNumbers = useAppSelector((state) => state.picker.selected);
  const betSlip = useAppSelector((state) => state.picker.betSlip);
  const betState = useAppSelector((state) => state.betSlip);
  const gameState = useAppSelector((state) => state.game);
  const gameCreatedDate = gameState.game && new Date(gameState.game?.createdAt);
  const expiryOfGame = gameCreatedDate?.setMinutes(
    gameCreatedDate.getMinutes() + 5
  );
  const [count, setCount] = useState(0);

  const clearHeadTail = () => {
    setHeads(false);
    setEvens(false);
    setTails(false);
  };

  const addToSlip = ({
    selected,
    multiplier,
    toWin,
    stake,
    gameId,
    gameType,
    expiry,
  }: Ticket) => {
    if (currentDate > ticketExpiry) {
      return;
    }

    dispatch(
      addToBetSlip({
        selected: selected,
        expiry: expiry,
        multiplier,
        toWin,
        stake,
        gameId,
        gameType,
        oddType: "Win",
      })
    );
  };

  const addHeads = (val: boolean) => {
    if (currentDate > ticketExpiry) return;
    setHeads(val);
    const selected = [-2];

    if (!val) {
      for (let item of betSlip) {
        if (item.selected[0] === -2) {
          dispatch(removeFromBetSlip(betSlip.indexOf(item)));
          return;
        }
      }
    } else {
      addToSlip({
        selected,
        multiplier: 2,
        toWin: 2,
        stake: defaultStake,
        expiry: ticketExpiry,
        gameId: gameState.game?.gamenumber,
        oddType: "Heads",
      });
    }
  };

  const addEvens = (val: boolean) => {
    if (currentDate > ticketExpiry) return;
    setEvens(val);
    const selected = [-4];

    if (!val) {
      for (let item of betSlip) {
        if (item.selected[0] === -4) {
          dispatch(removeFromBetSlip(betSlip.indexOf(item)));
          return;
        }
      }
    } else {
      addToSlip({
        selected,
        multiplier: 4,
        toWin: 4,
        stake: defaultStake,
        expiry: ticketExpiry,
        gameId: gameState.game?.gamenumber,
        oddType: "Evens",
      });
    }
  };

  const addTails = (val: boolean) => {
    if (currentDate > ticketExpiry) return;
    setTails(val);
    const selected = [-6];

    if (!val) {
      for (let item of betSlip) {
        if (item.selected[0] === -6) {
          dispatch(removeFromBetSlip(betSlip.indexOf(item)));
          return;
        }
      }
    } else {
      addToSlip({
        selected,
        multiplier: 2,
        toWin: 2,
        stake: defaultStake,
        expiry: ticketExpiry,
        gameId: gameState.game?.gamenumber,
        oddType: "Tails",
      });
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(event.target.value);
    setCount(count);
    generateRandomSelections(count);
  };

  const generateRandomSelections = (count: number) => {
    if (currentDate > ticketExpiry) return;
    const selections = [];
    const numbers = Array.from({ length: 80 }, (_, i) => i + 1);

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      selections.push(numbers[randomIndex]);
      numbers.splice(randomIndex, 1);
    }

    dispatch(addRandomNumbers(selections));
  };

  return (
    <div className="flex items-center content-center mt-2 gap-1 w-full">
      <div
        style={{ backgroundColor: "#008000" }}
        className="text-sm p-2 rounded-sm flex font-bold items-center gap-2 max-h-8 text-white"
      >
        <div className="flex gap-1 font-lg">
          <p className="text-lg">QUICK</p> <p className="text-lg">PICK</p>
        </div>
        <span className="text-black rounded-sm bg-gray-400">
          <select onChange={handleSelectChange}>
            {["", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
              return (
                <option key={index} className="bg-gray-500 text-white">
                  {item}
                </option>
              );
            })}
          </select>
        </span>
        <span
          onClick={() => generateRandomSelections(count)}
          className="cursor-pointer flex items-center"
        >
          <p>|</p>
          <FaShuffle className="" style={{ fontSize: 18 }} />
        </span>
      </div>
      <div
        style={{
          backgroundColor: `${!heads ? "#BC4307" : "#008000"}`,
        }}
        onClick={() => addHeads(!heads)}
        className={`head-tail cursor-pointer ml-3 transition-all flex font-bold p-1 max-h-8 text-md rounded-sm text-white`}
      >
        HEADS
        <span className="text-black head-tail-sub text-lg flex items-center border border-green-500 font-bold p-1 pl-6 pr-6 ml-20 bg-amber-200 rounded-sm">
          2
        </span>
      </div>
      <div
        style={{
          backgroundColor: evens ? "#257832" : "#f87171",
        }}
        onClick={() => addEvens(!evens)}
        className={`head-tail cursor-pointer transition-all flex font-bold p-1 max-h-8 text-md rounded-sm text-white`}
      >
        EVENS
        <span className="text-black head-tail-sub text-lg text-center flex items-center border border-green-500 font-bold p-0.5 pl-6 pr-6 ml-20 bg-amber-200 rounded-sm">
          4
        </span>
      </div>
      <div
        style={{
          backgroundColor: `${!tails ? "#D75D1A" : "#008000"}`,
        }}
        onClick={() => addTails(!tails)}
        className={`head-tail cursor-pointer transition-all flex font-bold p-1 max-h-8 text-md rounded-sm text-white`}
      >
        TAILS
        <span className="text-black head-tail-sub text-lg text-center flex items-center border border-green-500 font-bold p-0.5 pl-6 pr-6 ml-20 bg-amber-200 rounded-sm">
          2
        </span>
      </div>
    </div>
  );
};

export default TicketSelector;
