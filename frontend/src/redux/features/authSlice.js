import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../baseUrl";

const initialState = {
  // register
  registerData: {},
  registerIsLoading: false,
  registerIsError: false,
  registerError: "",
  registerIsSuccess: false,

  // login
  loginData: {},
  loginIsLoading: false,
  loginIsError: false,
  loginError: "",
  loginIsSuccess: false,

  // refresh
  refreshData: {},
  refreshIsLoading: false,
  refreshIsError: false,
  refreshError: "",
  refreshIsSuccess: false,

  // check token validity
  checkTokenValidityData: {},
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

      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("refresh_token", response.data.refreshToken);
      sessionStorage.setItem(
        "user_details",
        JSON.stringify(response.data.user)
      );

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
      const refresh_token = sessionStorage.getItem("refresh_token");

      const refreshResponse = await axios.get(`${baseUrl}/refresh`, {
        headers: {
          Authorization: `Bearer ${refresh_token}`,
        },
      });

      if (refreshResponse.data && refreshResponse.data.token) {
        // console.log('refreshResponse', refreshResponse)

        sessionStorage.setItem("token", refreshResponse.data.token);

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

export const checkTokenValidtyAction = createAsyncThunk(
  "auth/checkTokenValidtyAction",
  async (payload, thunkAPI) => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.get(`${baseUrl}/protected`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 504) {
        throw new Error("Gateway Timeout");
      } else if (error.response && error.response.status === 404) {
        throw new Error("Not Found");
      } else if (error.response && error.response.status === 401) {
        try {
          const refreshedToken = await thunkAPI.dispatch(authRefreshAction());

          console.log("refreshedToken", refreshedToken);

          const retryResponse = await axios.get(`${baseUrl}/protected`, {
            headers: {
              Authorization: `Bearer ${refreshedToken.payload.token}`,
            },
          });

          sessionStorage.setItem("token", refreshedToken.payload.token);

          return retryResponse.data;
        } catch (refreshError) {
          // console.error('Error dispatching authRefreshAction:', refreshError)
          if (refreshError.response && refreshError.response.status === 504) {
            throw new Error("Gateway Timeout");
          } else if (
            refreshError.response &&
            refreshError.response.data.error
          ) {
            throw new Error(refreshError.response.data.error);
          } else {
            throw new Error(
              "There was an error with the internal server. Please contact your site administrator."
            );
          }
        }
      }

      // Handle other errors here if needed
      throw new Error(error.response.data.error || "An error occured");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {
      sessionStorage.clear();
    },
    resetRegisterAction(state) {
      state.registerIsLoading = false;
      state.registerIsError = false;
      state.registerError = "";
      state.registerIsSuccess = false;
    },
    resetLoginAction(state) {
      // state.loginData = {}
      state.loginIsLoading = false;
      state.loginIsError = false;
      state.loginError = "";
      state.loginIsSuccess = false;
    },
    resetRefreshction(state) {
      // state.refreshData = {}
      state.refreshIsLoading = false;
      state.refreshIsError = false;
      state.refreshError = "";
      state.refreshIsSuccess = false;
    },
    resetCheckTokenValidtyAction(state) {
      // state.checkTokenValidityData = {}
      state.checkTokenValidityIsLoading = false;
      state.checkTokenValidityIsError = false;
      state.checkTokenValidityError = "";
      state.checkTokenValidityIsSuccess = false;
    },
  },
  extraReducers(builder) {
    builder

      // login
      .addCase(loginAction.pending, (state) => {
        state.loginData = {};
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

        state.loginData = {};
        state.loginIsLoading = false;
        state.loginIsError = true;
        state.loginError = action.error.message;
        state.loginIsSuccess = false;
      })

      // refresh
      .addCase(authRefreshAction.pending, (state) => {
        state.refreshData = {};
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
        state.refreshData = {};
        state.refreshIsLoading = false;
        state.refreshIsError = true;
        state.refreshError = action.error.message;
        state.refreshIsSuccess = false;
      })

      // check token validity
      .addCase(checkTokenValidtyAction.pending, (state) => {
        state.checkTokenValidityData = {};
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
        state.checkTokenValidityData = {};
        state.checkTokenValidityIsLoading = false;
        state.checkTokenValidityIsError = true;
        state.checkTokenValidityError = action.error.message;
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
