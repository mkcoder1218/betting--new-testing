import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/interceptor";
import axios, { AxiosError } from "axios";
import { clearNumbers } from "./pickerSlice";
import { GameData } from "./RacingGameSlice";
import moment from "moment";

interface Game {
  gamenumber: number;
  status: string;
  result: string | null;
  gameType: string;
  gameData: string;
  selection: number[];
}

interface Ticket {
  id: string;
  ticketno: string;
  nums: number[];
  redeem: null | any;
  stake: string;
  ticketNumber: number;
  ticketExpiry: string;
  maxWin: number;
  win: number;
  oddId: string;
  cashierRedeemId: null | string;
  gameId: string;
  betSlipId: string;
  createdAt: string;
  updatedAt: string;
  Game: GameData;
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
}

interface BetSlipResponse {
  data: BetSlip | null;
  message: string;
  error: null;
}

interface BetSlipState {
  loading: boolean;
  error: string | null;
  message: string | null;
  data: BetSlip | null;
}

let initialState: BetSlipState = {
  loading: false,
  error: null,
  message: null,
  data: null,
};

const betDataSlice = createSlice({
  name: "betSlip",
  initialState: initialState,
  reducers: {
    addBetData: (state, action: PayloadAction<BetSlipState>) => {
      state.loading = action.payload.loading;
      state.error = action.payload.error;
      state.message = action.payload.message;
      state.data = action.payload.data;
    },
    clearBetData: (state) => {
      state.data = null;
      state.error = null;
      state.message = null;
      state.loading = false;
    },
  },
});

export const { addBetData, clearBetData } = betDataSlice.actions;

export default betDataSlice.reducer;

