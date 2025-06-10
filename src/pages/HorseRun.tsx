import React, { useEffect, useState, useCallback } from "react";

import "../styles/App.css";
import Drop from "../components/Drop";
import Head from "../components/Head";

import { useAppDispatch } from "../features/hooks";
import { addHeadText } from "../features/slices/HeadSlice";
import { useAppSelector } from "../features/hooks";
import {
  fetchEventDetail,
  getLastRacingGames,
  GameData,
} from "../features/slices/RacingGameSliceMultipleSports";
import moment from "moment";
import CircularUnderLoad from "../components/svg/Loader";
import { setIsLive } from "../features/slices/gameType";
import { useNavigate } from "react-router-dom";
import NetworkErrorComponent from "../components/Connection";

// Define the RootEventData interface for our component
interface RootEventData {
  Race?: {
    Name: string;
    Distance: number;
  };
  Number: number;
  eventDetail?: any;
  ID: string;
}

interface GameSelection {
  isActive: boolean;
  selectedOptions: number[];
}

interface prop {
  gameType: string;
}
function HorseRun({ gameType }: prop) {
  const texts = ["Main", "ALT", "HEAD TO HEAD", "SUM"];
  const dispatch = useAppDispatch();
  const cashier = useAppSelector((state) => state.cashier.ShopData);
  const [selectedText, setSelectedText] = useState("");
  const [activeIndexValue, setActiveindexVal] = useState(0);
  const [activeIndex, setActiveindex] = useState(0);
  const [ActiveGame, setIsActivegame] = useState(false);
  const [_D_interval, _D_setInterval] = useState(0);
  const user = useAppSelector((state) => state.user);
  const [pastIndex, setpastIndex] = useState<number | null>(null);
  const [liveIndex, setLiveIndex] = useState(false);
  const [counter, setCounter] = useState(3);
  const [restart, setRestart] = useState(false);
  const [activated, setActivated] = useState(0);

  // Track which games are currently expanded/visible
  const [expandedGameIds, setExpandedGameIds] = useState<Set<string>>(new Set());

  // Store selections for each game separately
  const [gameSelections, setGameSelections] = useState<
    Map<string, GameSelection>
  >(new Map());

  // Track games by ID instead of index to survive array replacements
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [liveGameId, setLiveGameId] = useState<string | null>(null);
const hasEntry = useAppSelector((state) => state.gameType.hasEntry);
  const userIsActive = useAppSelector((state) => state.gameType.Active);
  if (!userIsActive) {
    window.location.reload();
    console.log("user Is Inactive");
    localStorage.clear();
    window.location.reload();
  }
  const handleClickMenu = (text: string) => {
    setSelectedText(text);
  };
  const gameData = useAppSelector(
    (state) => state.racingGame.gamesByType[gameType]
  );

  const handleActiveIndex = (val: number) => {
    const text = texts[val];
    setActiveindexVal(val);
    dispatch(addHeadText(text));
  };

  useEffect(() => {
    if (gameData && gameData.games) {
      let activeIndex: { index: number; millisecond: number }[] = [];
      for (let index in gameData.games) {
        if (
          moment(gameData.games[index].startTime).diff(moment(), "seconds") > 0
        ) {
          activeIndex.push({
            index: parseInt(index),
            millisecond: moment(gameData.games[index].startTime).diff(
              moment(),
              "milliseconds"
            ),
          });
        }
      }
      // Fix the sorting function to return a number
      let sortedOne = activeIndex.sort((a, b) => a.millisecond - b.millisecond);

      if (sortedOne.length > 0) {
        const newActiveIndex = sortedOne[0].index;
        const newActiveGame = gameData.games[newActiveIndex];

        setActiveindex(newActiveIndex);

        setActiveGameId(newActiveGame.id);
        _D_setInterval(sortedOne[0].millisecond);

        // Only set pastIndex if there's a previous game to show as live
        const newPastIndex = newActiveIndex > 0 ? newActiveIndex - 1 : null;
        setpastIndex(newPastIndex);

        // Set live game ID if there's a previous game
        if (newPastIndex !== null && gameData.games[newPastIndex]) {
          setLiveGameId(gameData.games[newPastIndex].id);
          dispatch(setIsLive(true));
        }

        setActivated(newActiveIndex);
      } else {
        if (!gameData.loading && counter > 0) {
          setCounter(counter - 1);
          dispatch(
            getLastRacingGames(
              user.user?.Cashier.shopId,
              gameType,
              cashier?.KironCookieId + ""
            )
          );
        } else {
          if (counter === 0) {
            setRestart(true);
          }
        }
      }
    } else if (!gameData && cashier) {
      // dispatch(
      //   getLastRacingGames(
      //     user.user?.Cashier.shopId,
      //     gameType,
      //     cashier?.KironCookieId + ""
      //   )
      // );
    }
  }, [gameData, _D_interval, cashier]);

  // useEffect(() => {
  
  // }, [activated]);

  useEffect(() => {
    dispatch(setIsLive(true));
  }, [pastIndex]);

  useEffect(() => {
    const __interval = () => {
      _D_setInterval(0);
      // When interval triggers, fetch new games to ensure we have the latest data
      if (cashier?.KironCookieId && user.user?.Cashier.shopId) {
        dispatch(
          getLastRacingGames(
            user.user.Cashier.shopId,
            gameType,
            cashier.KironCookieId + ""
          )
        );
      }
    };
    let timer: NodeJS.Timeout | null = null;
    if (_D_interval !== 0) {
      timer = setTimeout(__interval, _D_interval);
    }

    // Cleanup timer on unmount or dependency change
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [_D_interval, dispatch, gameType, cashier?.KironCookieId, user.user?.Cashier.shopId]);
// const FetchGameDetail=(gameId:string,gameType:string)=>{

//           setRestart(false);
     
      
// }
  // Handler for when a game is toggled
  const handleGameToggle = (
    gameId: string,
    isActive: boolean,
    options: number[] = []
  ) => {
    // Store current selections for this game
    const newSelections = new Map(gameSelections);
    newSelections.set(gameId, { isActive, selectedOptions: options });
    setGameSelections(newSelections);

    // Toggle game expansion state - allow multiple drops to be open
    const newExpandedGameIds = new Set(expandedGameIds);
    if (isActive) {
      // Add this game to the set of expanded games
      newExpandedGameIds.add(gameId);
    } else {
      // Remove this game from the set of expanded games
      newExpandedGameIds.delete(gameId);
    }
    setExpandedGameIds(newExpandedGameIds);

    // Set the activated game for other functionality
    setActivated(gameData.games.findIndex((game) => game.id === gameId));
  };

  // Get the active state for a game based on its ID
  const getGameSelectionState = (gameId: string): GameSelection => {
    return (
      gameSelections.get(gameId) || { isActive: false, selectedOptions: [] }
    );
  };

  // Handle timer end - fetch new games and update game states
  const handleTimerEnd = useCallback(() => {
    console.log('Timer ended, transitioning games...');

    // First, update the game states immediately to show the live game
    if (gameData && gameData.games && activeGameId) {
      const currentActiveGame = gameData.games.find(game => game.id === activeGameId);

      if (currentActiveGame) {
        // Find the next active game
        let nextActiveGame = null;
        for (let game of gameData.games) {
          if (moment(game.startTime).diff(moment(), "seconds") > 0) {
            nextActiveGame = game;
            break;
          }
        }

        if (nextActiveGame) {
          console.log(`Game transition: ${currentActiveGame.id} -> Live, ${nextActiveGame.id} -> Active`);

          // Update game IDs immediately to track the transition
          setLiveGameId(currentActiveGame.id); // Current active becomes live
          setActiveGameId(nextActiveGame.id); // Next game becomes active

          // Update indices for compatibility with existing code
          const nextActiveIndex = gameData.games.findIndex(game => game.id === nextActiveGame.id);
          const currentActiveIndex = gameData.games.findIndex(game => game.id === currentActiveGame.id);

          setpastIndex(currentActiveIndex);
          setActiveindex(nextActiveIndex);
          setActivated(nextActiveIndex);

          // Set the interval for the next game
          const nextGameTime = moment(nextActiveGame.startTime).diff(
            moment(),
            "milliseconds"
          );
          _D_setInterval(nextGameTime);
        }
      }
    }

    // Don't fetch new games immediately - let the live game be visible first
    // The regular interval will handle fetching new games
  }, [dispatch, gameType, cashier?.KironCookieId, user.user?.Cashier.shopId, gameData, activeGameId, _D_setInterval]);

  // Sync game IDs when game data changes (after new games are fetched)
  useEffect(() => {
    if (gameData && gameData.games && gameData.games.length > 0) {
      // If we have game IDs set, try to find them in the new array
      if (activeGameId) {
        const activeGameIndex = gameData.games.findIndex(game => game.id === activeGameId);
        if (activeGameIndex !== -1) {
          setActiveindex(activeGameIndex);
        }
      }

      if (liveGameId) {
        const liveGameIndex = gameData.games.findIndex(game => game.id === liveGameId);
        if (liveGameIndex !== -1) {
          setpastIndex(liveGameIndex);
        } else {
          // If live game is no longer in the array, it means it's been removed
          // This is expected behavior when the next game becomes live
          console.log(`Live game ${liveGameId} removed from array as expected`);
          setLiveGameId(null);
        }
      }
    }
  }, [gameData?.games, activeGameId, liveGameId]);

  // Debug effect to track state changes
  useEffect(() => {
    console.log(`Game State Update - Active: ${activeIndex} (${activeGameId}), Past: ${pastIndex} (${liveGameId}), Total Games: ${gameData?.games?.length || 0}`);
  }, [activeIndex, pastIndex, activeGameId, liveGameId, gameData?.games?.length]);

  return (
    <div className="App">
      <Head
        numberOfMenu={2}
        texts={texts}
        activeIndexprop={handleActiveIndex}
        isReadOnly={true} // Make the text read-only
      />
      {restart && (
        <NetworkErrorComponent
          show={restart}
          onReload={() => {
            window.location.reload();
          }}
        />
      )}
      {!restart &&
        gameData &&
        gameData.games &&
        gameData.games.map((game, index) => {
          // Cast gameData to any to handle type issues
          const gameDataAny = game.gameData as any;

          // Always show the active and live games regardless of index
          const isActiveGame = game.id === activeGameId;
          const isLiveGame = game.id === liveGameId;

          // Show games from pastIndex onwards (keep the live game visible)
          // But always show active and live games even if indices are off
          if (!isActiveGame && !isLiveGame && pastIndex !== undefined && pastIndex !== null && index < pastIndex - 1) {
            return null;
          }

          // Additional safety check: always show the current active and past games
          if (index === activeIndex || index === pastIndex || isActiveGame || isLiveGame) {
            // These games should always be visible
          }

          // Get the saved selection state for this game
          const selectionState = getGameSelectionState(game.id);

          // Determine if this game is expanded
          const isExpanded = expandedGameIds.has(game.id);

          return (
            <React.Fragment key={game.id}>
              <Drop
                place={`${gameDataAny.Race?.Name} ${gameDataAny.Race?.Distance}`}
                id={gameDataAny.Number + ""}
                time={game.startTime}
                activeIndexValues={activeIndexValue}
                gameData={game}
                data={gameDataAny}
                isActiveGame={game.id === activeGameId}
                isPastGame={game.id === liveGameId}
                gameNumber={gameDataAny.Number}
                WhichGameSelected={gameType}
                isActiveClicked={(activated: boolean) => {
                  // Pass saved selections to the Drop component
                  handleGameToggle(
                    game.id,
                    activated,
                    selectionState.selectedOptions
                  );
                }}
                // Pass the stored selection state to Drop
                savedSelections={selectionState.selectedOptions}
                // Indicate if this is the currently expanded game
                isExpanded={isExpanded}
                // Callback to update selections when they change
                onSelectionsChange={(selections: number[]) => {
                  const newSelections = new Map(gameSelections);
                  newSelections.set(game.id, {
                    isActive: selectionState.isActive,
                    selectedOptions: selections,
                  });
                  setGameSelections(newSelections);
                }}
                // Handle timer end to fetch new games
                isLiveGame={index===activeIndex}
                index={index}
                onTimerEnd={handleTimerEnd}
              />
            </React.Fragment>
          );
        })}
    </div>
  );
}

export default HorseRun;
