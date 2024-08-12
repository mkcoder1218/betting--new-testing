import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import axiosInstance from "../../config/interceptor";

interface Game {
  id: string;
  gamenumber: number;
  result: number[] | null;
  status: string;
  startTime: string;
  shopId: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  username: string;
}

interface Cashier {
  User: User;
}

interface BetSlip {
  Cashier: Cashier;
}

export interface Ticket {
  id: string;
  ticketno: string;
  nums: number[];
  redeem: null | any;
  cancelled: boolean;
  stake: string;
  ticketExpiry: string;
  maxWin: number;
  win: number;
  oddId: string;
  cashierRedeemId: null | any;
  gameId: string;
  betSlipId: string;
  createdAt: string;
  updatedAt: string;
  Game: Game;
  BetSlip: BetSlip;
  gameType?: string
}

interface TicketResponse {
  data: Ticket[];
  message: string;
  error: null | any;
}

interface TicketState {
  loading: boolean;
  error: string | null;
  message: string | null;
  data: Ticket[];
}

let initialState: TicketState = {
  loading: false,
  error: null,
  message: null,
  data: [],
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState: initialState,
  reducers: {
    addTicket: (state, action: PayloadAction<TicketState>) => {
      state.loading = action.payload.loading;
      state.error = action.payload.error;
      state.message = action.payload.message;
      state.data = action.payload.data;
    },
  },
});

export const { addTicket } = ticketSlice.actions;

export default ticketSlice.reducer;

export const recallTickets =
  (cashierId: string[] | undefined) =>
  async (
    dispatch: (arg0: { payload: TicketState; type: "ticket/addTicket" }) => void
  ) => {
    dispatch(
      addTicket({ loading: true, error: null, message: null, data: [] })
    );

    try {
      const ticketData: TicketResponse = (
        await axiosInstance.post(`ticket/cashier/`, {
          cashierCreateId: cashierId,
        })
      ).data;

      if (ticketData.message === "success") {
        dispatch(
          addTicket({
            loading: false,
            error: null,
            message: ticketData.message,
            data: ticketData.data,
          })
        );
      } else {
        dispatch(
          addTicket({
            loading: false,
            error: ticketData.error,
            message: null,
            data: [],
          })
        );
      }
    } catch (err: AxiosError | any) {
      dispatch(
        addTicket({
          message: "",
          error: err?.response?.data
            ? err.response.data.error
            : "Something went wrong",
          loading: false,
          data: [],
        })
      );
    }
  };

export const printSelectedTickets = async (req: any) => {
    try {
        const printSelectedResponse = await axiosInstance.post("ticket/printEvent", req);

        if (printSelectedResponse.status === 200 || printSelectedResponse.status === 201) {
          const printSelectedData = await axios.post("http://0.0.0.0:5002/printEvent", printSelectedResponse.data.data)
        }
    } catch (err) {
        console.log(err);
    }
}

export const isPrinterUp = async () => {
  try {
    const printerStatus = await axios.get("http://0.0.0.0:5002/check");

    if (printerStatus.status === 200) {
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
};
