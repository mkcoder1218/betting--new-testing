import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../../config/interceptor";


interface SummaryData {
    totalTickets: string;
    totalBets: string;
    redeemCount: number;
    cancelCount: number;
    netAmount: number;
}

interface Response {
    data: SummaryData;
    message: string;
    error: null | any;
}

interface SummaryState {
    loading: boolean,
    error: string | null,
    message: string | null,
    data: SummaryData | null
}

let initialState: SummaryState = {
    loading: false,
    error: null,
    message: null,
    data: null
}

const summarySlice = createSlice({
    name: "summary",
    initialState: initialState,
    reducers: {
        addSummary: (state, action: PayloadAction<SummaryState>) => {
            state.loading = action.payload.loading;
            state.error = action.payload.error;
            state.message = action.payload.message;
            state.data = action.payload.data
        }
    }
})

export const { addSummary } = summarySlice.actions;

export default summarySlice.reducer;

export const getSummaryData = (from: string | undefined, to: string | undefined, cashierId: string | undefined) => async (dispatch: (arg0: { payload: SummaryState; type: "summary/addSummary"; }) => void) => {
    dispatch(addSummary({ loading: true, error: null, message: null, data: null }))

    try {
        const summaryData: Response = (await axiosInstance.post("ticket/summary", { from: from, to: to, cashierId: cashierId })).data;

        if (summaryData.message === "success") {
            dispatch(addSummary({ loading: false, error: null, message: summaryData.message, data: summaryData.data }))
        } else {
            dispatch(addSummary({ loading: false, error: summaryData.error, message: null, data: null }))
        }
    } catch (err: AxiosError | any) {
        console.log(err);
        dispatch(addSummary({ message: "", error: err?.response?.data ? err.response.data.error : "Something went wrong", loading: false, data: null }))
    }
}