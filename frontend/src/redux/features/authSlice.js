import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../baseUrl";
import {
  createAsyncThunkWithTokenRefresh,
  createAxiosConfig,
} from "../commonFunction";

const initialState = {
  // register
  registerData: null,
  registerIsLoading: false,
  registerIsError: false,
  registerError: "",
  registerIsSuccess: false,

  // login
  loginData: null,
  loginIsLoading: false,
  loginIsError: false,
  loginError: "",
  loginIsSuccess: false,

  // refresh
  refreshData: null,
  refreshIsLoading: false,
  refreshIsError: false,
  refreshError: "",
  refreshIsSuccess: false,

  // check token validity
  checkTokenValidityData: null,
  checkTokenValidityIsLoading: false,
  checkTokenValidityIsError: false,
  checkTokenValidityError: "",
  checkTokenValidityIsSuccess: false,
};

export const registerAction = createAsyncThunk(
  "auth/registerAction",
  async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}/register`, payload, {
        headers: {},
      });

      return response.data;
    } catch (error) {
      //  console.log('loginAction error', error.response)
      if (error.response && error.response.status === 504) {
        throw new Error("Gateway Timeout");
      } else if (error.response && error.response.status === 404) {
        throw new Error("Not Found");
      } else if (error.response && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error(
          "There was an error with the internal server. Please contact your site administrator."
        );
      }
    }
  }
);

export const loginAction = createAsyncThunk(
  "auth/loginAction",
  async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}/login`, payload, {
        headers: {},
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refresh_token", response.data.refreshToken);
      localStorage.setItem("user_details", JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      //  console.log('loginAction error', error.response)
      if (error.response && error.response.status === 504) {
        throw new Error("Gateway Timeout");
      } else if (error.response && error.response.status === 404) {
        throw new Error("Not Found");
      } else if (error.response && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error(
          "There was an error with the internal server. Please contact your site administrator."
        );
      }
    }
  }
);

export const authRefreshAction = createAsyncThunk(
  "auth/authRefreshAction",
  async (thunkAPI) => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");

      const refreshResponse = await axios.get(`${baseUrl}/refresh`, {
        headers: {
          Authorization: `Bearer ${refresh_token}`,
        },
      });

      if (refreshResponse.data && refreshResponse.data.token) {
        // console.log('refreshResponse', refreshResponse)

        localStorage.setItem("token", refreshResponse.data.token);

        return refreshResponse.data;
      } else {
        throw new Error("Your login has expired. Please log in again.");
      }
    } catch (refreshError) {
      if (refreshError.response && refreshError.response.status === 504) {
        throw new Error("Gateway Timeout");
      } else if (
        refreshError.response &&
        refreshError.response.status === 404
      ) {
        throw new Error("Not Found");
      } else if (refreshError.response && refreshError.response.data.error) {
        throw new Error(refreshError.response.data.error);
      } else {
        throw new Error(
          "There was an error with the internal server. Please contact your site administrator."
        );
      }
    }
  }
);

