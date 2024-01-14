import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "./baseUrl";

export const createAxiosConfig = (token, additionalHeaders = {}) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    ...additionalHeaders,
  },
});

// Separate function for token refresh
export const refreshAccessToken = async (thunkAPI) => {
  try {
    const refresh_token = sessionStorage.getItem("refresh_token");

    const refreshResponse = await axios.get(`${baseUrl}/refresh`, {
      headers: {
        Authorization: `Bearer ${refresh_token}`,
      },
    });

    sessionStorage.setItem("token", refreshResponse.data.token);

    return refreshResponse.data;
  } catch (refreshError) {
    return refreshError;
  }
};

// Create an async thunk with token refresh functionality
export const createAsyncThunkWithTokenRefresh = (
  type,
  requestFunction,
  dispatchAction
) =>
  createAsyncThunk(`${type}`, async (payload, thunkAPI) => {
    try {
      // Get the token from the session storage
      const token = sessionStorage.getItem("token");

      // Make the initial request using the provided function and token
      const response = await requestFunction(token, payload);

      if (dispatchAction) {
        await thunkAPI.dispatch(dispatchAction());
      }

      // Return the response data
      return response.data;
    } catch (error) {
      // Check for gateway timeout error
      if (error.response && error.response.status === 504) {
        throw new Error("Gateway Timeout");
      } else if (error.response && !error.response.data.error) {
        throw new Error(
          "There was an error with the internal server. Please contact your site administrator."
        );
      }

      // Handle unauthorized (401) error (access token expired)
      if (error.response && error.response.status === 401) {
        // Attempt to refresh the access token
        const refreshedToken = await refreshAccessToken(thunkAPI);

        // Check for gateway timeout error after token refresh
        if (refreshedToken.response && refreshedToken.response.status === 504) {
          throw new Error("Gateway Timeout");
        }

        // Check if the server is stopped with a 500 error and no specific error message after token refresh
        if (
          refreshedToken.response &&
          refreshedToken.response.status === 500 &&
          !refreshedToken.response.data.message
        ) {
          throw new Error(
            "There was an error with the internal server. Please contact your site administrator."
          );
        }

        // Handle unauthorized (401) error after token refresh (refresh token expired)
        if (
          refreshedToken.response &&
          refreshedToken.response?.status === 401
        ) {
          // Manually set an error in the Redux state
          if (
            refreshedToken.response?.data?.message == "Invalid Refresh Token!!"
          ) {
            throw new Error("Your login has been expired");
          } else {
            throw new Error(refreshedToken.response?.data?.message);
          }
        } else if (refreshedToken?.access_token) {
          // If token refresh is successful, retry the original request with the new access token
          try {
            const retryResponse = await requestFunction(
              refreshedToken?.access_token,
              payload
            );

            if (dispatchAction) {
              await thunkAPI.dispatch(dispatchAction());
            }

            // Return the response data from the retry
            return retryResponse.data;
          } catch (error) {
            // Handle errors in the retry request
            throw new Error(error.response?.data?.error || "An error occurred");
          }
        } else {
          // Handle cases where token refresh fails
          throw new Error(
            refreshedToken.response?.data?.error || "Token refresh failed"
          );
        }
      }

      // Throw a generic error if none of the specific error conditions are met
      throw new Error(error.response?.data?.error || "An error occurred");
    }
  });
