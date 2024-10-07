import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  userState: false,
  categoryId: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setUserState: (state) => {
      state.userState = !state.userState;
    },
    setCategory: (state, action) => {
      state.categoryId = action.payload;
    },

    clearUser: (state) => {
      state.userInfo = null;
      state.aiQuestionId = null;
    },
  },
});

export const { setUserInfo, clearUser, setUserState, setCategory } =
  userSlice.actions;

export default userSlice.reducer;
