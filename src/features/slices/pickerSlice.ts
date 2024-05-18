import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "@reduxjs/toolkit/query"


interface PickerType {
    selected: number[]
}

let initialState: PickerType = {
    selected: []
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
        clearNumbers: (state) => {
            state.selected = [];
        }
    }
})

export const { addPickedNumbers, clearNumbers } = pickerSlice.actions;

export default pickerSlice.reducer;