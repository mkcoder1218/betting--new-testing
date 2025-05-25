import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HeadClickState {
  Name?: string;
}

const initalState: HeadClickState = {
  Name: "MAIN",
};

const HeadSlice = createSlice({
  name: "head",
  initialState: initalState,
  reducers: {
    addHeadText: (state, action: PayloadAction<string>) => {
      state.Name = action.payload;
    },
  },
});

export const { addHeadText } = HeadSlice.actions;
export default HeadSlice.reducer;
