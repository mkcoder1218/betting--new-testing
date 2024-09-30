import "./App.css";
import NumberPicker from "./components/NumberPicker";
import CashierHeader from "./components/CashierHeader";
import GameIllustration from "./components/GameIllustration";
import TicketSlipHolder from "./components/TicketSlipHolder";
import TicketSelector from "./components/TicketSelector";
import { useEffect, useRef, useState } from "react";
import CashierOptions from "./components/CashierOptions";
import RedeemTicket from "./components/RedeemTicket";
import BetSlip from "./components/BetSlip";
import { useAppDispatch, useAppSelector } from "./features/hooks";
import { getOdds } from "./features/slices/oddSlice";
import { getLastGame } from "./features/slices/RacingGameSliceMultipleSports";
import { getLastBetSlip } from "./features/slices/betSlip";
import { addGameType } from "./features/slices/gameType";
import { addExpiry } from "./features/slices/ticketExpiry";
import { addRepeat } from "./features/slices/betRepeat";
import { isPrinterUp } from "./features/slices/ticketSlice";
import PrinterDialog from "./components/PrinterDialog";
import { logoutUser } from "./features/slices/userSlice";
import { LOCAL_USER } from "./config/constants";
import moment from "moment";
import DogWithVideo from "./pages/Dog1";
import Bike from "./pages/Bike";
import Gari from "./pages/Garri";
import HorseRun from "./pages/HorseRun";
import HorseJumping from "./pages/HorseJumping";
import DogWithOutVideo from "./pages/DogWithOutVideo";
import Car from "./pages/Car";
import Hockey from "./pages/Hokey";

import Formula1 from "./pages/Formula1";
import {
  GameData,
  getLastRacingGames,
} from "./features/slices/RacingGameSliceMultipleSports";
import Spin from "./pages/Spin";
import TestComponent from "./utils/Tst";
import { useAxiosInterceptors } from "./config/interceptor";
import CircularUnderLoad from "./components/svg/Loader";
function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const oddData = useAppSelector((state) => state.odd);
  // const gameData = useAppSelector((state) => state.game);
  const [printerDialog, setPrinterDialog] = useState(false);
  const [WhichGameSelected, setWhichgameSelected] = useState("SmartPlayKeno");
  const ticketExpiry = useAppSelector((state) => state.expiry);
  const ticketPicker = useAppSelector((state) => state.picker);
  const [open, setOpen] = useState(false);
  const [redeemOpen, setRedeemStatus] = useState(false);
  const [cancelRedeem, setCancelRedeem] = useState("redeem");
  const [lastCheck, setLastCheck] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const gameData = useAppSelector((state) => state.racingGame);
  const handleRedeemOpen = () => setRedeemStatus(true);
  const handleRedeemClose = () => setRedeemStatus(false);
  const handleCancelRedeem = (val: string) => setCancelRedeem(val);
  const [game, setGame] = useState<GameData>();
  const [remainingTime, setRemainingTime] = useState(0);
  const [update, setUpdate] = useState(true);
  useAxiosInterceptors();
  const handlePrintDialogClose = () => {
    setPrinterDialog(true);
  };

  function handleRepeat(event: React.ChangeEvent<HTMLSelectElement>) {
    dispatch(addRepeat({ repeat: parseInt(event.target.value) }));
  }
  useEffect(() => {
    if (WhichGameSelected === "KENO") {
      dispatch(addGameType(WhichGameSelected));
    } else {
      if (WhichGameSelected.length > 0)
        dispatch(addGameType(WhichGameSelected));
      if (
        !gameData.gamesByType[WhichGameSelected] ||
        gameData.gamesByType[WhichGameSelected].games.length < 2
      ) {
        dispatch(
          getLastRacingGames(
            "9c6d610d-33e9-4847-80ab-5e179833591e",
            WhichGameSelected
          )
        );
      }
    }
  }, [WhichGameSelected]);

  useEffect(() => {
    if (
      gameData &&
      WhichGameSelected === "SmartPlayKeno" &&
      gameData.gamesByType[WhichGameSelected] &&
      gameData.gamesByType[WhichGameSelected].games &&
      update
    ) {
      console.log("GamesFiltered", gameData);
      const gamesFiltered = gameData.gamesByType[WhichGameSelected].games
        ?.filter((gamedata) => {
          return moment(gamedata.startTime).diff(moment(), "seconds") > 0;
        })
        .sort((a, b) => {
          return moment(a.startTime).valueOf() - moment(b.startTime).valueOf();
        });
      console.log("GamesFiltered", gamesFiltered.length);

      if (gamesFiltered && gamesFiltered.length > 0) {
        setGame(gamesFiltered[0]);
        setUpdate(false);
      } else {
        dispatch(
          getLastRacingGames(user.user?.Cashier.shopId, "SmartPlayKeno")
        );
      }
    }
  }, [gameData, update]);

  useEffect(() => {
    if (game) {
      const lastUpdatedTime = game
        ? new Date(game.startTime).getTime()
        : new Date().getTime();
      dispatch(addExpiry({ expiry: lastUpdatedTime }));

      if (game && update) {
        const currentDiff =
          new Date().getTime() - new Date(game.startTime).getTime();
        const diffInMinutes = currentDiff / (1000 * 60);

        if (diffInMinutes <= 10) {
          setRemainingTime(
            moment(game.startTime).diff(moment(), "milliseconds")
          );
          dispatch(getLastBetSlip());
        }
      }

      const timer = setInterval(() => {
        setRemainingTime(moment(game.startTime).diff(moment(), "milliseconds"));
        if (lastCheck <= 10) {
          setLastCheck(lastCheck + 1);
        } else {
          // dispatch(getLastGame(user.user?.Cashier.shopId));
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [game, update]);

  useEffect(() => {
    if (remainingTime < 0 && !update) {
      if (game) setUpdate(true);
      // dispatch(getLastGame(user.user?.Cashier.shopId));
    }
  }, [remainingTime]);

  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  function formatTime(minutes: number, seconds: number): string {
    const date = new Date();
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    return date.toLocaleTimeString("en-US", {
      hour12: false,
      timeZone: "UTC", // Adjust timezone as needed
      minute: "2-digit",
      second: "2-digit",
    });
  }

  useEffect(() => {
    dispatch(getOdds(user.user?.Cashier.shopId));
  }, []);

  const checkStatus = async () => {
    const checkPrinter = await isPrinterUp();
    console.log("CHECKING_PRINTER", checkPrinter);
    setPrinterDialog(checkPrinter);
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    //check printer status to prevent ticket creation if printer is not running
    checkStatus();
  }, []);

  const logoutAuto = () => {
    localStorage.removeItem(LOCAL_USER);
    window.location.replace("/");
  };

  const timerRef = useRef<any>(null);

  useEffect(() => {
    const handleUserActivity = () => {
      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        logoutAuto();
      }, 20 * 60 * 1000);
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("click", handleUserActivity);

    handleUserActivity();

    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
    };
  }, []);

  const handleIconSelect = (val: string) => {
    setWhichgameSelected(val);
  };

  return (
    <div className="bg-white fixed w-full h-full custom-scrollbar overflow-y-auto">
      <PrinterDialog
        open={!printerDialog}
        handleClose={handlePrintDialogClose}
        logout={logout}
      />
      <CashierOptions open={open} handleClose={handleClose} />
      <RedeemTicket
        open={redeemOpen}
        handleClose={handleRedeemClose}
        type={cancelRedeem}
      />
      <CashierHeader
        handleOpen={handleOpen}
        handleRedeemOpen={handleRedeemOpen}
        handleCancelRedeem={handleCancelRedeem}
      />
      {gameData &&
        (!gameData.gamesByType[WhichGameSelected] ||
          gameData.gamesByType[WhichGameSelected].loading) && (
          <div
            className="w-full h-full bg-gray-100 z-20 absolute  flex justify-center"
            style={{ opacity: 0.5 }}
          >
            <CircularUnderLoad />
          </div>
        )}
      <div
        className="flex items-start justify-between h-full custom-scrollbar overflow-y-auto"
        style={{ scrollBehavior: "smooth" }}
      >
        <div
          className="left flex overflow-x-hidden flex-col"
          style={{ width: "80%" }}
        >
          <GameIllustration WhichGame={handleIconSelect} />
          {WhichGameSelected === "SmartPlayKeno" ? (
            <>
              {" "}
              <div className="next-draw flex mt-4  ml-7">
                {game && remainingTime > 0 ? (
                  <div
                    className=" font-bold text-md p-1 h-fit flex items-center"
                    style={{
                      backgroundColor: "#f00",
                      borderTopLeftRadius: 4,
                      borderBottomLeftRadius: 4,
                      color: "white",
                      opacity: 1,
                    }}
                  >
                    NEXT DRAW{" "}
                    <span className=" font-bold ml-2" style={{ color: "#ff0" }}>
                      {formatTime(minutes, seconds)}
                    </span>
                  </div>
                ) : (
                  <div
                    className="bg-red-500 text-sm flex font-bold items-center"
                    style={{
                      borderTopLeftRadius: 4,
                      borderBottomLeftRadius: 4,
                      color: "white",
                      opacity: 1,
                    }}
                  >
                    NEXT DRAW{" "}
                    <span className="font-bold text-amber-500 ml-4">
                      {"00"}:{"00"}
                    </span>
                  </div>
                )}
                <div
                  className="text-md p-1 h-fit font-bold"
                  style={{
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4,
                    color: "white",
                    opacity: 1,
                    backgroundColor: "rgba(22 163 74 )",
                  }}
                >
                  REPEAT{" "}
                  <span className="text-black rounded-md bg-gray-400">
                    <select onChange={handleRepeat}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
                        return (
                          <option
                            key={index}
                            className="bg-gray-500 text-white"
                          >
                            {item}
                          </option>
                        );
                      })}
                    </select>
                  </span>
                </div>
              </div>
              <div className="picker-container flex justify-stretch items-start ml-7">
                <div className="picker-left basis-full">
                  <TicketSelector
                    gameType={WhichGameSelected}
                    gameData={game}
                  />
                  <div
                    className={`${
                      gameData.loading ? "hidden" : "visible"
                    }number-picker mt-4 w-full`}
                  >
                    <NumberPicker />
                  </div>
                </div>
                <div
                  className="flex flex-col gap-4 items-start mt-2"
                  style={{ flexBasis: "38%" }}
                >
                  {game && (
                    <TicketSlipHolder
                      gameType={"SmartPlayKeno"}
                      gameData={game}
                      update={update}
                    />
                  )}
                  <div
                    className="w-4/5 speech left mt-20 max-lg:w-full"
                    style={{
                      visibility:
                        ticketPicker.selected.length < 1 ? "visible" : "hidden",
                    }}
                  >
                    Pick 1 to 10 numbers from 80. Pick numbers which you think
                    randomly will be selected. The more you pick the more you
                    could win.
                  </div>
                </div>
              </div>
            </>
          ) : WhichGameSelected === "SpinAndWin" ? (
            <Spin />
          ) : (
            <HorseRun gameType={WhichGameSelected} />
          )}
        </div>
        <BetSlip />
      </div>
    </div>
  );
}

export default App;
