import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/interceptor";
import axios, { AxiosError } from "axios";
import { clearNumbers } from "./pickerSlice";


interface BetSlipData {
  betSlipNumber: string;
  gameType?: string
}

interface BetSlipResponse<T> {
  data: T | null;
  message: string;
  error: null;
}

export interface Ticket {
  id: string;
  ticketno: string;
  nums: string;
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
  gameType?: string;
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
  Tickets: Ticket[] | null;
  gameType?: string;
}

export interface ToPrint {
  dataToPrint: any;
}

interface BetSlipState<T> {
  loading: boolean;
  error: string | null;
  message: string | null;
  data: T | null;
}

const initialState: BetSlipState<BetSlip | BetSlipData> = {
  loading: false,
  error: null,
  message: null,
  data: {
    betSlipNumber: '',
    gameType: 'SmartPlayKeno'
  },
};

const betSlipSlice = createSlice({
  name: "betSlip",
  initialState: initialState,
  reducers: {
    addBetSlipNumber: (
      state,
      action: PayloadAction<BetSlipState<BetSlipData>>
    ) => {
      state.data = action.payload.data;
    },
  
    addTicketAndBetSlip: (
      state,
      action: PayloadAction<BetSlipState<BetSlip>>
    ) => {
      state.loading = action.payload.loading;
      state.error = action.payload.error;
      state.message = action.payload.message;
      state.data = action.payload.data;
    },
  },
});

export const { addBetSlipNumber, addTicketAndBetSlip, addGameType } = betSlipSlice.actions;

export default betSlipSlice.reducer;

export const createBetSlipAndTicket =
  (
    data: any,
    refreshBetSlipNumber: () => void,
    clearSlip: () => void,
    toggleStatus: (val: boolean) => void,
    clearNumberSelection: () => void
  ) =>
  async (
    dispatch: (arg0: {
      payload: BetSlipState<BetSlip>;
      type: "betSlip/addTicketAndBetSlip";
    }) => void
  ) => {
    dispatch(
      addTicketAndBetSlip({
        loading: true,
        error: null,
        message: null,
        data: null,
      })
    );

    try {
      const betSlipResponse: BetSlipResponse<ToPrint> = (
        await axiosInstance.post("ticket/betslip", data)
      ).data;

      if (betSlipResponse.message === "betslip added successfully") {
        dispatch(
          addTicketAndBetSlip({
            loading: false,
            error: null,
            message: betSlipResponse.message,
            data: null,
          })
        );
        refreshBetSlipNumber();
        toggleStatus(true);
        clearSlip();

        setTimeout(() => {
          toggleStatus(false);
          clearNumberSelection();
        }, 500);

        try {
          const printResponse = await axios.post(
            "http://127.0.0.1:5002/printTicket",
            betSlipResponse.data

          );

        } catch (err) {
          console.log("print failed");
        }
      } else {
        toggleStatus(true);
        dispatch(
          addTicketAndBetSlip({
            loading: false,
            error: betSlipResponse.error,
            message: null,
            data: null,
          })
        );
      }
    } catch (err: AxiosError | any) {
      dispatch(
        addTicketAndBetSlip({
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

export const getLastBetSlip =
  () =>
  async (
    dispatch: (arg0: {
      payload: BetSlipState<BetSlipData>;
      type: "betSlip/addBetSlipNumber";
    }) => void
  ) => {
    dispatch(
      addBetSlipNumber({
        loading: true,
        error: null,
        data: null,
        message: null,
      })
    );

    try {
      const lastSlipResponse: BetSlipResponse<BetSlipData> = (
        await axiosInstance.get("ticket/lastSlip")
      ).data;

      if (lastSlipResponse.message === "success") {
        dispatch(
          addBetSlipNumber({
            loading: false,
            error: null,
            data: lastSlipResponse.data,
            message: lastSlipResponse.message,
          })
        );
      } else {
        dispatch(
          addBetSlipNumber({
            loading: false,
            error: lastSlipResponse.error,
            data: null,
            message: null,
          })
        );
      }
    } catch (err: AxiosError | any) {
      dispatch(
        addBetSlipNumber({
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
