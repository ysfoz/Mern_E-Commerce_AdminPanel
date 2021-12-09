import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    currentUser: null,
    isFetching: false,
    error: false,
   
  },
  reducers: {
    getUserStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getUserFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
    },
    registerSuccess:(state,action) => {
      state.isFetching = false
      state.users.push(action.payload)
    },
    getAllUsersSuccess: (state, action) => {
      state.isFetching = false;
      state.users = action.payload;
    },
    getUserDeleteSuccess: (state, action) => {
      state.isFetching = false;
      state.users.splice(
        state.users.findIndex((item) => item._id === action.payload.id),
        1
      );
    },
    logoutSuccess:(state)=>{
      state.currentUser = null
    }
  },
});

export const {
  getUserStart,
  loginSuccess,
  getUserFailure,
  getAllUsersSuccess,
  getUserDeleteSuccess,
  logoutSuccess,
  registerSuccess
  
} = userSlice.actions;
export default userSlice.reducer;
