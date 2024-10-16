import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../../config/interceptor";
import moment from "moment";

export interface GameData {
  id: string;
  gamenumber: number;
  result: null | any;
  status: string;
  startTime: string;
  shopId: string;
  createdAt: string;
  updatedAt: string;
  gameData: string;
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
  },
});

export const { setLoading, setGameError, appendGames } =
  racingGameSlice.actions;

export default racingGameSlice.reducer;

export const getLastRacingGames =
  (shopId: string | undefined, gameType: string) =>
  async (dispatch: (arg0: any) => void) => {
    dispatch(setLoading({ gameType, loading: true }));

    try {
      const gameResponse: GameResponse = (
        await axiosInstance.post("game/getEventsAndDetails", {
          shopId: shopId,
          name: gameType,
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
