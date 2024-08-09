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
import { getLastGame } from "./features/slices/gameSlice";
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
import { getLastRacingGames } from "./features/slices/RacingGameSlice";
import Spin from "./pages/Spin";
import TestComponent from "./utils/Tst";
function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const oddData = useAppSelector((state) => state.odd);
  const gameData = useAppSelector((state) => state.game);
  const [printerDialog, setPrinterDialog] = useState(false);
  const [WhichGameSelected, setWhichgameSelected] = useState("KENO");
  const ticketExpiry = useAppSelector((state) => state.expiry);
  const ticketPicker = useAppSelector((state) => state.picker);
  const [open, setOpen] = useState(false);
  const [redeemOpen, setRedeemStatus] = useState(false);
  const [cancelRedeem, setCancelRedeem] = useState("redeem");
  const [lastCheck, setLastCheck] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRedeemOpen = () => setRedeemStatus(true);
  const handleRedeemClose = () => setRedeemStatus(false);
  const handleCancelRedeem = (val: string) => setCancelRedeem(val);

  const [remainingTime, setRemainingTime] = useState(0);

  const handlePrintDialogClose = () => {
    setPrinterDialog(false);
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
      dispatch(
        getLastRacingGames(
          "9c6d610d-33e9-4847-80ab-5e179833591e",
          WhichGameSelected
        )
      );
    }
  }, [WhichGameSelected]);
  function calculateRemainingTime() {
    const lastUpdatedTime = gameData.game?.startTime
      ? new Date(gameData.game.startTime).getTime()
      : new Date().getTime();
    const targetTime = lastUpdatedTime;
    const currentTime = new Date().getTime();
    const difference = targetTime - currentTime;

    return difference > 0 ? difference : 0;
  }

  useEffect(() => {
    const lastUpdatedTime = gameData.game?.startTime
      ? new Date(gameData.game.startTime).getTime()
      : new Date().getTime();
    dispatch(addExpiry({ expiry: lastUpdatedTime }));

    if (gameData.game) {
      const currentDiff =
        new Date().getTime() - new Date(gameData.game?.startTime).getTime();
      const diffInMinutes = currentDiff / (1000 * 60);

      if (diffInMinutes <= 10) {
        setRemainingTime(
          moment(gameData.game?.startTime).diff(moment(), "milliseconds")
        );
        dispatch(getLastBetSlip());
      }
    }

    const timer = setInterval(() => {
      setRemainingTime(
        moment(gameData.game?.startTime).diff(moment(), "milliseconds")
      );
      if (lastCheck <= 10) {
        setLastCheck(lastCheck + 1);
      } else {
        dispatch(getLastGame(user.user?.Cashier.shopId));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameData]);

  useEffect(() => {
    if (remainingTime <= 0) {
      dispatch(getLastGame(user.user?.Cashier.shopId));
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

    if (remainingTime === 0) {
      dispatch(getLastGame(user.user?.Cashier.shopId));
    }
  }, []);

  const checkStatus = async () => {
    const checkPrinter = await isPrinterUp();

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
    <div className="bg-white">
      <PrinterDialog
        open={printerDialog}
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
      <div className="border-gray-300 border-t-4 flex items-start justify-between">
        <div className="left" style={{ width: "80%" }}>
          <GameIllustration WhichGame={handleIconSelect} />
          {WhichGameSelected === "KENO" ? (
            <>
              {" "}
              <div className="next-draw flex mt-4 ml-7">
                {gameData.game && remainingTime > 0 ? (
                  <div className="bg-red-500 font-bold p-2 text-sm text-white flex items-center">
                    NEXT DRAW{" "}
                    <span className="text-amber-300 font-bold ml-4">
                      {formatTime(minutes, seconds)}
                    </span>
                  </div>
                ) : (
                  <div className="bg-red-500 p-2 text-sm text-white flex font-bold items-center">
                    NEXT DRAW{" "}
                    <span className="font-bold text-amber-300 ml-4">
                      {"00"}:{"00"}
                    </span>
                  </div>
                )}
                <div className="bg-green-600 p-2 text-sm text-white font-bold">
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
                  <TicketSelector gameType={WhichGameSelected} />
                  <div className="number-picker mt-4 w-full">
                    <NumberPicker />
                  </div>
                </div>
                <div
                  className="flex flex-col gap-4 items-start mt-2"
                  style={{ flexBasis: "38%" }}
                >
                  <TicketSlipHolder gameType={WhichGameSelected} />
                  <div
                    className="speech left mt-20"
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
            <HorseRun />
          )}
        </div>
        <BetSlip />
      </div>
    </div>
  );
}

export default App;
