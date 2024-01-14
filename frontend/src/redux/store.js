import { configureStore } from "@reduxjs/toolkit";
import counterReducder from "./features/counterSlice";
import todoReducer from "./features/todoSlice";
import usersDataReducer from "./features/usersDataSlice";
import { usersApi } from "./api/usersApiSlice";
import employeeTableReducer from "./features/employeeTableSlice";
import authReducer from "./features/authSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducder,
    todo: todoReducer,
    userData: usersDataReducer,
    [usersApi.reducerPath]: usersApi.reducer,
    employees: employeeTableReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware),
  devTools: true,
});
