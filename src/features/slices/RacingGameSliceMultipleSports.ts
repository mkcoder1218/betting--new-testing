import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../../config/interceptor";
import moment from "moment";
import { EventDetail, EventDetailInterface } from "../../utils/patch";

export interface GameData {
  id: string;
  gamenumber: number;
  result: null | any;
  status: string;
  startTime: string;
  shopId: string;
  createdAt: string;
  updatedAt: string;
  gameData: GameData;
  gameType: string;
}

interface GameResponse {
  data: GameData[];
  message: string;
  error: null | any;
}

interface GameState {
  loading: boolean;
  error: string | null;
  message: string | null;
  games: GameData[]; // Store an array of games
}

interface RacingGameState {
  gamesByType: Record<string, GameState>; // Store games for different game types
}

const initialState: RacingGameState = {
  gamesByType: {},
};

const racingGameSlice = createSlice({
  name: "racinggame",
  initialState: initialState,
  reducers: {
    setLoading: (
      state,
      action: PayloadAction<{ gameType: string; loading: boolean }>
    ) => {
      const { gameType, loading } = action.payload;
      if (!state.gamesByType[gameType]) {
        state.gamesByType[gameType] = {
          loading,
          error: null,
          message: null,
          games: [],
        };
      } else {
        state.gamesByType[gameType].loading = loading;
      }
    },
    setGameError: (
      state,
      action: PayloadAction<{ gameType: string; error: string | null }>
    ) => {
      const { gameType, error } = action.payload;
      if (!state.gamesByType[gameType]) {
        state.gamesByType[gameType] = {
          loading: false,
          error,
          message: null,
          games: [],
        };
      } else {
        state.gamesByType[gameType].error = error;
      }
    },
    appendGames: (
      state,
      action: PayloadAction<{
        gameType: string;
        games: GameData[];
        message: string | null;
      }>
    ) => {
      const { gameType, games, message } = action.payload;
      if (!state.gamesByType[gameType]) {
        state.gamesByType[gameType] = {
          loading: false,
          error: null,
          message,
          games: games, // Initialize with the games fetched
        };
      } else {
        // Append the new games to the existing array
        state.gamesByType[gameType].games = games.sort((a, b) => {
          return moment(a.startTime).diff(moment(b.startTime), "minutes");
        });

        state.gamesByType[gameType].message = message;
      }
    },
    appendGameDetails: (
      state,
      action: PayloadAction<{
        gameType: string;
        gameId: string;
        eventDetail: EventDetail;
        message: string | null;
      }>
    ) => {
      const { gameType, eventDetail, message, gameId } = action.payload;

      const index = state.gamesByType[gameType].games.findIndex(
        (game: GameData) => {
          return game.id === gameId;
        }
      );

      const updatedState = {
        gamesByType: {
          ...state.gamesByType,
          [gameType]: {
            ...state.gamesByType[gameType],
            games: state.gamesByType[gameType].games.map((game, i) =>
              i === index
                ? {
                    ...game,
                    gameData:
                      typeof game.gameData === "object"
                        ? {
                            ...game.gameData,
                            eventDetail: {
                              ...eventDetail,
                            },
                          }
                        : game.gameData,
                  }
                : game
            ),
          },
        },
      };
      state.gamesByType = updatedState.gamesByType;
      state.gamesByType[gameType].message = message;
    },
    appendGameDetailsResult: (
      state,
      action: PayloadAction<{
        gameType: string;
        gameId: string;
        eventDetail: EventDetail;
        message: string | null;
      }>
    ) => {
      const { gameType, eventDetail, message, gameId } = action.payload;

      const index = state.gamesByType[gameType].games.findIndex(
        (game: GameData) => {
          return game.id === gameId;
        }
      );

      const updatedState = {
        gamesByType: {
          ...state.gamesByType,
          [gameType]: {
            ...state.gamesByType[gameType],
            games: state.gamesByType[gameType].games.map((game, i) =>
              i === index
                ? {
                    ...game,
                    gameData:
                      typeof game.gameData === "object"
                        ? {
                            ...game.gameData,
                            eventResult: {
                              ...eventDetail,
                            },
                          }
                        : game.gameData,
                  }
                : game
            ),
          },
        },
      };
      state.gamesByType = updatedState.gamesByType;
      state.gamesByType[gameType].message = message;
    },
  },
});

export const {
  setLoading,
  setGameError,
  appendGames,
  appendGameDetails,
  appendGameDetailsResult,
} = racingGameSlice.actions;

export default racingGameSlice.reducer;

export const getLastRacingGames =
  (shopId: string | undefined, gameType: string, selectedCookie: string) =>
  async (dispatch: (arg0: any) => void) => {
    dispatch(setLoading({ gameType, loading: true }));

    try {
      const gameResponse: GameResponse = (
        await axiosInstance.post("game/getEventsAndDetailss", {
          shopId: shopId,
          name: gameType,
          selectedCookie,
        })
      ).data;

      if (gameResponse.message === "success") {
        dispatch(
          appendGames({
            gameType,
            games: gameResponse.data.reverse(),
            message: gameResponse.message,
          })
        );
      } else {
        dispatch(setGameError({ gameType, error: gameResponse.message }));
      }
      dispatch(setLoading({ gameType, loading: false }));
    } catch (err: AxiosError | any) {
      dispatch(
        setGameError({
          gameType,
          error: err?.response?.data?.error || "Something went wrong",
        })
      );
    } finally {
      dispatch(setLoading({ gameType, loading: false }));
    }
  };

export const fetchEventDetail =
  (eventId: string, gameType: string) =>
  async (dispatch: (arg0: any) => void) => {
    // dispatch(setLoading({ gameType, loading: true }));

    try {
      const gameResponse: EventDetailInterface = (
        await axiosInstance.post("game/getEventDetail", {
          eventId: eventId,
        })
      ).data;

      if (gameResponse.message === "success") {
        dispatch(
          appendGameDetails({
            gameType,
            gameId: eventId,
            eventDetail: gameResponse.data.gameData,
            message: gameResponse.message,
          })
        );
      } else {
        dispatch(setGameError({ gameType, error: gameResponse.message }));
      }
      // dispatch(setLoading({ gameType, loading: false }));
    } catch (err: AxiosError | any) {
      dispatch(
        setGameError({
          gameType,
          error: err?.response?.data?.error || "Something went wrong",
        })
      );
    } finally {
      dispatch(setLoading({ gameType, loading: false }));
    }
  };

export const fetchEventResult =
  (eventId: string, gameType: string) =>
  async (dispatch: (arg0: any) => void) => {
    // dispatch(setLoading({ gameType, loading: true }));

    try {
      const gameResponse: EventDetailInterface = (
        await axiosInstance.post("game/getEventResult", {
          eventId: eventId,
        })
      ).data;

      if (gameResponse.message === "success") {
        dispatch(
          appendGameDetailsResult({
            gameType,
            gameId: eventId,
            eventDetail: gameResponse.data.result,
            message: gameResponse.message,
          })
        );
      } else {
        dispatch(setGameError({ gameType, error: gameResponse.message }));
      }
      // dispatch(setLoading({ gameType, loading: false }));
    } catch (err: AxiosError | any) {
      dispatch(
        setGameError({
          gameType,
          error: err?.response?.data?.error || "Something went wrong",
        })
      );
    } finally {
      dispatch(setLoading({ gameType, loading: false }));
    }
  };
