import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/interceptor";
import { AxiosError } from "axios";

interface BetSlipData {
    betSlipNumber: string;
}

interface BetSlipResponse<T> {
    data: T | null;
    message: string;
    error: null;
}

interface BetSlip {
    id: string;
    minWin: number;
    betSlipNumber: string;
    maxWin: number;
    date: string;
    cashierCreateId: string;
    shopId: string;
    updatedAt: string;
    createdAt: string;
}

interface BetSlipState<T> {
    loading: boolean,
    error: string | null,
    message: string | null,
    data: T | null
}

let initialState: BetSlipState<BetSlip | BetSlipData> = {
    loading: false,
    error: null,
    message: null,
    data: null
}

const betSlipSlice = createSlice({
    name: "betSlip",
    initialState: initialState,
    reducers: {
        addBetSlipNumber: (state, action: PayloadAction<BetSlipState<BetSlipData>>) => {
            state.data = action.payload.data;
        },
        addTicketAndBetSlip: (state, action: PayloadAction<BetSlipState<BetSlip>>) => {
            state.loading = action.payload.loading;
            state.error = action.payload.error;
            state.message = action.payload.message;
            state.data = action.payload.data;
        }
    }
})

export const { addBetSlipNumber, addTicketAndBetSlip } = betSlipSlice.actions;

export default betSlipSlice.reducer;

export const createBetSlipAndTicket = (data: any) => async (dispatch: (arg0: { payload: BetSlipState<BetSlip>; type: "betSlip/addTicketAndBetSlip"; }) => void) => {
    dispatch(addTicketAndBetSlip({ loading: true, error: null, message: null, data: null }))

    try {
        const betSlipResponse: BetSlipResponse<BetSlip> = (await axiosInstance.post("ticket/betslip")).data;

        console.log(betSlipResponse);

    } catch (err: AxiosError | any) {
        console.log(err);
        dispatch(addTicketAndBetSlip({ message: "", error: err?.response?.data ? err.response.data.error : "Something went wrong", loading: false, data: null }))
    }
}

export const getLastBetSlip = () => async (dispatch: (arg0: { payload: BetSlipState<BetSlipData>; type: "betSlip/addBetSlipNumber"; }) => void) => {
    dispatch(addBetSlipNumber({ loading: true, error: null, data: null, message: null }))

    try {
        const lastSlipResponse: BetSlipResponse<BetSlipData> = (await axiosInstance.get("ticket/lastSlip")).data;

        if (lastSlipResponse.message === "success") {
            dispatch(addBetSlipNumber({ loading: false, error: null, data: lastSlipResponse.data, message: lastSlipResponse.message }))
        } else {
            dispatch(addBetSlipNumber({ loading: false, error: lastSlipResponse.error, data: null, message: null }))
        }
    } catch (err: AxiosError | any) {
        dispatch(addBetSlipNumber({ message: "", error: err?.response?.data ? err.response.data.error : "Something went wrong", loading: false, data: null }))
    }
}