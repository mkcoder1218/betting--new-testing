import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { AxiosResponseWrapper } from "./userSlice";
import axiosInstance from "../../config/interceptor";


export interface OddMultiplier {
    id: string;
    numberLength: number;
    winLength: number;
    multiplier: number;
}

interface Odd {
    id: string;
    name: string;
    shopId: string;
    createdAt: string;
    updatedAt: string;
    OddMultipliers: OddMultiplier[];
}

interface ApiResponse {
    message: string;
    data: Odd;
    error: string | undefined
}

interface OddState {
    loading: boolean;
    error: string | null;
    message: string;
    odd: Odd | null
}

let initialState: OddState = {
    loading: false,
    error: null,
    odd: null,
    message: ""
}

const oddSlice = createSlice({
    name: "odd",
    initialState: initialState,
    reducers: {
        addOdd: (state, action: PayloadAction<OddState>) => {
            state.error = action.payload.error;
            state.loading = action.payload.loading;
            state.message = action.payload.message;
            state.odd = action.payload.odd
        }
    }
})

export const { addOdd } = oddSlice.actions;

export default oddSlice.reducer;

export const getOdds = (shopId: string | undefined) => async (dispatch: (arg0: { payload: OddState; type: "odd/addOdd"; }) => void) => {
    dispatch(addOdd({ loading: true, error: "", message: "", odd: null }))

    try {
        dispatch(addOdd({ loading: false, error: "", message: "", odd: null }))
        const oddResponse: AxiosResponseWrapper<ApiResponse> = (await axiosInstance.get(`odd/${shopId}`));

        if (oddResponse.data.message === "success") {
            dispatch(addOdd({ loading: false, error: "", message: "success", odd: oddResponse.data.data }))
        } else {
            dispatch(addOdd({ loading: false, error: oddResponse.error, message: "", odd: null }))
        }
    } catch (err: AxiosError | any) {
        console.log(err);
        dispatch(addOdd({ message: "", error: err?.response?.data ? err.response.data.error : "Something went wrong", loading: false, odd: null }))
    }
}

