import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const todoslice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo(state, action) {
      state.push(action.payload);
    },
    removeTodo(state, action) {
      return state.filter((item) => item !== action.payload);
    },
  },
});

export const { addTodo, removeTodo } = todoslice.actions;

export default todoslice.reducer;
