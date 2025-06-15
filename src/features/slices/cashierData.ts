import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../../config/interceptor";
import {  setuserActive } from './gameType';

interface User {
  id: string;
  username: string;
}

interface ShopData {
  id: string;
  name: string;
  address: string;
  phone: string;
  rtp: number;
  maxWin: number;
  agentId: string;
  oddId: string;
  gameStartNumber: number;
  depositBalance: number;
  createdAt: string;
  updatedAt: string;
}

interface DataItem {
  id: string;
  User: User;
  Shop?: ShopData;
}

interface ApiResponse {
  data: DataItem[];
  message: string;
  error: string | null;
}

interface CashierState {
  loading: boolean;
  error: string | null;
  message: string | null;
  data: DataItem[] | null;
}

const initialState: CashierState = {
  loading: false,
  error: null,
  message: null,
  data: null,
};

const cashierSlice = createSlice({
  name: "cashier",
  initialState: initialState,
  reducers: {
    addCashierData: (state, action: PayloadAction<CashierState>) => {
      state.loading = action.payload.loading;
      state.error = action.payload.error;
      state.message = action.payload.message;
      state.data = action.payload.data;
    },
  },
});

export const { addCashierData } = cashierSlice.actions;

export default cashierSlice.reducer;

export const getCashierNames =
  (shopId: string | undefined) =>
  async (
    dispatch: (arg0: {
      payload: CashierState;
      type: "cashier/addCashierData";
    }) => void
  ) => {
    dispatch(
      addCashierData({ loading: true, error: null, message: null, data: null })
    );

    try {
      const cashierResponse: ApiResponse = (
        await axiosInstance.get(`cashier/${shopId}`)
      ).data;
    
const session = localStorage.getItem("user_session");
const user = session && JSON.parse(session)?.Cashier?.id;
      const match = cashierResponse?.data && cashierResponse.data.find((id) => id.id === user)
            console.log("netBalanceRes", cashierResponse, "id ", user,'Match',match);
      if (user === match?.id) {
        if (!match?.active) {
          localStorage.clear()
         dispatch(setuserActive(false))
          
        }
        else {
          dispatch(setuserActive(true))
        }
}
      if (cashierResponse.message === "success") {
        dispatch(
          addCashierData({
            loading: false,
            error: null,
            message: cashierResponse.message,
            data: cashierResponse.data,
          })
        );
      } else {
        dispatch(
          addCashierData({
            loading: false,
            error: cashierResponse.error,
            message: null,
            data: null,
          })
        );
      }
    } catch (err: AxiosError | any) {
      dispatch(
        addCashierData({
          message: "",
          error: err?.response?.data
            ? err.response.data.error
            : "Something went wrong",
          loading: false,
          data: null,
        })
      );
    }
  };
