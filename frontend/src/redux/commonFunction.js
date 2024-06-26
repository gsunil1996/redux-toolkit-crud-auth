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
    const refresh_token = localStorage.getItem("refresh_token");

    const refreshResponse = await axios.get(`${baseUrl}/refresh`, {
      headers: {
        Authorization: `Bearer ${refresh_token}`,
      },
    });

    localStorage.setItem("token", refreshResponse.data.token);

    return refreshResponse.data;
  } catch (refreshError) {
    return refreshError;
  }
};

// Create an async thunk with token refresh functionality
export const createAsyncThunkWithTokenRefresh = (type, requestFunction) =>
  createAsyncThunk(`${type}`, async (payload, thunkAPI) => {
    try {
      // Get the token from the local storage
      const token = localStorage.getItem("token") || "";

      // Make the initial request using the provided function and token
      const response = await requestFunction(token, payload);

      // Return the response data
      return response.data;
    } catch (error) {
      // Check for gateway timeout error
      if (error.response && error.response.status === 504) {
        throw new Error("Gateway Timeout");
      } else if (error.response && error.response.status === 404) {
        throw new Error("Resource not found");
      } else if (error.response && error.response.status === 500) {
        throw new Error(
          "There was an error with the internal server. Please contact your site administrator."
        );
      } else if (error.response && !error.response.data.error) {
        throw new Error(
          "There was an error with the internal server. Please contact your site administrator."
        );
      }

      // Handle unauthorized (401) error (access token expired)
      else if (error.response && error.response.status === 401) {
        // Attempt to refresh the access token
        const refreshedToken = await refreshAccessToken(thunkAPI);

        // Check for gateway timeout error after token refresh
        if (refreshedToken.response && refreshedToken.response.status === 504) {
          throw new Error("Gateway Timeout");
        } else if (
          refreshedToken.response &&
          refreshedToken.response.status === 404
        ) {
          throw new Error("Resource not found");
        } else if (
          refreshedToken.response &&
          refreshedToken.response.status === 500
        ) {
          throw new Error(
            "There was an error with the internal server. Please contact your site administrator."
          );
        }
        // Check if the server is stopped with a 500 error and no specific error message after token refresh
        else if (
          refreshedToken.response &&
          !refreshedToken.response.data.error
        ) {
          throw new Error(
            "There was an error with the internal server. Please contact your site administrator."
          );
        }

        // Handle unauthorized (401) error after token refresh (refresh token expired)
        else if (
          refreshedToken.response &&
          refreshedToken.response?.status === 401
        ) {
          // Manually set an error in the Redux state
          throw new Error(refreshedToken.response?.data?.error);
        } else if (refreshedToken?.token) {
          // If token refresh is successful, retry the original request with the new access token
          try {
            const retryResponse = await requestFunction(
              refreshedToken?.token,
              payload
            );

            // Return the response data from the retry
            return retryResponse.data;
          } catch (error) {
            // Handle errors in the retry request
            throw new Error(error.response?.data?.error || "An error occurred");
          }
        }
      } else if (error.message == "Network Error") {
        throw new Error(
          "There was an error with the internal server. Please contact your site administrator."
        );
      } else if (!error.response) {
        throw new Error(
          "There was an error with the internal server. Please contact your site administrator."
        );
      } else {
        // Throw a generic error if none of the specific error conditions are met
        throw new Error(error.response?.data?.error || "An error occurred");
      }
    }
  });
