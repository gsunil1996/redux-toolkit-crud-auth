import { configureStore } from "@reduxjs/toolkit";
import employeeTableReducer from "./features/employeeTableSlice";
import authReducer from "./features/authSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    employees: employeeTableReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

setupListeners(store.dispatch);
