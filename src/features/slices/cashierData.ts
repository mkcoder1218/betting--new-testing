import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../../config/interceptor";
import { setuserActive } from "./gameType";
import { ShopDataApiResponse, ShopDatas } from "../../utils/patch";

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
  ShopData: ShopDatas | null;
}

const initialState: CashierState = {
  loading: false,
  error: null,
  message: null,
  data: null,
  ShopData: null,
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
      state.ShopData = action.payload.ShopData;
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
      const match =
        cashierResponse?.data &&
        cashierResponse.data.find((id) => id.id === user);
      if (user === match?.id) {
        if (!match?.active) {
          localStorage.clear();
          window.location.href = "https://retail2.playbetman2.com";
          dispatch(setuserActive(false));
        } else {
          dispatch(setuserActive(true));
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
export const getShopData =
  () =>
  async (
    dispatch: (arg0: {
      payload: CashierState;
      type: "cashier/loadShopData";
    }) => void
  ) => {
    try {
      const cashierResponse: ShopDataApiResponse = (
        await axiosInstance.get(`shop/loadShopData`)
      ).data;

      if (cashierResponse.message === "success") {
        dispatch(
          addCashierData({
            loading: false,
            error: null,
            message: cashierResponse.message,
            ShopData: cashierResponse.data,
          })
        );
      } else {
        dispatch(
          addCashierData({
            loading: false,
            error: cashierResponse.error,
            message: null,
            // ShopData: null,
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
        })
      );
    }
  };
