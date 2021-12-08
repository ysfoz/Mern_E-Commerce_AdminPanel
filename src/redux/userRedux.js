import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users:[],
    currentUser: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    getUserStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
    },
    getUserFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
    },
    getAllUsersSuccess :(state,action)=>{
      state.isFetching = false
      state.users = action.payload
    }

  },
});

export const { getUserStart, loginSuccess, getUserFailure, getAllUsersSuccess } = userSlice.actions;
export default userSlice.reducer;