export const checkTokenValidtyAction = createAsyncThunkWithTokenRefresh(
  "auth/checkTokenValidtyAction",
  async (token, payload) => {
    const headers = {}; // Adjust the value as needed
    return axios.get(`${baseUrl}/protected`, createAxiosConfig(token, headers));
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {
      localStorage.clear();
    },
    resetRegisterAction(state) {
      state.registerData = null;
      state.registerIsLoading = false;
      state.registerIsError = false;
      state.registerError = "";
      state.registerIsSuccess = false;
    },
    resetLoginAction(state) {
      state.loginData = null;
      state.loginIsLoading = false;
      state.loginIsError = false;
      state.loginError = "";
      state.loginIsSuccess = false;
    },
    resetRefreshction(state) {
      state.refreshData = null;
      state.refreshIsLoading = false;
      state.refreshIsError = false;
      state.refreshError = "";
      state.refreshIsSuccess = false;
    },
    resetCheckTokenValidtyAction(state) {
      state.checkTokenValidityData = null;
      state.checkTokenValidityIsLoading = false;
      state.checkTokenValidityIsError = false;
      state.checkTokenValidityError = "";
      state.checkTokenValidityIsSuccess = false;
    },
  },
  extraReducers(builder) {
    builder

      // regitser
      .addCase(registerAction.pending, (state) => {
        state.registerData = null;
        state.registerIsLoading = true;
        state.registerIsError = false;
        state.registerError = "";
        state.registerIsSuccess = false;
      })
      .addCase(registerAction.fulfilled, (state, action) => {
        state.registerData = action.payload;
        state.registerIsLoading = false;
        state.registerIsError = false;
        state.registerError = "";
        state.registerIsSuccess = true;
      })
      .addCase(registerAction.rejected, (state, action) => {
        state.registerData = null;
        state.registerIsLoading = false;
        state.registerIsError = true;
        state.registerError = action.error.message
          ? action.error.message
          : "An unknown error occurred";
        state.registerIsSuccess = false;
      })

      // login
      .addCase(loginAction.pending, (state) => {
        state.loginData = null;
        state.loginIsLoading = true;
        state.loginIsError = false;
        state.loginError = "";
        state.loginIsSuccess = false;
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        // console.log('loginAction Inside fulfilled', action)

        state.loginData = action.payload;
        state.loginIsLoading = false;
        state.loginIsError = false;
        state.loginError = "";
        state.loginIsSuccess = true;
      })
      .addCase(loginAction.rejected, (state, action) => {
        // console.log('loginAction Inside error', action)

        state.loginData = null;
        state.loginIsLoading = false;
        state.loginIsError = true;
        state.loginError = action.error.message
          ? action.error.message
          : "An unknown error occurred";
        state.loginIsSuccess = false;
      })

      // refresh
      .addCase(authRefreshAction.pending, (state) => {
        state.refreshData = null;
        state.refreshIsLoading = true;
        state.refreshIsError = false;
        state.refreshError = "";
        state.refreshIsSuccess = false;
      })
      .addCase(authRefreshAction.fulfilled, (state, action) => {
        // console.log("Inside fulfilled", action)

        state.refreshData = action.payload;
        state.refreshIsLoading = false;
        state.refreshIsError = false;
        state.refreshError = "";
        state.refreshIsSuccess = true;
      })
      .addCase(authRefreshAction.rejected, (state, action) => {
        // console.log("Inside error", action)
        state.refreshData = null;
        state.refreshIsLoading = false;
        state.refreshIsError = true;
        state.refreshError = action.error.message
          ? action.error.message
          : "An unknown error occurred";
        state.refreshIsSuccess = false;
      })

      // check token validitys
      .addCase(checkTokenValidtyAction.pending, (state) => {
        state.checkTokenValidityData = null;
        state.checkTokenValidityIsLoading = true;
        state.checkTokenValidityIsError = false;
        state.checkTokenValidityError = "";
        state.checkTokenValidityIsSuccess = false;
      })
      .addCase(checkTokenValidtyAction.fulfilled, (state, action) => {
        // console.log("Inside fulfilled", action)

        state.checkTokenValidityData = action.payload;
        state.checkTokenValidityIsLoading = false;
        state.checkTokenValidityIsError = false;
        state.checkTokenValidityError = "";
        state.checkTokenValidityIsSuccess = true;
      })
      .addCase(checkTokenValidtyAction.rejected, (state, action) => {
        // console.log("Inside error", action)
        state.checkTokenValidityData = null;
        state.checkTokenValidityIsLoading = false;
        state.checkTokenValidityIsError = true;
        state.checkTokenValidityError = action.error.message
          ? action.error.message
          : "An unknown error occurred";
        state.checkTokenValidityIsSuccess = false;
      });
  },
});

export const {
  logOut,
  resetLoginAction,
  resetRefreshction,
  resetCheckTokenValidtyAction,
  resetRegisterAction,
} = authSlice.actions;

export default authSlice.reducer;
