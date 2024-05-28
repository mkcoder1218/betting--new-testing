import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/interceptor";
import { AxiosError } from "axios";
import { clearNumbers } from "./pickerSlice";

interface Game {
    gamenumber: number
}

interface Ticket {
    id: string;
    ticketno: string;
    nums: number[];
    redeem: null | any;
    stake: string;
    ticketExpiry: string;
    maxWin: number;
    win: number;
    oddId: string;
    cashierRedeemId: null | string;
    gameId: string;
    betSlipId: string;
    createdAt: string;
    updatedAt: string;
    Game: Game
}

export interface BetSlip {
    id: string;
    minWin: number;
    betSlipNumber: string;
    maxWin: number;
    date: string;
    cashierCreateId: string;
    shopId: string;
    updatedAt: string;
    createdAt: string;
    Tickets: Ticket[] | null
}

interface BetSlipResponse {
    data: BetSlip | null;
    message: string;
    error: null;
}

interface BetSlipState {
    loading: boolean,
    error: string | null,
    message: string | null,
    data: BetSlip | null
}

let initialState: BetSlipState = {
    loading: false,
    error: null,
    message: null,
    data: null
}

const betDataSlice = createSlice({
    name: "betSlip",
    initialState: initialState,
    reducers: {
        addBetData: (state, action: PayloadAction<BetSlipState>) => {
            state.loading = action.payload.loading;
            state.error = action.payload.error;
            state.message = action.payload.message;
            state.data = action.payload.data;
        }
    }
})

export const { addBetData } = betDataSlice.actions;

export default betDataSlice.reducer;

export const getTicketsToCancel = (betslip: number | undefined) => async (dispatch: (arg0: { payload: BetSlipState; type: "betSlip/addBetData"; }) => void) => {
    dispatch(addBetData({ loading: true, error: null, message: null, data: null }))

    try {
        const ticketsToCancel: BetSlipResponse = (await axiosInstance.get(`ticket/betslip/byNumber/toCancel/${betslip}`)).data

        if (ticketsToCancel.message === "success") {
            dispatch(addBetData({ loading: false, error: null, message: ticketsToCancel.message, data: ticketsToCancel.data as BetSlip }))

            console.log(ticketsToCancel.data);
        } else {
            dispatch(addBetData({ loading: true, error: ticketsToCancel.error, message: null, data: null }))
        }
    } catch (err: AxiosError | any) {
        console.log(err);
        dispatch(addBetData({ message: "", error: err?.response?.data ? err.response.data.error : "Something went wrong", loading: false, data: null }))
    }
}

export const getTicketsToRedeem = (betslip: number | undefined) => async (dispatch: (arg0: { payload: BetSlipState; type: "betSlip/addBetData"; }) => void) => {
    dispatch(addBetData({ loading: true, error: null, message: null, data: null }))

    try {
        const ticketsToCancel: BetSlipResponse = (await axiosInstance.get(`ticket/betslip/byNumber/toRedeem/${betslip}`)).data

        if (ticketsToCancel.message === "success") {
            dispatch(addBetData({ loading: false, error: null, message: ticketsToCancel.message, data: ticketsToCancel.data as BetSlip }))

            console.log(ticketsToCancel.data);
        } else {
            dispatch(addBetData({ loading: true, error: ticketsToCancel.error, message: null, data: null }))
        }
    } catch (err: AxiosError | any) {
        console.log(err);
        dispatch(addBetData({ message: "", error: err?.response?.data ? err.response.data.error : "Something went wrong", loading: false, data: null }))
    }
}

export const cancelTicket = (gamenumber: number | undefined, betslip: number | undefined, cashierCreateId: string | undefined) => async (dispatch: (arg0: { payload: BetSlipState; type: "betSlip/addBetData"; }) => void) => {
    dispatch(addBetData({ loading: true, error: null, message: null, data: null }))

    try {
        const cancelTicketResponse: BetSlipResponse = (await axiosInstance.put("ticket/cancel", { gamenumber, betslip, cashierCreateId })).data;

        if (cancelTicketResponse.message === "Bet cancelled successfully") {
            dispatch(addBetData({ loading: false, error: null, message: "Ticket cancelled successfully", data: null }))
        } else {
            dispatch(addBetData({ loading: true, error: cancelTicketResponse.error, message: null, data: null }))
        }

        setTimeout(() => {
            dispatch(addBetData({ loading: false, error: null, message: null, data: null }))
        }, 2000);
    } catch (err: AxiosError | any) {
        console.log(err);
        dispatch(addBetData({ message: "", error: err?.response?.data ? err.response.data.error : "Something went wrong", loading: false, data: null }))
    }
}

export const redeemTicket = (cashierRedeemId: string | undefined, betslip: number | undefined) => async (dispatch: (arg0: { payload: BetSlipState; type: "betSlip/addBetData"; }) => void) => {
    dispatch(addBetData({ loading: true, error: null, message: null, data: null }))

    try {
        const redeemTicketResposne: BetSlipResponse = (await axiosInstance.post("ticket/redeem", { cashierRedeemId, betslip })).data;

        console.log(redeemTicketResposne)

        if (redeemTicketResposne.message === "Ticket redeemed successfully") {
            dispatch(addBetData({ loading: false, error: null, message: "Ticket redeemed successfully", data: null }))
        } else {
            dispatch(addBetData({ loading: true, error: redeemTicketResposne.error, message: null, data: null }))
        }

        setTimeout(() => {
            dispatch(addBetData({ loading: false, error: null, message: null, data: null }))
        }, 2000);
    } catch (err: AxiosError | any) {
        console.log(err);
        dispatch(addBetData({ message: "", error: err?.response?.data ? err.response.data.error : "Something went wrong", loading: false, data: null }))
    }
}