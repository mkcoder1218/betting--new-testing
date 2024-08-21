import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  Ticket,
  clearBetSlip,
  clearNumbers,
  incrBetSlipItem,
  removeFromBetSlip,
  updateBetSlipItem,
  updateStakeForAllTickets,
} from "../features/slices/pickerSlice";
import {
  createBetSlipAndTicket,
  getLastBetSlip,
} from "../features/slices/betSlip";
import "../styles/icon.css";
import ProgressCircular from "./ProgressCircular";
import FormStatus from "./FormStatus";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { BsCheck2All } from "react-icons/bs";
import PriceButton from "./PriceButton";
import { isPrinterUp } from "../features/slices/ticketSlice";
import PrinterDialog from "./PrinterDialog";
import { logoutUser } from "../features/slices/userSlice";
import Tickets from "../ui/Ticket";
import { CarRacing } from "./svg/CarRacing";
import { SmartPlay } from "./svg/SmartPlay";
import { Garri } from "./svg/Garri";
import { Jaguar } from "./svg/Jaguar";
import { DashingDerby } from "./svg/DashingDerby";
import { Bicycle } from "./svg/Bicycle";
import { HorseJump } from "./svg/HorseJump";
import { DogWithVideo } from "./svg/DogWithVideo";
import { CircleDraw } from "./svg/CircleDraw";
import Hockey from "./svg/Hockey";
import {
  addGameType,
  ClearSelected,
  removemessage,
  setIsClearCircle,
} from "../features/slices/gameType";
import moment from "moment";

