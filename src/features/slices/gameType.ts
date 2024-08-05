import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface gameTypeState {
  loading: boolean;
  error: boolean;
  gameType?: string;
}

const initalState: gameTypeState = {
  loading: false,
  error: false,
  gameType: "KENO",
};

const gameTypeSlice = createSlice({
  name: "gameType/manager",
  initialState: initalState,
  reducers: {
    addGameType: (state, action: PayloadAction<string>) => {
      console.log("PAYLOAD_CALLED", action.payload);
      state.gameType = action.payload;
    },
  },
});

export const { addGameType } = gameTypeSlice.actions;

export default gameTypeSlice.reducer;
