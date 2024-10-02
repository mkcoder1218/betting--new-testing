import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/interceptor";
import axios, { AxiosError } from "axios";
import { clearNumbers } from "./pickerSlice";
import { TicketInterface } from "../../utils/ticket.interface";
import { ColumnMap } from "../../utils/columnMap";
import { MapRedAndBlack } from "../../utils/redblackMap";
import { range } from "../../utils/range";
import { generateEvenAndOddArrays } from "../../utils/evenoddgenerate";
import { formatNumberWithCommas } from "../../utils/numberGenerate";

interface BetSlipData {
  betSlipNumber: string;
  gameType?: string;
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
    betSlipNumber: "",
    gameType: "SmartPlayKeno",
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

export const { addBetSlipNumber, addTicketAndBetSlip, addGameType } =
  betSlipSlice.actions;

export default betSlipSlice.reducer;
function transformData(data) {
  const lineItems = [];

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
    Underline: false
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
    Underline: false
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
    Underline: false
  });

  // Iterate over tickets and add ticket information
  data.tickets.forEach((ticket) => {
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
      Underline: false
    });

    lineItems.push({
      LineItem: ticket.selected,
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
    });
    lineItems.push({
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
    // Add stake information
    lineItems.push({
      LineItem: "Stake",
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
    });

    lineItems.push({
      LineItem: `Br ${ticket.stake}`,
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
    });
  });

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
    Underline: false
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
    Underline: false
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
    Underline: false
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
    Underline: false
  });

  return {
    Content: lineItems
  };
}
export const createBetSlipAndTicket =
  (
    data: any,
    refreshBetSlipNumber: () => void,
    clearSlip: () => void,
    toggleStatus: (val: boolean) => void,
    clearNumberSelection: () => void,
    removebetsucess
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

            if (betSlipResponse.data) {


              let updateTicket: TicketInterface = betSlipResponse.data;
              const { evens, odds } = generateEvenAndOddArrays(1, 36);
              updateTicket.minPayout = formatNumberWithCommas(
                parseFloat(updateTicket.minPayout + "")
              );
              updateTicket.maxPayout = formatNumberWithCommas(
                parseFloat(updateTicket.maxPayout + "")
              );
              updateTicket.stake = updateTicket.stake.toFixed(2);
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
                    ColumnMap.col1.every((item) =>
                      selected.includes(Number(item))
                    )
                      ? ((selected =
                        "col1 " +
                        ticket.selected.split(" ")[
                        ticket.selected.split(" ").length - 1
                        ]),
                        (oddType = "Column"))
                      : ColumnMap.col2.every((item) =>
                        selected.includes(Number(item))
                      )
                        ? ((selected =
                          "col2 " +
                          ticket.selected.split(" ")[
                          ticket.selected.split(" ").length - 1
                          ]),
                          (oddType = "Column"))
                        : ColumnMap.col3.every((item) =>
                          selected.includes(Number(item))
                        )
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
                              : range(1, 18).every((item) =>
                                selected.includes(Number(item))
                              )
                                ? ((selected =
                                  "1-18 " +
                                  ticket.selected.split(" ")[
                                  ticket.selected.split(" ").length - 1
                                  ]),
                                  (oddType = "High/Low"))
                                : range(19, 36).every((item) =>
                                  selected.includes(Number(item))
                                )
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
                                      : range(1, 12).every((item) =>
                                        selected.includes(Number(item))
                                      )
                                        ? ((selected =
                                          "1st 12 " +
                                          ticket.selected.split(" ")[
                                          ticket.selected.split(" ").length - 1
                                          ]),
                                          (oddType = "Dozens"))
                                        : range(13, 24).every((item) =>
                                          selected.includes(Number(item))
                                        )
                                          ? ((selected =
                                            "2nd 12 " +
                                            ticket.selected.split(" ")[
                                            ticket.selected.split(" ").length - 1
                                            ]),
                                            (oddType = "Dozens"))
                                          : range(25, 36).every((item) =>
                                            selected.includes(Number(item))
                                          )
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
              const printResponse = await axios.post(
                "http://localhost:8080/PRINT",
                transformData(updateTicket)
              );
            }
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
