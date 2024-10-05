import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import axiosInstance from "../../config/interceptor";
import { TicketInterface } from "../../utils/ticket.interface";
import { generateEvenAndOddArrays } from "../../utils/evenoddgenerate";
import { formatNumberWithCommas } from "../../utils/numberGenerate";
import { ColumnMap } from "../../utils/columnMap";
import { MapRedAndBlack } from "../../utils/redblackMap";
import { range } from "../../utils/range";

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
  gameType?: string;
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
function formatNumber(num) {
  if (num % 1 !== 0) {
    return num.toString();
  } else {
    return num.toFixed(2);
  }
}
function transformData(data) {
  const lineItems = [];
  console.log("daada", data);
  // Add header information
  lineItems.push({
    LineItem: data.betSlipNumber,
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
  });

  lineItems.push({
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
  });

  lineItems.push({
    LineItem: data.gameStart,
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
  });

  // Iterate over tickets and add ticket information
  data.tickets.forEach((ticket) => {
    lineItems.push(
      {
        LineItem:
          ticket.oddType.charAt(0).toUpperCase() +
          ticket.oddType.slice(1).toLowerCase(),
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
        LineItem: `Br ${formatNumber(parseFloat(ticket.stake))}`,
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
      }
    );
    lineItems.push({
      LineItem: ticket.game,
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
    });

    lineItems.push({
      LineItem:
        ticket.game.split(" ")[0] === "Keno" ||
        ticket.game.split(" ")[0] === "Spin"
          ? "    " + ticket.selected
          : "    " +
            ticket.selected.split(" ")[0] +
            ". " +
            ticket.playerName +
            " " +
            ticket.selected.split(" ")[1],
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
    });
    lineItems.push(
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
      }
    );
    // Add stake information
  });
  lineItems.push(
    {
      LineItem: "Total Stake",
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
      LineItem: "Br " + data.stake,
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
    }
  );
  // Add payout information
  lineItems.push({
    LineItem: "Min Payout (Incl. Stake)",
    FontName: "Arial",
    FontSize: 9,
    Bold: true,
    Italic: false,
    Alignment: 0,
    NewLine: true,
    PartOfHeader: false,
    PrintDoubleBlock: true,
    RowsInDoubleBlock: 2,
    IsImage: false,
    IsTerms: false,
    ImageFileType: null,
    Underline: false,
  });

  lineItems.push({
    LineItem: `Br ${data.minPayout}`,
    FontName: "Arial",
    FontSize: 9,
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
  });

  lineItems.push({
    LineItem: "Max Payout (Incl. Stake)",
    FontName: "Arial",
    FontSize: 9,
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
  });

  lineItems.push({
    LineItem: `Br ${data.maxPayout}`,
    FontName: "Arial",
    FontSize: 9,
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
  });
  lineItems.push(
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
    }
  );
  lineItems.push({
    LineItem: `*${data.betSlipNumber}*`,
    FontName: "BetManBarcode",
    FontSize: 11,
    Bold: false,
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
  });
  lineItems.push(
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
      LineItem: "N/A",
      FontName: "Arial",
      FontSize: 5,
      Bold: false,
      Italic: false,
      Alignment: 1,
      NewLine: true,
      PartOfHeader: false,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: true,
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
      LineItem: ".",
      FontName: "Arial",
      FontSize: 5,
      Bold: false,
      Italic: false,
      Alignment: 1,
      NewLine: true,
      PartOfHeader: false,
      PrintDoubleBlock: false,
      RowsInDoubleBlock: 2,
      IsImage: false,
      IsTerms: true,
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
    }
  );
  return {
    Content: lineItems,
    PrintWatermark: data.isCopy === false ? false : true,
  };
}
export const printSelectedTickets = async (req: any) => {
  try {
    console.log("req:", req);
    const printSelectedResponse = await axiosInstance.post(
      "ticket/printSelected",
      req
    );
    if (printSelectedResponse.data) {
      let updateTicket = printSelectedResponse?.data?.data;
      const { evens, odds } = generateEvenAndOddArrays(1, 36);
      updateTicket.minPayout = formatNumberWithCommas(
        parseFloat(updateTicket.minPayout + "")
      );
      updateTicket.maxPayout = formatNumberWithCommas(
        parseFloat(updateTicket.maxPayout + "")
      );
      updateTicket.stake = parseFloat(updateTicket.stake).toFixed(2);
      console.log("updateTicket", updateTicket);
      updateTicket.tickets.map((ticket) => {
        const gameParts = ticket.game.split(" "); // Split the string into parts
        const firstPart = gameParts[0];
        let selected = ticket.selected;
        let oddType = ticket.oddType;

        switch (firstPart) {
          case "SpeedSkating":
            gameParts[0] = "Speed Skating";
            break;
          case "SpinAndWin":
            gameParts[0] = "Spin And Win";
            console.log(selected);
            ColumnMap.col1.every((item) => selected.includes(Number(item)))
              ? ((selected =
                  "col1 " +
                  ticket.selected.split(" ")[
                    ticket.selected.split(" ").length - 1
                  ]),
                (oddType = "Column"))
              : ColumnMap.col2.every((item) => selected.includes(Number(item)))
              ? ((selected =
                  "col2 " +
                  ticket.selected.split(" ")[
                    ticket.selected.split(" ").length - 1
                  ]),
                (oddType = "Column"))
              : ColumnMap.col3.every((item) => selected.includes(Number(item)))
              ? ((selected =
                  "col3 " +
                  ticket.selected.split(" ")[
                    ticket.selected.split(" ").length - 1
                  ]),
                (oddType = "Column"))
              : MapRedAndBlack.Black.every((item) =>
                  selected.includes(Number(item))
                )
              ? ((selected =
                  "Black " +
                  ticket.selected.split(" ")[
                    ticket.selected.split(" ").length - 1
                  ]),
                (oddType = "Color"))
              : MapRedAndBlack.Red.every((item) =>
                  selected.includes(Number(item))
                )
              ? ((selected =
                  "Red " +
                  ticket.selected.split(" ")[
                    ticket.selected.split(" ").length - 1
                  ]),
                (oddType = "Color"))
              : range(1, 18).every((item) => selected.includes(Number(item)))
              ? ((selected =
                  "1-18 " +
                  ticket.selected.split(" ")[
                    ticket.selected.split(" ").length - 1
                  ]),
                (oddType = "High/Low"))
              : range(19, 36).every((item) => selected.includes(Number(item)))
              ? ((selected =
                  "19-36 " +
                  ticket.selected.split(" ")[
                    ticket.selected.split(" ").length - 1
                  ]),
                (oddType = "High/Low"))
              : evens.every((item) => selected.includes(Number(item)))
              ? ((selected =
                  "Even " +
                  ticket.selected.split(" ")[
                    ticket.selected.split(" ").length - 1
                  ]),
                (oddType = "Odd/Even"))
              : odds.every((item) => selected.includes(Number(item)))
              ? ((selected =
                  "Odd " +
                  ticket.selected.split(" ")[
                    ticket.selected.split(" ").length - 1
                  ]),
                (oddType = "Odd/Even"))
              : range(1, 12).every((item) => selected.includes(Number(item)))
              ? ((selected =
                  "1st 12 " +
                  ticket.selected.split(" ")[
                    ticket.selected.split(" ").length - 1
                  ]),
                (oddType = "Dozens"))
              : range(13, 24).every((item) => selected.includes(Number(item)))
              ? ((selected =
                  "2nd 12 " +
                  ticket.selected.split(" ")[
                    ticket.selected.split(" ").length - 1
                  ]),
                (oddType = "Dozens"))
              : range(25, 36).every((item) => selected.includes(Number(item)))
              ? ((selected =
                  "3rd 12 " +
                  ticket.selected.split(" ")[
                    ticket.selected.split(" ").length - 1
                  ]),
                (oddType = "Dozens"))
              : oddType.split(")")[0] === "Selector(color"
              ? (oddType = "Sector(Colour)")
              : oddType === "Neighbors"
              ? (selected = selected.split(", ").join("/"))
              : "";
            break;
          case "DashingDerby":
            gameParts[0] = "Horse Racing";
            break;
          case "MotorRacing":
            gameParts[0] = "Motor Racing";
            break;
          case "PlatinumHounds":
            gameParts[0] = "GrayHound Racing";
            break;
          case "CycleRacing":
            gameParts[0] = "Track Racing";
            break;
          case "PreRecRealDogs":
            gameParts[0] = "GreyHound RACING";
            break;
          case "SingleSeaterMotorRacing":
            gameParts[0] = "SS Motor Racing";
            break;
          case "SteepleChase":
            gameParts[0] = "Steeple Chase Racing";
            break;
          case "HarnessRacing":
            gameParts[0] = "Harness Racing";
            break;
          default:
            gameParts[0] = "Keno";
        }
        ticket.game = gameParts.join(" ");
        ticket.selected = selected;
        ticket.oddType = oddType;
      });
      console.log("update" + updateTicket);
      const printSelectedData = await axios.post(
        "http://localhost:8080/PRINT/",
        JSON.stringify(transformData(updateTicket)),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
        }
      );
    }
  } catch (err) {
    console.log("errorslist", err);
  }
};

export const isPrinterUp = async () => {
  try {
    const printerStatus = await axios.get("http://127.0.0.1:5002/check");

    if (printerStatus.status === 200) {
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
};
