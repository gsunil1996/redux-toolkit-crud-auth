import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  // get users data
  usersData: {},
  usersDataIsLoading: false,
  usersDataIsError: false,
  usersDataError: "",
  usersDataIsSuccess: false,
};

export const getUsersDataAction = createAsyncThunk(
  "users/getUsersDataAction",
  async (payload, thunkAPI) => {
    try {
      const { data } = await axios.get("https://reqres.in/api/users?page=2");
      return data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const usersDataSlice = createSlice({
  name: "usersData",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUsersDataAction.pending, (state, action) => {
        state.usersData = {};
        state.usersDataIsLoading = true;
        state.usersDataIsError = false;
        state.usersDataError = "";
        state.usersDataIsSuccess = false;
      })
      .addCase(getUsersDataAction.fulfilled, (state, action) => {
        state.usersData = action.payload;
        state.usersDataIsLoading = false;
        state.usersDataIsError = false;
        state.usersDataError = "";
        state.usersDataIsSuccess = true;
      })
      .addCase(getUsersDataAction.rejected, (state, action) => {
        state.usersData = {};
        state.usersDataIsLoading = false;
        state.usersDataIsError = true;
        state.usersDataError = action.error.message;
        state.usersDataIsSuccess = false;
      });
  },
});

export default usersDataSlice.reducer;
