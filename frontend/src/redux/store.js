import { configureStore } from "@reduxjs/toolkit";
import employeeTableReducer from "./features/employeeTableSlice";
import authReducer from "./features/authSlice";

export const store = configureStore({
  reducer: {
    employees: employeeTableReducer,
    auth: authReducer,
  },
  devTools: true,
});
