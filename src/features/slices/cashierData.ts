import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../../config/interceptor";


interface User {
    id: string;
    username: string;
}

interface DataItem {
    id: string;
    User: User;
}

interface ApiResponse {
    data: DataItem[];
    message: string;
    error: string | null;
}

interface CashierState {
    loading: boolean,
    error: string | null,
    message: string | null,
    data: DataItem[] | null
}

let initialState: CashierState = {
    loading: false,
    error: null,
    message: null,
    data: null
}

let cashierSlice = createSlice({
    name: "cashier",
    initialState: initialState,
    reducers: {
        addCashierData: (state, action: PayloadAction<CashierState>) => {
            state.loading = action.payload.loading;
            state.error = action.payload.error;
            state.message = action.payload.message;
            state.data = action.payload.data
        }
    }
})

export const { addCashierData } = cashierSlice.actions;

export default cashierSlice.reducer;

export const getCashierNames = (shopId: string | undefined) => async (dispatch: (arg0: { payload: CashierState; type: "cashier/addCashierData"; }) => void) => {
    dispatch(addCashierData({ loading: true, error: null, message: null, data: null }))

    try {
        const cashierResponse: ApiResponse = (await axiosInstance.get(`cashier/${shopId}`)).data;

        console.log(cashierResponse);

        if (cashierResponse.message === "success") {
            dispatch(addCashierData({ loading: false, error: null, message: cashierResponse.message, data: cashierResponse.data }))
        } else {
            dispatch(addCashierData({ loading: false, error: cashierResponse.error, message: null, data: null }))
        }
    } catch (err: AxiosError | any) {
        console.log(err);
        dispatch(addCashierData({ message: "", error: err?.response?.data ? err.response.data.error : "Something went wrong", loading: false, data: null }))
    }
}