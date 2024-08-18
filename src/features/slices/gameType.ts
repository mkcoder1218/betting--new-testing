import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface gameTypeState {
  loading: boolean;
  error: boolean;
  gameType?: string;
  isClearCircle?: boolean;
  isLive?: boolean,
  ClearSelected?: boolean
}

const initalState: gameTypeState = {
  loading: false,
  error: false,
  gameType: "SmartPlayKeno",
  isClearCircle: false,
  isLive: false,
  ClearSelected: false
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
    setIsLive: (state, action: PayloadAction<boolean>) => {
      state.isClearCircle = action.payload;
    },
    ClearSelected: (state, action: PayloadAction<boolean>) => {
      state.ClearSelected = action.payload
    }
  },
});

export const { addGameType, setIsClearCircle, setIsLive, ClearSelected } = gameTypeSlice.actions;

export default gameTypeSlice.reducer;
