import { PayloadAction, createSlice } from "@reduxjs/toolkit"


interface BetRepeatInterface {
    repeat: number
}

let initialState: BetRepeatInterface = {
    repeat: 1
}

const betRepeatSlice = createSlice({
    name: "repeat",
    initialState: initialState,
    reducers: {
        addRepeat: (state, action: PayloadAction<BetRepeatInterface>) => {
            state.repeat = action.payload.repeat;
        }
    }
})

export const { addRepeat } = betRepeatSlice.actions;

export default betRepeatSlice.reducer;