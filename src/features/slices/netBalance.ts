import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/interceptor";
import { AxiosError } from "axios";

interface Data {
  netAmount: string;
  creditAmount: string;
}

interface ApiResponse {
  data: Data[];
  message: string | null;
  error: string | null;
}

interface BalanceState {
  loading: boolean;
  message: string | null;
  error: string | null;
  data: Data[] | null;
}

let initialState: BalanceState = {
  loading: false,
  error: null,
  message: null,
  data: null,
};

let netBalanceSlice = createSlice({
  name: "netbalance",
  initialState: initialState,
  reducers: {
    addNetBalance: (state, action: PayloadAction<BalanceState>) => {
      state.loading = action.payload.loading;
      state.error = action.payload.error;
      state.data = action.payload.data;
      state.message = action.payload.message;
    },
  },
});

export const { addNetBalance } = netBalanceSlice.actions;

export default netBalanceSlice.reducer;

export const getNetBalance =
  (cashierId: string | undefined) =>
  async (
    dispatch: (arg0: {
      payload: BalanceState;
      type: "netbalance/addNetBalance";
    }) => void
  ) => {
    dispatch(
      addNetBalance({ loading: true, error: null, message: null, data: null })
    );

    try {
      const netBalanceRes: ApiResponse = (
        await axiosInstance.get(`ticket/balance/cashier/${cashierId}`)
      ).data;

      if (netBalanceRes.message === "success") {
        dispatch(
          addNetBalance({
            loading: false,
            error: null,
            message: netBalanceRes.message,
            data: netBalanceRes.data,
          })
        );
      } else {
        dispatch(
          addNetBalance({
            loading: false,
            error: netBalanceRes.error,
            message: null,
            data: null,
          })
        );
      }
    } catch (err: AxiosError | any) {
      dispatch(
        addNetBalance({
          data: null,
          message: "",
          error: err?.response?.data
            ? err.response.data.error
            : "Something went wrong",
          loading: false,
        })
      );
    }
  };
