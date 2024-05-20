import { configureStore } from "@reduxjs/toolkit";
import pickerReducer from "./slices/pickerSlice";
import userReducer from "./slices/userSlice";
import oddReducer from "./slices/oddSlice";
import gameReducer from "./slices/gameSlice";
import betSlipReducer from "./slices/betSlip";

export const store = configureStore({
    reducer: {
        picker: pickerReducer,
        user: userReducer,
        odd: oddReducer,
        game: gameReducer,
        betSlip: betSlipReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch