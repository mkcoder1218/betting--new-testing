import { configureStore } from "@reduxjs/toolkit";
import pickerReducer from "./slices/pickerSlice";
import userReducer from "./slices/userSlice";
import oddReducer from "./slices/oddSlice";
import gameReducer from "./slices/gameSlice";
import betSlipReducer from "./slices/betSlip";
import summaryReducer from "./slices/summarySlice";
import ticketReducer from "./slices/ticketSlice";
import betDataReducer from "./slices/betData";
import expiryReducer from "./slices/ticketExpiry";

export const store = configureStore({
    reducer: {
        picker: pickerReducer,
        user: userReducer,
        odd: oddReducer,
        game: gameReducer,
        betSlip: betSlipReducer,
        summary: summaryReducer,
        ticket: ticketReducer,
        betData: betDataReducer,
        expiry: expiryReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch