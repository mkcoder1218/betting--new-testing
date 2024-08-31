import React, { useEffect } from "react";
import Container from "../pages/CashierplayContainer";
import "../styles/spin.css";
import Timer from "../pages/timer";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { useState } from "react";
import {
  GameData,
  getLastRacingGames,
  RootEventData,
} from "../features/slices/RacingGameSlice";
import CircularUnderLoad from "../components/svg/Loader";
import moment from "moment";
import { addExpiry } from "../features/slices/ticketExpiry";
import { getLastBetSlip } from "../features/slices/betSlip";
import { RootEventData } from "../features/slices/RacingGameSlice";
function Spin() {
  const [gameid, setgameId] = useState<RootEventData | null>(null);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const gameData = useAppSelector((state) => state.racingGame);
  const [game, setGame] = useState<GameData>();
  const [update, setUpdate] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  const [lastCheck, setLastCheck] = useState(0);

  useEffect(() => {
    console.log("GamesFiltered", gameData.gameType);
    if (
      gameData &&
      gameData.game &&
      gameData.gameType === "SpinAndWin" &&
      update
    ) {
      console.log("GamesFiltered", gameData.game?.length);
      const gamesFiltered = gameData.game
        .filter((gamedata) => {
          return moment(gamedata.startTime).diff(moment(), "seconds") > 0;
        })
        .sort((a, b) => {
          console.log(
            "TIME_DIFFERENCE_!",
            moment(a.startTime).diff(moment(), "minutes")
          );
          return moment(a.startTime).valueOf() - moment(b.startTime).valueOf();
        });
      console.log("GamesFiltered", gamesFiltered.length);
      if (gamesFiltered && gamesFiltered.length >= 1) {
        setGame(gamesFiltered[0]);
        setUpdate(false);
      } else {
        dispatch(getLastRacingGames(user.user?.Cashier.shopId, "SpinAndWin"));
      }
    }
  }, [gameData, update]);

  useEffect(() => {
    if (game) {
      console.log(
        "TIME_DIFFERENCE",
        moment(game.startTime).diff(moment(), "minutes")
      );
      const lastUpdatedTime = game
        ? new Date(game.startTime).getTime()
        : new Date().getTime();
      dispatch(addExpiry({ expiry: lastUpdatedTime }));

      if (game && update) {
        const currentDiff =
          new Date().getTime() - new Date(game.startTime).getTime();
        const diffInMinutes = currentDiff / (1000 * 60);

        if (diffInMinutes <= 10) {
          // setRemainingTime(
          //   moment(game.startTime).diff(moment(), "milliseconds")
          // );
          // setUpdate(false);
          dispatch(getLastBetSlip());
        }
      }

      const timer = setInterval(() => {
        setRemainingTime(
          moment(game.startTime)
            .subtract(5, "seconds")
            .diff(moment(), "milliseconds")
        );
        if (lastCheck <= 10) {
          setLastCheck(lastCheck + 1);
        } else {
          // setUpdate(true);
          // dispatch(getLastGame(user.user?.Cashier.shopId));
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [game, update]);
  useEffect(() => {
    if (remainingTime < 0) {
      if (game) setUpdate(true);
      // dispatch(getLastGame(user.user?.Cashier.shopId));
    }
  }, [remainingTime]);
  const data = gameData.game?.map((game) => {
    const data2: RootEventData = game.gameData;

    return data2.Number;
  });
  const gameState = useAppSelector((state) => state.betData.data);

  return (
    <div className="App mt-5">
      <div className="parent-container mt-5">
        <Timer time={moment(remainingTime).format("mm:ss")} />

        {gameData && gameData.loading ? (
          <div className="w-full h-fit mt-10 flex justify-center">
            <CircularUnderLoad />
          </div>
        ) : (
          game && (
            <Container
              gameid={game.id}
              gameidofback={gameState?.id}
              gameNumber={data}
            />
          )
        )}
      </div>
    </div>
  );
}

export default Spin;
