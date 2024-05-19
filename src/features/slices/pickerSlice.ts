import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "@reduxjs/toolkit/query"

export interface Ticket {
    selected: number[],
    multiplier: number,
    toWin: number,
    stake: number,
    gameId: string
}

export interface PickerType {
    selected: number[],
    betSlip: Ticket[],
    totalToWin: number,
    totalStake: number
}

let initialState: PickerType = {
    selected: [],
    betSlip: [],
    totalToWin: 0.0,
    totalStake: 0.0
}

const pickerSlice = createSlice({
    name: "pickerSlice",
    initialState: initialState,
    reducers: {
        addPickedNumbers: (state, action: PayloadAction<number>) => {
            state.selected = state.selected.includes(action.payload)
                ? state.selected.filter(n => n !== action.payload)
                : state.selected.length >= 10 ? [...state.selected] : [...state.selected, action.payload]
        },
        addRandomNumbers: (state, action: PayloadAction<number[]>) => {
            state.selected = action.payload;
            console.log(action.payload)
        },
        clearNumbers: (state) => {
            state.selected = [];
        },
        addToBetSlip: (state, action: PayloadAction<Ticket>) => {
            state.betSlip = [...state.betSlip, action.payload];
            const totals = calculateTotals(state.betSlip);

            state.totalStake = totals.totalStake
            state.totalToWin = totals.totalToWin
        },
        removeFromBetSlip: (state, action: PayloadAction<Ticket>) => {
            state.betSlip = state.betSlip.filter((item) => item.selected.length !== action.payload.selected.length)
            const totals = calculateTotals(state.betSlip);

            state.totalStake = totals.totalStake
            state.totalToWin = totals.totalToWin
        },
        updateBetSlipItem: (state, action: PayloadAction<{ index: number, changes: Partial<Ticket> }>) => {
            const { index, changes } = action.payload;

            if (index !== -1) {
                changes.toWin = changes.stake && changes.stake * state.betSlip[index].multiplier;
                console.log(changes.toWin);
                state.betSlip[index] = { ...state.betSlip[index], ...changes }
            }

            const totals = calculateTotals(state.betSlip);

            state.totalStake = totals.totalStake
            state.totalToWin = totals.totalToWin
        },
        updateStakeForAllTickets: (state, action: PayloadAction<number>) => {
            state.betSlip = state.betSlip.filter((item) => {
                return item.stake += action.payload;
            })

            const totals = calculateTotals(state.betSlip);

            state.totalStake = totals.totalStake
            state.totalToWin = totals.totalToWin
        },
        clearBetSlip: (state) => {
            state.betSlip = [];
        }
    }
})

function calculateTotals(betSlip: Ticket[]) {
    const totalStake = betSlip.reduce((acc, curr) => acc + curr.stake, 0);
    const totalToWin = betSlip.reduce((acc, curr) => acc + (curr.multiplier * curr.stake), 0);
    return { totalStake, totalToWin };
}

export const { addPickedNumbers, clearNumbers, addRandomNumbers, addToBetSlip, removeFromBetSlip, updateBetSlipItem, updateStakeForAllTickets, clearBetSlip } = pickerSlice.actions;

export default pickerSlice.reducer;