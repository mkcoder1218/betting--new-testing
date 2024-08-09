import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface gameTypeState {
  loading: boolean;
  error: boolean;
  gameType?: string;
  isClearCircle?: boolean;
}

const initalState: gameTypeState = {
  loading: false,
  error: false,
  gameType: "KENO",
  isClearCircle: false,
};

const gameTypeSlice = createSlice({
  name: "gameType/manager",
  initialState: initalState,
  reducers: {
    addGameType: (state, action: PayloadAction<string>) => {

      state.gameType = action.payload;
    },
    setIsClearCircle: (state, action: PayloadAction<boolean>) => {
      state.isClearCircle = action.payload;
    },
  },
});

export const { addGameType, setIsClearCircle } = gameTypeSlice.actions;

export default gameTypeSlice.reducer;