export default function BetSlip() {
  const dispatch = useAppDispatch();
  const betState = useAppSelector((state) => state.picker);
  const gameState = useAppSelector((state) => state.game);
  const userState = useAppSelector((state) => state.user);
  const oddState = useAppSelector((state) => state.odd);
  const betSlipState = useAppSelector((state) => state.betSlip);
  const [statusVisible, setStatusVisible] = useState(false);
  const currentDate = new Date().getTime();
  const [expired, setExpired] = useState(false);
  const [stakeInput, setStake] = useState<number[]>([]);
  const [totalStake, setTotalStake] = useState(10);
  const [selected, setSelected] = useState(-1);
  const [printerDialog, setPrinterDialog] = useState(false);
  const [errorBet, setBetError] = useState("");
  const balance = useAppSelector((state) => state.balance);
  const gameType = useAppSelector((state) => state.gameType.gameType);
  const removemessages = useAppSelector(
    (state) => state.gameType.removemessage
  );
  const handleClose = () => {
    setPrinterDialog(false);
  };

  const [removebetsucess, setremovebetsucess] = useState(false);
  const handleTotalStake = (val: number, type: string) => {
    if (val <= 5000) {
      if (type === "inc") {
        totalStake >= 10 && setTotalStake((prevStake) => prevStake + val);
      } else if (type === "dec") {
        setTotalStake((prevStake) => Math.max(0, prevStake + val)); // Ensure the stake doesn't go below 0
      } else if (type === "add") {
        setTotalStake(val);
      }

      updateStakeAll(val, type);
    }
  };

  useEffect(() => {
    setSelected(-1);
  }, [betState.selected]);

  // useEffect(() => {
  //     const totalStakeVal = betState.betSlip.reduce((a, b) => a + b.stake, 0) / betState.betSlip.length;
  //     setTotalStake(totalStakeVal);
  // }, [totalStake])

  useEffect(() => {
    let newStake = betState.betSlip.map((item) => item.stake);
    setStake(newStake);
  }, [betState.betSlip]);

  // Check every second for the expiry of the current game and clear from betslip if it did. And try to fetch the last game every 5 seconds if no game exists currently
  useEffect(() => {
    const timer = setInterval(() => {
      let hasAllBetsExpired = true;
      for (let ticket of betState.betSlip) {
        console.log("TIMER_UPDATE", currentDate > ticket.expiry);
        if (ticket.expiry - new Date().getTime() > 0) {
          hasAllBetsExpired = false;
        }
        if (hasAllBetsExpired) {
          setExpired(true);
        }
      }
    }, 1000);

    if (expired) {
      setExpired(false);
      setTimeout(() => {
        clearSlip();
        setBetError("");
      }, 2000);
    }
    return () => clearInterval(timer);
  }, []);

  const toggleStatus = (val: boolean) => {
    setStatusVisible(val);
  };

  const removeItemFromSlip = (item: number) => {
    dispatch(removeFromBetSlip(item));
  };

  const changeIndividualSlipStake = (index: number, stake: number) => {
    dispatch(updateBetSlipItem({ index, changes: { stake: stake } }));
  };

  const changeIndividualSlipStakeIncr = (index: number, stake: number) => {
    dispatch(incrBetSlipItem({ index, changes: { stake: stake } }));
  };

  const updateStakeAll = (stake: number, type: string) => {
    dispatch(updateStakeForAllTickets({ value: stake, type: type }));
  };

  const clearSlip = () => {
    dispatch(clearBetSlip());
    dispatch(clearNumbers());
    dispatch(setIsClearCircle(true));
    setBetError("");
    console.log("gametype,", gameType);
  };

  const handleCreateTicket = async () => {
    setBetError("");
    dispatch(setIsClearCircle(true));
    dispatch(ClearSelected(true));
    dispatch(removemessage(true));
    const getBiggest = betState.betSlip.filter(
      (item) => item.stake > 1000 || item.stake * item.multiplier <= 50000
    );
    const findExpired = betState.betSlip.findIndex((ticket) => {
      return ticket.expiry - new Date().getTime() < 0;
    });
    if (findExpired > -1) {
      setBetError("One or More Bets Expired");
      return;
    }

    if (getBiggest.length > 0) {
      const biggetsFirst = getBiggest[0].stake;
      if (biggetsFirst > 1000) {
        setBetError(
          "The stake on one or more of your bets is not within the allowed betting limits"
        );
        return;
      }
    }
    if (betState.totalToWin > 900000) {
      setBetError(
        "The stake on one or more of your bets is not within the allowed betting limits"
      );
      return;
    }

    const checkPrinter = await isPrinterUp();

    if (checkPrinter) {
      setPrinterDialog(checkPrinter);
      // return;
    }

    refreshBetSlipNumber();

    let newTicketToSend = [];
    const otherGameData: any = [];
    let minWin = 0;
    for (let ticket of betState.betSlip) {
      otherGameData.push(ticket.selected);
      console.log("SpinData:", ticket);
      let ticketItem = {
        toWin: Math.floor(ticket.toWin),
        stake: ticket.stake,
        maxWin: Math.floor(ticket.multiplier * ticket.stake),
        nums:
          ticket.gameType === "SmartPlayKeno" ||
          ticket.gameType === "SpinAndWin"
            ? ticket.selected
            : [ticket.selected],
        gameId: ticket.gameId + "",
        oddId: oddState.odd?.id,
        isCombo: ticket.isCombo,
        oddType: ticket.oddType ? ticket.oddType : "",
        entry: ticket.entry,
        nameOfplayer: ticket.nameofPlayer,
        gameType: ticket.gameType,
        gameNumber: ticket.gameNumber,
      };
      console.log("TIcketas:", ticketItem);
      newTicketToSend.push(ticketItem);
      let _ticket_min;
      if (
        ticket.gameType === "SmartPlayKeno" ||
        ticket.gameType === "SpinAndWin"
      ) {
        _ticket_min = Math.min(...newTicketToSend.map((item) => item.stake));
      } else {
        _ticket_min = Math.min(
          ...newTicketToSend
            .filter(
              (_ticket) =>
                _ticket.gameType !== "SmartPlayKeno" &&
                _ticket.gameType !== "SpinAndWin"
            )
            .map((item) => {
              console.log("_MIN_WIN", item);
              return item.oddType === "WIN"
                ? item.stake * item.entry?.WinOdds
                : item.stake * item.entry?.PlaceOdds;
            })
        );
      }
      if (minWin === 0) {
        minWin = _ticket_min;
      } else if (_ticket_min < minWin) {
        minWin = _ticket_min;
      }
    }

    // const minWin = Math.min(...newTicketToSend.map((item) => item.stake));

    const maxWin = newTicketToSend.reduce((a, b) => a + b.maxWin, 0);

    const requestPayload = {
      minWin: minWin,
      maxWin: betState.totalToWin,
      cashierCreateId: userState.user?.Cashier.id,
      shopId: userState.user?.Cashier.shopId,
      ticketData: newTicketToSend,
    };

    // return;
    dispatch(
      createBetSlipAndTicket(
        requestPayload,
        refreshBetSlipNumber,
        clearSlip,
        toggleStatus,
        clearNumberSelection,
        removebetsucess
      )
    );
  };

  const clearNumberSelection = () => {
    dispatch(clearNumbers());
  };

  const refreshBetSlipNumber = () => {
    dispatch(getLastBetSlip());
  };

  const changeItemStake = (a: number, b: number) => {
    let newCopyStake = [...stakeInput];
    newCopyStake[b] = a;
    setStake(newCopyStake);

    if (a >= 1 && a <= 5000) {
      changeIndividualSlipStake(b, a);
    }
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="w-28p right containerBetslip relative ml-2 max-lg:w-1/4 flex items-center justify-center flex-col drop-shadow-md">
      <PrinterDialog
        open={printerDialog}
        handleClose={handleClose}
        logout={logout}
      />
      <div className="font-thin text-green-600 mt-3 flex items-center justify-center text-center">
        Betslip
      </div>

      <div
        className="right-slip-content w-full flex flex-col items-center mt-2 overflow-y-auto"

      >
        <div className="slip-right-head mb-2 flex items-center justify-center bg-green-500 rounded-sm p-1">
          <div className="left cursor-pointer bg-green-500 pr-3 pl-4 text-xs text-white rounded-sm">
            SINGLE
          </div>
          <div className="left cursor-pointer bg-white pr-3 pl-4 text-xs text-gray-500 rounded-sm">
            MULTIPLES
          </div>
        </div>
        {/* <Tickets Icon={CarRacing} isSmall={true} /> */}
        {betState.betSlip.length < 1 && (
          <div className={`text-center mt-2 mb-2 text-gray-400 text-md`}>
            Add more bets
          </div>
        )}

        {!betSlipState.loading && betSlipState.error && (
          <FormStatus type="error" content={betSlipState.error} />
        )}
        {!betSlipState.loading && betSlipState.message && removemessages && (
          <FormStatus type="success" content={betSlipState.message} />
        )}

        {currentDate > betState?.betSlip[0]?.expiry && (
          <div className="p-1 w-full flex items-center justify-between mt-2 text-center text-s bg-red-400 text-white">
            <p className="ml-3">Expired Bets</p>
            <BsCheck2All className="mr-3" size={24} />
          </div>
        )}
        <div className="overflow-y-auto" style={{maxHeight:'400px',width:'100%'}}>
          {betState.betSlip.map((item, index) => {
            return (
              <>
                {" "}
                <div
                  onClick={() => setSelected(index)}
                  style={{
                    backgroundColor: `${
                      currentDate > item.expiry ? "#fc4242" : "#969696"
                    }`,
                    width: "100%",
                    borderRadius: "3px",
                  }}
                  key={index}
                  className={`selected-nums-con -ml-1 mt-1 text-white font-bold`}
                >
                  <div className="ml-2 flex justify-between items-center">
                    <div className="flex gap-1 items-center -mt-4">
                      <div className="icon-container">
                        {item.gameType === "SmartPlayKeno" ? (
                          <SmartPlay isSmall={true} />
                        ) : item.gameType === "HarnessRacing" ? (
                          <Garri isSmall={true} />
                        ) : item.gameType === "MotorRacing" ? (
                          <CarRacing isSmall={true} />
                        ) : item.gameType === "PlatinumHounds" ? (
                          <Jaguar isSmall={true} />
                        ) : item.gameType === "DashingDerby" ? (
                          <DashingDerby isSmall={true} />
                        ) : item.gameType === "CycleRacing" ? (
                          <Bicycle isSmall={true} />
                        ) : item.gameType === "SteepleChase" ? (
                          <HorseJump isSmall={true} />
                        ) : item.gameType === "PreRecRealDogs" ? (
                          <DogWithVideo isSmall={true} />
                        ) : gameType === "SpinAndWin" ? (
                          <CircleDraw />
                        ) : gameType === "SpeedSkating" ? (
                          <Hockey />
                        ) : (
                          ""
                        )}
                      </div>
                      <p className="text-xs flex items-center -mb-5">
                        {item.stakeInformation?.split(" ")[0] === "Neighbors"
                          ? item.stakeInformation.split(" ")[0]
                          : item.oddType === "Heads" ||
                            item.oddType === "Tails" ||
                            item.oddType === "Evens"
                          ? "Head and Tails"
                          : item.stakeInformation}
                      </p>
                    </div>
                    <span
                      onClick={() => removeItemFromSlip(index)}
                      className="h-2 flex items-center justify-center w-4 border text-md text-gray-700 border-none font-bold cursor-pointer"
                    >
                      X
                    </span>
                  </div>
                  <div className="flex">
                    <p
                      className="flex gap-1 ml-7 "
                      style={{ paddingTop: "-20px", fontSize: 13 }}
                    >
                      <p>
                        {item.draw}
                        {!item.isCombo &&
                        item.gameType !== "SmartPlayKeno" &&
                        item.gameType !== "SpinAndWin" &&
                        item.stakeInformation?.split(" ")[0] !== "Neighbors" &&
                        item.stakeInformation !== "Selector(color)"
                          ? "."
                          : ""}
                      </p>
                      {item.oddType === "Heads"
                        ? "Heads"
                        : item.oddType === "Tails"
                        ? "Tails"
                        : item.oddType === "Evens"
                        ? "Even"
                        : item.gameType === "SmartPlayKeno"
                        ? item.selected.join(", ")
                        : gameType === "SpinAndWin" &&
                          item.selected.length > 0 &&
                          item.stakeInformation === "Selector(color)"
                        ? item.selected.join("/")
                        : item.oddType === "Column"
                        ? "2 to 1"
                        : item.oddType === "Dozens1"
                        ? "1st 12"
                        : item.oddType === "Dozens2"
                        ? "2nd 12"
                        : item.oddType === "Dozens3"
                        ? "3rd 12"
                        : item.oddType === "High/low1"
                        ? "1-18"
                        : item.oddType === "High/low2"
                        ? "19-36"
                        : item.oddType === "Even/odd1"
                        ? "Even"
                        : item.oddType === "Even/odd2"
                        ? "Odd"
                        : item.oddType === "Color1"
                        ? "Red"
                        : item.oddType === "Color2"
                        ? "Black"
                        : item.stakeInformation?.split(" ")[0] === "Neighbors"
                        ? item.selected.join("/")
                        : item.selected.length === 0 || item.oddType === "Win"
                        ? item.selected
                        : item.nameofPlayer}
                      {!item.isCombo ? (
                        <span
                          className={`${"bg-green-700 border-2 border-green-400 h-3 mt-1 flex items-center justify-center"} p-1 text-white text-xs`}
                        >
                          {!item.isCombo ? item.multiplier : "[1-2]"}
                        </span>
                      ) : (
                        ""
                      )}
                    </p>
                  </div>
                  <p className="ml-8 mr-8 text-xs">
                    {`${new Date(item.expiry).getFullYear()}/${
                      new Date(item.expiry).getMonth() + 1
                    }/${new Date(item.expiry).getDate()}`}{" "}
                    {new Date(item.expiry).toLocaleTimeString("en-US", {
                      hourCycle: "h24",
                    })}{" "}
                    ID|{item.gameNumber}
                  </p>
                  {item.isCombo ? (
                    <div className="flex gap-1 items-center -mt-1 ml-7">
                      <p className="" style={{ fontSize: 13 }}>
                        [1-2]
                      </p>
                      <p
                        className="bg-green-700 text-sm border-2 border-green-500 h-3 flex items-center justify-center"
                        style={{ fontSize: 12 }}
                      >
                        2.21 (min)
                      </p>
                      <p className="" style={{ fontSize: 13 }}>
                        [3-4]
                      </p>
                      <p
                        className="bg-green-700 text-sm border-2 border-green-500 h-3 flex items-center justify-center"
                        style={{ fontSize: 12 }}
                      >
                        1(max)
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                  {
                    /*currentDate < betState.betSlip[0].expiry &&*/ <>
                      <div
                        className={`ml-8 ${
                          stakeInput[index] > 1000 ||
                          item.stake * item.multiplier > 50000
                            ? "bg-red-600 text-white"
                            : "bg-white"
                        } mr-8 inc-dec mt-1 flex items-center justify-between flex-shrink-0`}
                      >
                        <div
                          className="hover:bg-gray-400 h-6 flex items-center justify-center w-6"
                          style={{ backgroundColor: "#C7C7C7" }}
                        >
                          <FaMinus
                            onClick={() =>
                              changeIndividualSlipStake(
                                index,
                                item.stake >= 20 ? item.stake - 10 : 10
                              )
                            }
                            className="text-white cursor-pointer transition-all h-4 w-4 justify-center dec font-bold rounded-sm flex items-center text-sm"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            className={`num input-picker ${
                              (stakeInput[index] > 1000 ||
                                item.stake * item.multiplier > 50000) &&
                              "bg-red-600 text-white"
                            } text-gray-500 text-end border-none focus:border-none active:border-none`}
                            value={stakeInput[index]}
                            defaultValue={10}
                            onChange={(e) =>
                              parseInt(e.target.value) <= 5000 &&
                              parseInt(e.target.value) >= 1 &&
                              changeItemStake(parseInt(e.target.value), index)
                            }
                            type="number"
                            style={{
                              border: "none",
                            }}
                            max={5000}
                            min={1}
                            required
                          />
                          <div
                            className={`mr-2 ${
                              stakeInput[index] > 1000 ||
                              item.stake * item.multiplier > 50000
                                ? "text-white"
                                : "text-gray-500"
                            }`}
                          >
                            .00
                          </div>
                          <div
                            className="hover:bg-gray-400 h-6 flex items-center justify-center w-6"
                            style={{ backgroundColor: "#C7C7C7" }}
                          >
                            <FaPlus
                              onClick={() =>
                                changeIndividualSlipStake(
                                  index,
                                  item.stake + 10
                                )
                              }
                              className="text-white cursor-pointer transition-all h-4 w-4 justify-center inc font-bold rounded-sm flex items-center text-sm roun"
                            />
                          </div>
                        </div>
                      </div>
                      {!item.isCombo ? (
                        <p
                          className={`ml-8 mr-8 text-white text-xs text-right mt-1`}
                        >
                          TO WIN Br. {(item.stake * item.multiplier).toFixed(2)}
                        </p>
                      ) : (
                        <p className="ml-8 mr-8 text-white text-xs text-right mt-1"></p>
                      )}
                    </>
                  }
                  {selected === index && (
                    /*currentDate < betState.betSlip[index].expiry && */ <PriceButton
                      index={index}
                      changeIndividualStake={changeIndividualSlipStakeIncr}
                    />
                  )}
                </div>
              </>
            );
          })}
        </div>

        {betState.betSlip.length > 0 && (
          /*currentDate <= betState.betSlip[0].expiry && */ <>
            <div className="btn-container-bet w-full p-1 flex gap-2 justify-stretch items-center">
              <button
                style={{ backgroundColor: "#C9580F" }}
                onClick={() => updateStakeAll(10, "inc")}
                className="hover:opacity-75 transition-all flex-grow rounded-md flex p-2 text-center text-white"
              >
                <sup className="text-sm self-start">Br.</sup>
                <span className="self-center mt-1">10</span>
              </button>
              <button
                style={{ backgroundColor: "#C93362" }}
                onClick={() => updateStakeAll(20, "inc")}
                className="hover:opacity-75 transition-all flex-grow p-2 rounded-md flex text-center text-white"
              >
                <sup className="text-sm self-start">Br.</sup>
                <span className="self-center mt-1">20</span>
              </button>
              <button
                style={{ backgroundColor: "#8830AD" }}
                onClick={() => updateStakeAll(50, "inc")}
                className="hover:opacity-75 transition-all flex-grow p-2 rounded-md flex text-center text-white"
              >
                <sup className="text-sm self-start">Br.</sup>
                <span className="self-center mt-1">50</span>
              </button>
              <button
                style={{ backgroundColor: "#5A95F0" }}
                onClick={() => updateStakeAll(100, "inc")}
                className="hover:opacity-75 transition-all flex-grow p-2 rounded-md flex text-center text-white"
              >
                <sup className="text-sm self-start">Br.</sup>
                <span className="self-center mt-1">100</span>
              </button>
              <button
                style={{ backgroundColor: "#688A37" }}
                onClick={() => updateStakeAll(150, "inc")}
                className="hover:opacity-75 transition-all flex-grow p-2 rounded-md flex text-center text-white"
              >
                <sup className="text-sm self-start">Br.</sup>
                <span className="self-center mt-1">150</span>
              </button>
            </div>

            {betState.betSlip && betState.betSlip.length > 1 && (
              <>
                <p className="text-left w-3/4 mr-4">STAKE</p>
                <div className="inc-dec w-3/4 mr-4 mt-1 mb-2 flex bg-white items-center justify-between flex-shrink-0">
                  <FaMinus
                    style={{ backgroundColor: "#C7C7C7" }}
                    onClick={() => handleTotalStake(-10, "inc")}
                    className="text-white hover:bg-gray-400 cursor-pointer transition-all h-6 w-6 justify-center dec font-bold rounded-sm flex items-center text-3xl"
                  />
                  <div className="flex items-center">
                    <input
                      className="num input-picker text-gray-500 text-end border-none focus:border-none active:border-none"
                      type="number"
                      value={totalStake}
                      onChange={(e) =>
                        parseInt(e.target.value) > 9 &&
                        handleTotalStake(parseInt(e.target.value), "add")
                      }
                    />
                    <div className="mr-2">.00</div>
                    <FaPlus
                      style={{ backgroundColor: "#C7C7C7" }}
                      onClick={() => handleTotalStake(10, "inc")}
                      className="text-white hover:bg-gray-400 cursor-pointer transition-all h-6 w-6 justify-center inc font-bold rounded-sm flex items-center text-4xl"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="amounts w-full p-1 text-black">
              <div className="text-lg font-medium text-gray-500 mt-1 flex justify-between items-center">
                <p>TOTAL STAKE</p>
                <p>{betState.totalStake}.00 BR</p>
              </div>
              <div className="text-lg font-medium text-gray-500 mt-1 flex justify-between items-center">
                <p>TOTAL "TO WIN"</p>
                <p>{Math.floor(betState.totalToWin)}.00 BR</p>
              </div>
            </div>

            {errorBet !== "" && (
              <div
                style={{ width: "98%", margin: "auto" }}
                className="p-1 text-center text-sm bg-red-700 text-white"
              >
                {errorBet}
              </div>
            )}

            {betSlipState.loading && <ProgressCircular />}
          </>
        )}

        <div className="confirm-cancel mb-4 w-full gap-1 text-white mt-2 flex justify-between items-center">
          <button
            disabled={
              betState.betSlip.length < 1
              /*currentDate > betState.betSlip[0].expiry*/
            }
            onClick={clearSlip}
            className=" disabled:bg-red-200 p-4 flex-grow hover:opacity-75 transition-opacity bg-red-500"
          >
            CLEAR
          </button>
          <button
            disabled={
              betState.betSlip.length < 1
              /* currentDate > betState.betSlip[0].expiry*/
            }
            onClick={handleCreateTicket}
            className={` disabled:bg-green-300 p-3 flex items-center justify-center gap-2 flex-grow hover:opacity-75 transition-opacity basis-2/3 ${
              betState.betSlip.length > 0 ? "bg-green-500" : "bg-green-200"
            }`}
          >
            <p>PLACE BET</p>
            <p className="bg-green-300 p-1">
              {betState.betSlip.length > 0
                ? "BR " + betState.totalStake + ".00"
                : 0}
            </p>
          </button>
        </div>
        {balance.data &&
          balance.data.length > 0 &&
          parseInt(balance.data[0].creditAmount) < 2000 && (
            <div
              style={{
                height: 30,
                backgroundColor: "red",
                color: "white",
                width: "100%",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 12,
              }}
            >
              Low Credit Balance Warning. Balance:
              {balance.data[0].creditAmount}.00 Br
            </div>
          )}
      </div>
    </div>
  );
}
