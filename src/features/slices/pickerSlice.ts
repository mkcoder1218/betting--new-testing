import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Entry } from "./RacingGameSlice";
import betSlip from "./betSlip";
import moment from "moment";

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
  gameNumber?: number;
  startTime: string;
}

export interface PickerType {
  selected: number[];
  betSlip: Ticket[];
  totalToWin: number;
  totalStake: number;
  maxWin: number;
}

let initialState: PickerType = {
  selected: [],
  betSlip: [],
  totalToWin: 0.0,
  totalStake: 0.0,
  maxWin: 0,
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
        state.betSlip = state.betSlip.filter((item) => {
          return new Date().getTime() < item.expiry;
        });
        state.betSlip = [...state.betSlip, action.payload];
      }
      const totals = calculateTotals(state.betSlip);

      state.totalStake = totals.totalStake;
      state.totalToWin = totals.totalToWin;
      state.maxWin = totals.maxWin;
    },
    removeFromBetSlip: (state, action: PayloadAction<number>) => {
      // Get the index of the ticket to remove
      const indexToRemove = action.payload;

      // Log for debugging
      console.log('Removing bet slip item:', {
        indexToRemove,
        currentBetSlipLength: state.betSlip.length,
        ticketToRemove: state.betSlip[indexToRemove]
      });

      // Make sure the index is valid
      if (indexToRemove >= 0 && indexToRemove < state.betSlip.length) {
        // Remove the specific ticket from the bet slip
        state.betSlip = state.betSlip.filter(
          (_, index) => index !== indexToRemove
        );

        // Recalculate totals
        const totals = calculateTotals(state.betSlip);
        state.maxWin = totals.maxWin;
        state.totalStake = totals.totalStake;
        state.totalToWin = totals.totalToWin;
      } else {
        console.error('Invalid index to remove from bet slip:', indexToRemove);
      }
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
      state.maxWin = totals.maxWin;
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
      state.maxWin = totals.maxWin;
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
      state.maxWin = totals.maxWin;
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
  console.log("betSLIPPP", betSlip);
  const totalStake = betSlip.reduce((acc, curr) => acc + curr.stake, 0);
  const maxWin = Math.max(
    ...betSlip.map((ticket) => ticket.stake * ticket.multiplier)
  );
  const totalToWin = betSlip.reduce(
    (acc, curr) => acc + curr.stake * curr.multiplier,
    0
  );

  return { totalStake, totalToWin, maxWin };
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
