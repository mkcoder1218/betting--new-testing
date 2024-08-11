import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Entry } from "./RacingGameSlice";
import betSlip from "./betSlip";

export interface Ticket {
  selected: number[];
  multiplier: number;
  expiry: number;
  toWin: number;
  stake: number;
  gameId: number | undefined | string;
  gameType?: string;
  stakeInformation?: string;
  isCombo?: boolean;
  entry?: Entry;
  selectedForm?: number;
  oddType?: string;
  draw?: number;
  nameofPlayer?: string;
  gameNumber?: number
}

export interface PickerType {
  selected: number[];
  betSlip: Ticket[];
  totalToWin: number;
  totalStake: number;
}

let initialState: PickerType = {
  selected: [],
  betSlip: [],
  totalToWin: 0.0,
  totalStake: 0.0,
};

const pickerSlice = createSlice({
  name: "pickerSlice",
  initialState: initialState,
  reducers: {
    addPickedNumbers: (state, action: PayloadAction<number>) => {
      state.selected = state.selected.includes(action.payload)
        ? state.selected.filter((n) => n !== action.payload)
        : state.selected.length >= 10
        ? [...state.selected]
        : [...state.selected, action.payload];
    },
    addRandomNumbers: (state, action: PayloadAction<number[]>) => {
      state.selected = action.payload;

    },
    clearNumbers: (state) => {
      state.selected = [];
    },
    addToBetSlip: (state, action: PayloadAction<Ticket>) => {
      const _index = state.betSlip.findIndex((betslip) => {
        if (
          betslip.oddType === action.payload.oddType &&
          betslip.gameId === action.payload.gameId &&
          betslip.entry?.Form === action.payload.entry?.Form &&
          betslip.selected === action.payload.selected
        ) {
          return true;
        }
        return false;
      });


      if (_index > -1) {
        state.betSlip = state.betSlip.filter((item, index) => {
          return _index !== index;
        });
      } else {
        state.betSlip = [...state.betSlip, action.payload];
      }
      const totals = calculateTotals(state.betSlip);

      state.totalStake = totals.totalStake;
      state.totalToWin = totals.totalToWin;
    },
    removeFromBetSlip: (state, action: PayloadAction<number>) => {
      state.betSlip = state.betSlip.filter(
        (item, index) => index !== action.payload
      );
      const totals = calculateTotals(state.betSlip);

      state.totalStake = totals.totalStake;
      state.totalToWin = totals.totalToWin;
    },
    updateBetSlipItem: (
      state,
      action: PayloadAction<{ index: number; changes: Partial<Ticket> }>
    ) => {
      const { index, changes } = action.payload;

      if (index !== -1) {
        changes.toWin =
          changes.stake && changes.stake * state.betSlip[index].multiplier;
        state.betSlip[index] = { ...state.betSlip[index], ...changes };
      }

      const totals = calculateTotals(state.betSlip);

      state.totalStake = totals.totalStake;
      state.totalToWin = totals.totalToWin;
    },
    incrBetSlipItem: (
      state,
      action: PayloadAction<{ index: number; changes: Partial<Ticket> }>
    ) => {
      const { index, changes } = action.payload;

      if (index !== -1) {
        changes.toWin =
          changes.stake && changes.stake * state.betSlip[index].multiplier;
        changes.stake =
          state.betSlip[index].stake + (changes.stake ? changes.stake : 0);
        state.betSlip[index] = { ...state.betSlip[index], ...changes };
      }

      const totals = calculateTotals(state.betSlip);

      state.totalStake = totals.totalStake;
      state.totalToWin = totals.totalToWin;
    },
    updateStakeForAllTickets: (
      state,
      action: PayloadAction<{ type: string; value: number }>
    ) => {
      if (action.payload.type == "inc") {
        const value = action.payload.value;
        state.betSlip = state.betSlip.map((item) => {
          if (value < 0) {
            // Update only if stake is greater than 10
            if (item.stake === 10) {
              return { ...item, stake: value };
            } else {
              return item.stake > 10
                ? { ...item, stake: item.stake + value }
                : item;
            }
          } else {
            if (item.stake === 10) {
              return { ...item, stake: value };
            }
            // Update all stakes
            return { ...item, stake: item.stake + value };
          }
        });
      }

      if (action.payload.type === "add") {
        state.betSlip = state.betSlip.map((item) => ({
          ...item,
          stake: action.payload.value,
        }));
      }

      const totals = calculateTotals(state.betSlip);

      state.totalStake = totals.totalStake;
      state.totalToWin = totals.totalToWin;
    },
    clearBetSlip: (state) => {
      state.betSlip = [];
      state.totalStake = 0;
      state.totalToWin = 0;
    },
  },
});

function calculateTotals(betSlip: Ticket[]) {
  const totalStake = betSlip.reduce((acc, curr) => acc + curr.stake, 0);
  const totalToWin = betSlip.reduce(
    (acc, curr) => acc + curr.multiplier * curr.stake,
    0
  );
  return { totalStake, totalToWin };
}

export const {
  addPickedNumbers,
  clearNumbers,
  addRandomNumbers,
  addToBetSlip,
  removeFromBetSlip,
  updateBetSlipItem,
  updateStakeForAllTickets,
  clearBetSlip,
  incrBetSlipItem,
} = pickerSlice.actions;

export default pickerSlice.reducer;
