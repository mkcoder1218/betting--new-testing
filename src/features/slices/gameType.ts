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
  name: "gameType",
  initialState: initalState,
  reducers: {
    addGameType: (state, action: PayloadAction<string>) => {
      if (state.gameType) {
        state.gameType = action.payload;
      }
    },
  },
});

export const { addGameType } = gameTypeSlice.actions;

export default gameTypeSlice.reducer;