export const getTicketsToCancel =
  (betslip: number | undefined) =>
  async (
    dispatch: (arg0: {
      payload: BetSlipState;
      type: "betSlip/addBetData";
    }) => void
  ) => {
    dispatch(
      addBetData({ loading: true, error: null, message: null, data: null })
    );

    try {
      const ticketsToCancel: BetSlipResponse = (
        await axiosInstance.get(`ticket/betslip/byNumber/toCancel/${betslip}`)
      ).data;

      if (ticketsToCancel.message === "success") {
        dispatch(
          addBetData({
            loading: false,
            error: null,
            message: ticketsToCancel.message,
            data: ticketsToCancel.data as BetSlip,
          })
        );
      } else {
        dispatch(
          addBetData({
            loading: true,
            error: ticketsToCancel.error,
            message: null,
            data: null,
          })
        );
      }
    } catch (err: AxiosError | any) {
      dispatch(
        addBetData({
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

export const getTicketsToRedeem =
  (betslip: number | undefined) =>
  async (
    dispatch: (arg0: {
      payload: BetSlipState;
      type: "betSlip/addBetData";
    }) => void
  ) => {
    dispatch(
      addBetData({ loading: true, error: null, message: null, data: null })
    );

    try {
      const ticketsToCancel: BetSlipResponse = (
        await axiosInstance.get(`ticket/betslip/byNumber/toRedeem/${betslip}`)
      ).data;

      if (ticketsToCancel.message === "success") {
        dispatch(
          addBetData({
            loading: false,
            error: null,
            message: ticketsToCancel.message,
            data: ticketsToCancel.data as BetSlip,
          })
        );
      } else {
        dispatch(
          addBetData({
            loading: true,
            error: ticketsToCancel.error,
            message: null,
            data: null,
          })
        );
      }
    } catch (err: AxiosError | any) {
      dispatch(
        addBetData({
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
const cancelPrint = (data) => {
  const lists = [];

  const currentDateTime = moment().format("YYYY/MM/DD HH:mm:ss");
  const currentTime = moment().format("HH:mm:ss");
  console.log("datatoprint", data);
  lists.push(
    {
      LineItem: data.shopName,
      FontName: "Arial",
      FontSize: 8,
      Bold: false,
      Italic: false,
      Alignment: 2,
      NewLine: true,
      PartOfHeader: true,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: data.cashierName,
      FontName: "Arial",
      FontSize: 8,
      Bold: false,
      Italic: false,
      Alignment: 2,
      NewLine: true,
      PartOfHeader: true,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: currentDateTime,
      FontName: "Arial",
      FontSize: 8,
      Bold: false,
      Italic: false,
      Alignment: 2,
      NewLine: true,
      PartOfHeader: true,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: "Cancel Receipt",
      FontName: "Arial",
      FontSize: 8,
      Bold: true,
      Italic: false,
      Alignment: 1,
      NewLine: true,
      PartOfHeader: false,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: data.betSlipNumber,
      FontName: "Arial",
      FontSize: 8,
      Bold: true,
      Italic: false,
      Alignment: 1,
      NewLine: true,
      PartOfHeader: false,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: null,
      FontName: "Arial",
      FontSize: 8,
      Bold: false,
      Italic: false,
      Alignment: 0,
      NewLine: true,
      PartOfHeader: false,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: "Cancelled Amount:",
      FontName: "Arial",
      FontSize: 8,
      Bold: true,
      Italic: false,
      Alignment: 0,
      NewLine: true,
      PartOfHeader: false,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: data.cancelledAmount,
      FontName: "Arial",
      FontSize: 8,
      Bold: false,
      Italic: false,
      Alignment: 2,
      NewLine: false,
      PartOfHeader: false,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: "Cancelled Time:",
      FontName: "Arial",
      FontSize: 8,
      Bold: true,
      Italic: false,
      Alignment: 0,
      NewLine: true,
      PartOfHeader: false,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: currentTime,
      FontName: "Arial",
      FontSize: 8,
      Bold: false,
      Italic: false,
      Alignment: 2,
      NewLine: false,
      PartOfHeader: false,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    }
  );
  return {
    Content: lists,
  };
};
export const cancelTicket =
  (
    gamenumber: number | undefined,
    betslip: number | undefined,
    cashierCreateId: string | undefined
  ) =>
  async (
    dispatch: (arg0: {
      payload: BetSlipState;
      type: "betSlip/addBetData";
    }) => void
  ) => {
    dispatch(
      addBetData({ loading: true, error: null, message: null, data: null })
    );

    try {
      const cancelTicketResponse = (
        await axiosInstance.put("ticket/cancel", {
          gamenumber,
          betslip,
          cashierCreateId,
        })
      ).data;

      if (cancelTicketResponse.message === "Bet cancelled successfully") {
        try {
          const printCancelRes = await axios.post(
            "http://localhost:8080/PRINT/",
            cancelPrint(cancelTicketResponse.data),
            {
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded; charset=UTF-8",
              },
            }
          );
        } catch (err) {
          console.log(err);
        }

        dispatch(
          addBetData({
            loading: false,
            error: null,
            message: "Ticket cancelled successfully",
            data: null,
          })
        );
      } else {
        dispatch(
          addBetData({
            loading: true,
            error: cancelTicketResponse.error,
            message: null,
            data: null,
          })
        );
      }

      setTimeout(() => {
        dispatch(
          addBetData({ loading: false, error: null, message: null, data: null })
        );
      }, 2000);
    } catch (err: AxiosError | any) {
      dispatch(
        addBetData({
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

const printReedem = (data) => {
  const lists = [];
  console.log("DataTransfer", data);
  const currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
  const currentTime = moment().format("HH:mm:ss");
  lists.push(
    {
      LineItem: data.shopName,
      FontName: "Arial",
      FontSize: 8,
      Bold: false,
      Italic: false,
      Alignment: 2,
      NewLine: true,
      PartOfHeader: true,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: data.cashierName,
      FontName: "Arial",
      FontSize: 8,
      Bold: false,
      Italic: false,
      Alignment: 2,
      NewLine: true,
      PartOfHeader: true,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: currentDateTime,
      FontName: "Arial",
      FontSize: 8,
      Bold: false,
      Italic: false,
      Alignment: 2,
      NewLine: true,
      PartOfHeader: true,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: "Redeem Receipt",
      FontName: "Arial",
      FontSize: 8,
      Bold: true,
      Italic: false,
      Alignment: 1,
      NewLine: true,
      PartOfHeader: false,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: data.betSlipNumber,
      FontName: "Arial",
      FontSize: 8,
      Bold: true,
      Italic: false,
      Alignment: 1,
      NewLine: true,
      PartOfHeader: false,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: null,
      FontName: "Arial",
      FontSize: 8,
      Bold: false,
      Italic: false,
      Alignment: 0,
      NewLine: true,
      PartOfHeader: false,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: "Redeemed Amount:",
      FontName: "Arial",
      FontSize: 8,
      Bold: true,
      Italic: false,
      Alignment: 0,
      NewLine: true,
      PartOfHeader: false,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: data.redeemedAmount,
      FontName: "Arial",
      FontSize: 8,
      Bold: true,
      Italic: false,
      Alignment: 2,
      NewLine: false,
      PartOfHeader: false,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: "Redeemed Time:",
      FontName: "Arial",
      FontSize: 8,
      Bold: true,
      Italic: false,
      Alignment: 0,
      NewLine: true,
      PartOfHeader: false,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: currentTime,
      FontName: "Arial",
      FontSize: 8,
      Bold: false,
      Italic: false,
      Alignment: 2,
      NewLine: false,
      PartOfHeader: false,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem: null,
      FontName: "Arial",
      FontSize: 8,
      Bold: false,
      Italic: false,
      Alignment: 0,
      NewLine: true,
      PartOfHeader: false,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    },
    {
      LineItem:
        parseFloat(data.redeemedAmount) > 0
          ? "Winning Ticket"
          : "Not a Winning Ticket",
      FontName: "Arial",
      FontSize: 8,
      Bold: true,
      Italic: false,
      Alignment: 1,
      NewLine: true,
      PartOfHeader: false,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: false,
      ImageFileType: null,
      Underline: false,
    }
  );
  return {
    Content: lists,
  };
};
export const redeemTicket =
  (cashierRedeemId: string | undefined, betslip: number | undefined) =>
  async (
    dispatch: (arg0: {
      payload: BetSlipState;
      type: "betSlip/addBetData";
    }) => void
  ) => {
    dispatch(
      addBetData({ loading: true, error: null, message: null, data: null })
    );

    try {
      const redeemTicketResposne = (
        await axiosInstance.post("ticket/redeem", { cashierRedeemId, betslip })
      ).data;

      if (redeemTicketResposne.message === "Ticket redeemed successfully") {
        try {
          await axios.post(
            "http://localhost:8080/PRINT/",
            printReedem(redeemTicketResposne.data),
            {
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded; charset=UTF-8",
              },
            }
          );
        } catch (err) {
          console.log(err);
        }

        dispatch(
          addBetData({
            loading: false,
            error: null,
            message: "Ticket redeemed successfully",
            data: null,
          })
        );
      } else {
        dispatch(
          addBetData({
            loading: true,
            error: redeemTicketResposne.error,
            message: null,
            data: null,
          })
        );
      }

      setTimeout(() => {
        dispatch(
          addBetData({ loading: false, error: null, message: null, data: null })
        );
      }, 2000);
    } catch (err: AxiosError | any) {
      dispatch(
        addBetData({
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
