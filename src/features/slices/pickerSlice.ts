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
            state.totalStake = state.betSlip.reduce((acc, curr) => acc + curr.stake, 0)
            state.totalToWin = state.betSlip.reduce((acc, curr) => acc + curr.toWin, 0)
        },
        removeFromBetSlip: (state, action: PayloadAction<Ticket>) => {
            state.betSlip = state.betSlip.filter((item) => item.selected.length !== action.payload.selected.length)
            state.totalStake = state.betSlip.reduce((acc, curr) => acc + curr.stake, 0)
            state.totalToWin = state.betSlip.reduce((acc, curr) => acc + curr.toWin, 0)
        },
        updateBetSlipItem: (state, action: PayloadAction<{ index: number, changes: Partial<Ticket> }>) => {
            const { index, changes } = action.payload;

            if (index !== -1) {
                state.betSlip[index] = { ...state.betSlip[index], ...changes }
            }

            state.totalStake = state.betSlip.reduce((acc, curr) => acc + curr.stake, 0)
            state.totalToWin = state.betSlip.reduce((acc, curr) => acc + curr.toWin, 0)
        },
        updateStakeForAllTickets: (state, action: PayloadAction<number>) => {
            state.betSlip = state.betSlip.filter((item) => {
                return item.stake += action.payload, item.toWin *= item.stake;
            })

            state.totalStake = state.betSlip.reduce((acc, curr) => acc + curr.stake, 0)
            state.totalToWin = state.betSlip.reduce((acc, curr) => acc + curr.toWin, 0)
        },
        clearBetSlip: (state) => {
            state.betSlip = [];
        }
    }
})

export const { addPickedNumbers, clearNumbers, addRandomNumbers, addToBetSlip, removeFromBetSlip, updateBetSlipItem, updateStakeForAllTickets, clearBetSlip } = pickerSlice.actions;

export default pickerSlice.reducer;