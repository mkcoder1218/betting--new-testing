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
  fetchEventDetail,
  GameData,
  getLastRacingGames,
} from "./features/slices/RacingGameSliceMultipleSports";
import Spin from "./pages/Spin";
import TestComponent from "./utils/Tst";
import { useAxiosInterceptors } from "./config/interceptor";
import CircularUnderLoad from "./components/svg/Loader";
import { getLastGame } from "./features/slices/gameSlice";
import { getNetBalance } from "./features/slices/netBalance";
import { getShopData } from "./features/slices/cashierData";
import setupCashierStatusCheck from "./utils/cashierStatusCheck";

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const cashier = useAppSelector((state) => state.cashier);
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
  const handleOpen = () => {
    dispatch(getNetBalance(user.user?.Cashier.id, user.user?.Cashier.shopId));
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const gameData = useAppSelector((state) => state.racingGame);
  const handleRedeemOpen = () => setRedeemStatus(true);
  const handleRedeemClose = () => setRedeemStatus(false);
  const handleCancelRedeem = (val: string) => setCancelRedeem(val);
  const [game, setGame] = useState<GameData>();
  const [remainingTime, setRemainingTime] = useState(0);
  const [update, setUpdate] = useState(true);
  const [loadCounter, setLoadCounter] = useState(0);
  useAxiosInterceptors();
  const handlePrintDialogClose = () => {
    setPrinterDialog(true);
    logout();
  };

  function handleRepeat(event: React.ChangeEvent<HTMLSelectElement>) {
    dispatch(addRepeat({ repeat: parseInt(event.target.value) }));
  }
  useEffect(() => {
    // Create a debounce function using lodash or use a custom debounce function.
    const debounceFetch = setTimeout(() => {
      if (WhichGameSelected === "KENO") {
        dispatch(addGameType(WhichGameSelected));
      } else {
        if (WhichGameSelected.length > 0) {
          dispatch(addGameType(WhichGameSelected));
        }
        if (
          !gameData.gamesByType[WhichGameSelected] ||
          gameData.gamesByType[WhichGameSelected].games.filter((game) => {
            return moment().diff(moment(game.startTime), "seconds") < 0;
          }).length <= 1
        ) {
          if (cashier.ShopData)
            dispatch(
              getLastRacingGames(
                user.user?.Cashier.shopId,
                WhichGameSelected,
                cashier.ShopData?.KironCookieId + ""
              )
            );
          setLoadCounter(loadCounter + 1);
        }
      }
    }, 50); // 2-second debounce

    // Cleanup function to clear the timeout when `WhichGameSelected` changes.
    // if (cashier) return () => clearTimeout(debounceFetch);
  }, [WhichGameSelected, cashier]);

  useEffect(() => {
    if (
      gameData &&
      WhichGameSelected === "SmartPlayKeno" &&
      gameData.gamesByType[WhichGameSelected] &&
      gameData.gamesByType[WhichGameSelected].games &&
      update
    ) {
      const gamesFiltered = gameData.gamesByType[WhichGameSelected].games
        ?.filter((gamedata) => {
          return moment(gamedata.startTime).diff(moment(), "seconds") > 0;
        })
        .sort((a, b) => {
          return moment(a.startTime).valueOf() - moment(b.startTime).valueOf();
        });
      if (gamesFiltered && gamesFiltered.length > 0) {
        setGame(gamesFiltered[0]);
        setLoadCounter(0);
        setUpdate(false);
      } else {
        if (gameData.gamesByType[WhichGameSelected].games)
          if (loadCounter < 3 && cashier) {
            dispatch(
              getLastRacingGames(
                user.user?.Cashier.shopId,
                "SmartPlayKeno",
                cashier.ShopData?.KironCookieId + ""
              )
            );
            setLoadCounter(loadCounter + 1);
          } else {
            dispatch(getShopData());
          }
      }
    } else if (
      !gameData ||
      (gameData && !gameData.gamesByType[WhichGameSelected]) ||
      (gameData &&
        gameData.gamesByType[WhichGameSelected] &&
        !gameData.gamesByType[WhichGameSelected].games &&
        WhichGameSelected !== "SmartPlayKeno")
    ) {
      if (!cashier.ShopData) {
        dispatch(getShopData());
        // dispatch(
        //   getLastRacingGames(
        //     user.user?.Cashier.shopId,
        //     WhichGameSelected,
        //     cashier.ShopData?.KironCookieId + ""
        //   )
        // );
      } else {
        // dispatch(getShopData());
      }
    }
  }, [gameData, update, WhichGameSelected]);

  useEffect(() => {
    dispatch(getShopData());
  }, []);

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
    const intervalMs = 10 * 60 * 1000; // 10 minutes in milliseconds
    const intervalId = setInterval(() => {
      dispatch(getNetBalance(user.user?.Cashier.id, user.user?.Cashier.shopId));
    }, intervalMs);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

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
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      const inactiveTime = now - lastActivityRef.current;

      // If inactive for 1 minute (60000 ms), logout
      if (inactiveTime >= 10 * 60 * 1000) {
        logoutAuto();
      } else {
        // Schedule next check
        timerRef.current = setTimeout(checkInactivity, 60000); // Check every minute
      }
    };

    const handleUserActivity = () => {
      lastActivityRef.current = Date.now(); // Update last activity timestamp
    };

    // Add event listeners for mouse activity
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("mousedown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);

    // Start checking for inactivity
    timerRef.current = setTimeout(checkInactivity, 60000);

    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("mousedown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
    };
  }, []);

  const handleIconSelect = (val: string) => {
    setWhichgameSelected(val);
  };
  const userIsActive = useAppSelector((state) => state.gameType.Active);
  if (!userIsActive) {
    window.location.reload();

    localStorage.clear();
  }

  useEffect(() => {
    // Set up the cashier status check interval
    const statusCheckIntervalId = setupCashierStatusCheck();

    // Clean up the interval on component unmount
    return () => {
      clearInterval(statusCheckIntervalId);
    };
  }, []);

  return (
    <div className="bg-gray-50/80 fixed w-full h-full custom-scrollbar overflow-y-auto">
      <PrinterDialog
        open={false}
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
            className="w-full h-full bg-gray-100 z-20 absolute flex justify-center"
            style={{ opacity: 0.5 }}
          >
            <CircularUnderLoad />
          </div>
        )}
      <div
        className="flex items-start justify-between h-full custom-scrollbar overflow-y-auto md:flex-row flex-col px-2 md:px-0"
        style={{ scrollBehavior: "smooth" }}
      >
        <div
          className="left flex overflow-x-hidden flex-col w-full md:w-[75%]"
        >
          <GameIllustration WhichGame={(val: string) => {
            handleIconSelect(val);
            return true;
          }} />
          {WhichGameSelected === "SmartPlayKeno" ? (
            <>
              {" "}
              <div className="next-draw flex mt-4 max-w-[305px] justify-center mx-auto md:mx-0">
                {game && remainingTime > 0 ? (
                  <div
                    className="!font-light text-sm p-1 h-fit flex bg-black items-center"
                    style={{
                      backgroundColor: "#f00",
                      borderTopLeftRadius: 4,
                      borderBottomLeftRadius: 4,
                      color: "white",
                      opacity: 1,
                    }}
                  >
                    NEXT DRAW{" "}
                    <span className="font-bold ml-2" style={{ color: "#ff0" }}>
                      {formatTime(minutes, seconds)}
                    </span>
                  </div>
                ) : (
                  <div
                    className="bg-red-500 text-sm flex font-light items-center"
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
                  className="text-sm p-1 h-fit font-light"
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
              <div className="picker-container flex  -ml-[calc(1.7vw)]  items-start  md:flex-row flex-col w-full md:w-[100%]">
                <div className="picker-left w-full">
                  <TicketSelector
                    gameType={WhichGameSelected}
                    gameData={game as any}
                  />
                  <div
                    className={`${
                      gameData.gamesByType[WhichGameSelected]?.loading ? "hidden" : "visible"
                    }number-picker mt-4 w-full`}
                  >
                    <NumberPicker />
                  </div>
                </div>
                <div
                  className="flex flex-col gap-4 items-center md:items-start mt-2 w-full md:w-auto"
                  style={{ flexBasis: "38%" }}
                >
                  {game && (
                    <TicketSlipHolder
                      gameType={"SmartPlayKeno"}
                      gameData={game as any}
                      update={update}
                    />
                  )}
                  <div
                    className="max-w-[80%] speech !border-0 left !font-light mt-4 md:mt-20 max-lg:w-full"
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
