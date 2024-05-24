import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface TicketExpiry {
    expiry: number
}

let initialState: TicketExpiry = {
    expiry: 0
}

const expirySlice = createSlice({
    name: "expiry",
    initialState: initialState,
    reducers: {
        addExpiry: (state, action: PayloadAction<TicketExpiry>) => {
            state.expiry = action.payload.expiry;
        }
    }
})

export const { addExpiry } = expirySlice.actions

export default expirySlice.reducer;