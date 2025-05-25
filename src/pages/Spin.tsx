import React, { useEffect } from "react";
import Container from "../pages/CashierplayContainer";
import "../styles/spin.css";
import Timer from "../pages/timer";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { useState } from "react";
import {
  GameData,
  getLastRacingGames,
} from "../features/slices/RacingGameSliceMultipleSports";
import CircularUnderLoad from "../components/svg/Loader";
import moment from "moment";
import { addExpiry } from "../features/slices/ticketExpiry";
import { getLastBetSlip } from "../features/slices/betSlip";

// Define RootEventData interface based on the component usage
interface RootEventData {
  Number: number;
  // Add other properties if needed
}

function Spin() {
  const [gameid, setgameId] = useState<RootEventData | null>(null);
  const cashier = useAppSelector((state) => state.cashier.ShopData);
  const userIsActive = useAppSelector((state) => state.gameType.Active);
  if (!userIsActive) {
    window.location.reload();

    localStorage.clear();
    window.location.reload();
  }
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const gameData = useAppSelector(
    (state) => state.racingGame.gamesByType["SpinAndWin"]
  );
  const [game, setGame] = useState<GameData>();
  const [update, setUpdate] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  const [lastCheck, setLastCheck] = useState(0);

  // Add game state management similar to HorseRun
  const [activeIndex, setActiveindex] = useState(0);
  const [pastIndex, setpastIndex] = useState<number | null>(null);
  const [allGames, setAllGames] = useState<GameData[]>([]);

  useEffect(() => {
    if (
      gameData &&
      gameData.games &&
      gameData?.games[0]?.gameType === "SpinAndWin" &&
      update
    ) {
      const gamesFiltered = gameData.games
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

      if (gamesFiltered && gamesFiltered.length >= 1) {
        setGame(gamesFiltered[0]);
        setUpdate(false);
      } else {
        dispatch(
          getLastRacingGames(
            user.user?.Cashier.shopId,
            "SpinAndWin",
            cashier?.KironCookieId + ""
          )
        );
      }
    }
  }, [gameData, update, cashier]);

  // Update allGames when gameData changes
  useEffect(() => {
    if (gameData && gameData.games) {
      setAllGames(gameData.games);

      // Update active and past indices based on current time
      let newActiveIndex = -1;
      for (let index = 0; index < gameData.games.length; index++) {
        if (moment(gameData.games[index].startTime).diff(moment(), "seconds") > 0) {
          newActiveIndex = index;
          break;
        }
      }

      if (newActiveIndex !== -1) {
        setActiveindex(newActiveIndex);
        // Only set pastIndex if there's a previous game to show as live
        const newPastIndex = newActiveIndex > 0 ? newActiveIndex - 1 : null;
        setpastIndex(newPastIndex);
      }
    }
  }, [gameData]);

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
      // Handle timer end with proper game state transitions
      handleTimerEnd();
    }
  }, [remainingTime]);

  // Handle timer end - similar to HorseRun logic
  const handleTimerEnd = () => {
    console.log('Spin timer ended, transitioning games...');

    // First, update the game states immediately to show the live game
    if (allGames && allGames.length > 0) {
      const currentActiveIndex = activeIndex;

      // Find the next active game
      let nextActiveIndex = -1;
      for (let index = 0; index < allGames.length; index++) {
        if (moment(allGames[index].startTime).diff(moment(), "seconds") > 0) {
          nextActiveIndex = index;
          break;
        }
      }

      if (nextActiveIndex !== -1) {
        console.log(`Spin transition: ${currentActiveIndex} -> Live, ${nextActiveIndex} -> Active`);

        // Update states immediately to show the transition
        setpastIndex(currentActiveIndex); // Current active becomes live
        setActiveindex(nextActiveIndex); // Next game becomes active

        // Update the current game to the next active game
        if (allGames[nextActiveIndex]) {
          setGame(allGames[nextActiveIndex]);
        }
      }
    }

    // Then fetch new games with a delay to ensure live game is visible
    setTimeout(() => {
      setUpdate(true);
      if (user.user?.Cashier.shopId && cashier?.KironCookieId) {
        dispatch(
          getLastRacingGames(
            user.user.Cashier.shopId,
            "SpinAndWin",
            cashier.KironCookieId + ""
          )
        );
      }
    }, 1000); // 1 second delay to ensure live game is visible
  };

  const data =
    gameData &&
    gameData.games &&
    gameData.games?.map((game) => {
      const data2: RootEventData = game.gameData as unknown as RootEventData;
      return data2.Number;
    });
  const gameState = useAppSelector((state) => state.betData.data);

  return (
    <div className="App mt-5">
      <div className="parent-container mt-5">
        <Timer
          time={moment(remainingTime).format("mm:ss")}
          gameID={Number(data)}
        />
        {game && (
          <div className="responsive-container">
            <Container
              gameid={game?.id}
              gameStartTime={game?.startTime}
              gameidofback={gameState?.id}
              gameNumber={data}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Spin;
