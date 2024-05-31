import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../../config/interceptor";

interface GameData {
    id: string;
    gamenumber: number;
    result: null | any;
    status: string;
    startTime: string;
    shopId: string;
    createdAt: string;
    updatedAt: string;
}

interface GameResponse {
    data: GameData;
    message: string;
    error: null | any;
}

interface GameState {
    loading: boolean,
    error: string | null,
    message: string | null,
    game: GameData | null
}

let initialState: GameState = {
    loading: false,
    error: null,
    message: null,
    game: null
}

const gameSlice = createSlice({
    name: "game",
    initialState: initialState,
    reducers: {
        addGame: (state, action: PayloadAction<GameState>) => {
            state.loading = action.payload.loading;
            state.error = action.payload.error;
            state.message = action.payload.message;
            state.game = action.payload.game;
        }
    }
})

export const { addGame } = gameSlice.actions;

export default gameSlice.reducer;

export const getLastGame = (shopId: string | undefined) => async (dispatch: (arg0: { payload: GameState; type: "game/addGame"; }) => void) => {
    dispatch(addGame({ loading: true, error: null, message: null, game: null }))

    try {
        const gameResponse: GameResponse = (await axiosInstance.post("game/status", {
            shopId: shopId,
            status: "WAITING"
        })).data

        if (gameResponse.message === "success") {
            dispatch(addGame({ loading: false, error: gameResponse.error, message: gameResponse.message, game: gameResponse.data }))
        } else {
            dispatch(addGame({ loading: false, error: gameResponse.message, message: null, game: null }))
        }

        console.log(gameResponse);
    } catch (err: AxiosError | any) {
        console.log(err);
        dispatch(addGame({ message: "", error: err?.response?.data ? err.response.data.error : "Something went wrong", loading: false, game: null }))
    }
}
