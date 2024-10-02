import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import axiosInstance from "../../config/interceptor";
import { updateBetSlipItem } from "./pickerSlice";

export interface CashierData {
  cashierCreateId: string;
  totalTickets: string;
  totalBets: string;
  cancelCount: string;
  redeemCount: string;
  totalRedeemAmount: string;
  totalCancelAmount: string;
  netAmount: string;
  "Cashier.id": string;
  "Cashier.User.id": string;
  "Cashier.User.username": string;
}
export interface ResultData {
  cashierName: string;
  date: string;
  Game: string;
  eventId: string;
  gameTime: string;
  formattedTime: string;
  result: string[];
  shopName: string;
}
interface GameData {
  id: string;
  gamenumber: number;
  result: string[] | null;
  status: string; // Adjust status values as needed
  startTime: string; // Use Date if you prefer date objects
  shopId: string;
  gameRTP: number | null;
  actualRTP: number | null;
  createdAt: string; // Use Date if you prefer date objects
  updatedAt: string; // Use Date if you prefer date objects
  gameData: string;
  gameType: string;
}

interface Response {
  data: CashierData[];
  message: string;
  error: null | any;
}

interface SummaryState {
  loading: boolean;
  error: string | null;
  message: string | null;
  data: CashierData[] | null;
  eventResult?: GameData[] | null;
}
interface GameAPIResult {
  loading: boolean;
  error: string | null;
  message: string | null;
  data: GameData[] | null;
}

let initialState: SummaryState = {
  loading: false,
  error: null,
  message: null,
  data: null,
  eventResult: null,
};

const summarySlice = createSlice({
  name: "summary",
  initialState: initialState,
  reducers: {
    addSummary: (state, action: PayloadAction<SummaryState>) => {
      state.loading = action.payload.loading;
      state.error = action.payload.error;
      state.message = action.payload.message;
      state.data = action.payload.data;
    },
    udpateGameResult: (state, action: PayloadAction<GameAPIResult>) => {
      state.loading = action.payload.loading;
      state.error = action.payload.error;
      state.message = action.payload.message;
      state.eventResult = action.payload.data;
    },
  },
});

export const { addSummary, udpateGameResult } = summarySlice.actions;

export default summarySlice.reducer;

export const getSummaryData =
  (
    from: string | undefined,
    to: string | undefined,
    cashierId: string | undefined,
    cashierIId: string | undefined
  ) =>
    async (
      dispatch: (arg0: {
        payload: SummaryState;
        type: "summary/addSummary";
      }) => void
    ) => {
      dispatch(
        addSummary({ loading: true, error: null, message: null, data: null })
      );

      try {
        const summaryData: Response = (
          await axiosInstance.post("ticket/summary", {
            from: from,
            to: to,
            cashierId: cashierId,
          })
        ).data;

        if (summaryData.message === "success") {
          dispatch(
            addSummary({
              loading: false,
              error: null,
              message: summaryData.message,
              data: summaryData.data.filter((value, index) => {
                return value.cashierCreateId === cashierIId;
              }),
            })
          );
        } else {
          dispatch(
            addSummary({
              loading: false,
              error: summaryData.error,
              message: null,
              data: null,
            })
          );
        }
      } catch (err: AxiosError | any) {
        dispatch(
          addSummary({
            message: "",
            error:
              typeof err?.response?.data?.error === "string"
                ? err.response.data.error
                : "Something went wrong",
            loading: false,
            data: null,
          })
        );
      }
    };
export const getEventResult =
  (
    from: string | undefined,
    to: string | undefined,
    gameNumber: string | undefined,
    shopId: string | undefined
  ) =>
    async (
      dispatch: (arg0: {
        payload: GameAPIResult;
        type: "summary/udpateGameResult";
      }) => void
    ) => {
      dispatch(
        udpateGameResult({
          loading: true,
          error: null,
          message: null,
          data: null,
        })
      );

      try {
        const summaryData: GameAPIResult = (
          await axiosInstance.post("/game/gameData", {
            from: from,
            to: to,
            gameNumber: gameNumber,
            shopId: shopId,
          })
        ).data;

        if (summaryData.message === "success") {
          dispatch(
            udpateGameResult({
              loading: false,
              error: null,
              message: summaryData.message,
              data: summaryData.data,
            })
          );
        } else {
          dispatch(
            udpateGameResult({
              loading: false,
              error: summaryData.error,
              message: null,
              data: null,
            })
          );
        }
      } catch (err: AxiosError | any) {
        dispatch(
          udpateGameResult({
            message: "",
            error:
              typeof err?.response?.data?.error === "string"
                ? err.response.data.error
                : "Something went wrong",
            loading: false,
            data: null,
          })
        );
      }
    };

export const printSummaryToBackend = async (data: any) => {
  try {
    const printResponse = await axiosInstance.post("ticket/printSummary", data);

    if (printResponse.status === 200 || printResponse.status === 201) {
      const callPrinterWithData = await axios.post(
        "http://127.0.0.1:5002/printSummary",
        printResponse.data.data
      );
    }
  } catch (err) {
    console.log(err);
  }
};

const ResultData = (data) => {
  const map = data.Game !== 'Keno' && data.Game !== 'Spin And Win' && data.Market.length > 0 ? data.Market.map(data => {
    return (data)
  }) : ''
  const listItems = []
  console.log('datain', data)
  listItems.push({
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
    Underline: false
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
      Underline: false
    },
    {
      LineItem: data.formattedTime,
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
      Underline: false
    },
    {
      LineItem: "Event Result",
      FontName: "Arial",
      FontSize: 9,
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
      Underline: false
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
      Underline: false
    },
    {
      LineItem: "Game",
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
      Underline: false
    },
    {
      LineItem: data.Game,
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
      Underline: false
    },
    {
      LineItem: "Event ID",
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
      Underline: false
    },
    {
      LineItem: data.eventId.toString(),
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
      Underline: false
    },
    {
      LineItem: "Time",
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
      Underline: false
    },
    {
      LineItem: data.gameTime.toString(),
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
      Underline: false
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
      Underline: false
    })
  data.Game !== 'Keno' && data.Game !== 'Spin And Win' ? data.result.map(result => {
    listItems.push({
      LineItem: result,
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
      Underline: false
    })


  }) : listItems.push({
    LineItem: data.result,
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
    Underline: false
  })

  listItems.push({
    LineItem: map,
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
    Underline: false
  })
  listItems.push({
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
    Underline: false
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
      Underline: false
    })
  return {
    Content: listItems,
  };
}
export const printResultToBackend = async (data: any) => {
  try {
    const callPrinterWithData = await axios.post(
      "http://localhost:8080/PRINT",
      ResultData(data)
    );
  } catch (err) {
    console.log(err);
  }
};
