import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import {
  createAsyncThunkWithTokenRefresh,
  createAxiosConfig,
} from "../commonFunction";
import { baseUrl } from "../baseUrl";
import { useRouter } from "next/router";
import Link from "next/link";

const initialState = {
  // get employee table data
  data: [],
  isLoading: false,
  isError: false,
  error: "",
  isSuccess: false,

  // get employee profile
  employeeProfileData: {},
  employeeProfileIsLoading: false,
  employeeProfileIsError: false,
  employeeProfileError: "",
  employeeProfileIsSuccess: false,

  // add employee table data
  employeeAddedData: {},
  employeeAddDataLoading: false,
  employeeAddedDataIsError: false,
  employeeAddedDataError: "",
  employeeAddedDataIsSuccess: false,

  // edit employee table data
  employeeEditedData: {},
  employeeEditDataLoading: false,
  employeeEditDataIsError: false,
  employeeEditDataError: "",
  employeeEditDataIsSuccess: false,

  // delete employee table data
  employeeDeletedData: {},
  employeeDeleteDataLoading: false,
  employeeDeleteDataIsError: false,
  employeeDeleteDataError: "",
  employeeDeleteDataIsSuccess: false,
};

export const getEmployeeTableData = createAsyncThunkWithTokenRefresh(
  "employeeTable/getEmployeeTableData",
  async (token, payload) => {
    const { search, gender, status, sort, page } = payload;
    const headers = {}; // Adjust the value as needed
    return (
      axios.get(
        `${baseUrl}/employeesTable?search=${search}&gender=${gender}&status=${status}&sort=${sort}&page=${page}`,
        createAxiosConfig(token, headers)
      ),
    );
  }
);

export const getEmployeeProfileData = createAsyncThunkWithTokenRefresh(
  "employeeTable/getEmployeeProfileData",
  async (token, payload) => {
    const headers = {}; // Adjust the value as needed
    return axios.get(
      `${baseUrl}/employeesTable/${payload.id}`,
      createAxiosConfig(token, headers)
    );
  }
);


export const addEmployeeTableData = createAsyncThunkWithTokenRefresh(
  "employeeTable/addEmployeeTableData",
  async (token, payload) => {
    const headers = {}; // Adjust the value as needed
    return axios.post(
      `${baseUrl}/addEmployee`,
      payload.data,
      createAxiosConfig(token, headers)
    )
  },
   getEmployeeTableData,
);

export const editEmployeeTableData = createAsyncThunkWithTokenRefresh(
  "employeeTable/editEmployeeTableData",
  async (token, payload) => {
    const { tableRowId, data } = payload;
    const headers = {}; // Adjust the value as needed
    return axios.patch(
      `${baseUrl}/updateEmployeeDetails/${tableRowId}`,
      data,
      createAxiosConfig(token, headers)
    )
  },
   getEmployeeTableData,
);

export const deleteEmployeeTableData = createAsyncThunkWithTokenRefresh(
  "employeeTable/deleteEmployeeTableData",
  async (token, payload) => {
    const { tableRowId } = payload;
    const headers = {}; // Adjust the value as needed
    return axios.delete(
      `${baseUrl}/deleteEmployee/${tableRowId}`,
      createAxiosConfig(token, headers)
    )
  },
   getEmployeeTableData,
);

export const employeeTableSlice = createSlice({
  name: "employeeTable",
  initialState,
  reducers: {
    resetAddEmployee(state, action) {
      state.employeeAddDataLoading = false;
      state.employeeAddedDataIsError = false;
      state.employeeAddedDataError = "";
      state.employeeAddedDataIsSuccess = false;
    },
    resetEditEmployee(state, action) {
      state.employeeEditDataLoading = false;
      state.employeeEditDataIsError = false;
      state.employeeEditDataError = "";
      state.employeeEditDataIsSuccess = false;
    },
    resetDeleteEmployee(state, action) {
      state.employeeDeleteDataLoading = false;
      state.employeeDeleteDataIsError = false;
      state.employeeDeleteDataError = "";
      state.employeeDeleteDataIsSuccess = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getEmployeeTableData.pending, (state, action) => {
        // console.log("Inside pending", action)
        state.data = [];
        state.isLoading = true;
        state.isError = false;
        state.error = "";
        state.isSuccess = false;
      })
      .addCase(getEmployeeTableData.fulfilled, (state, action) => {
        // console.log("Inside fulfilled", action)

        state.data = action.payload;
        state.isLoading = false;
        state.isError = false;
        state.error = "";
        state.isSuccess = true;
        // console.log("Inside fulfilled payload", action.meta.arg)
      })
      .addCase(getEmployeeTableData.rejected, (state, action) => {
        // console.log("Inside error", action)

        state.data = [];
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message == "Invalid Token" ? <div>{action.error.message} <Link href="/login">Please login again</Link></div>: action.error.message;
        state.isSuccess = false;

        // console.log("Inside error payload", action.meta.arg)
      })
      .addCase(getEmployeeProfileData.pending, (state, action) => {
        // console.log("Inside pending", action)
        state.employeeProfileData = {};
        state.employeeProfileIsLoading = true;
        state.employeeProfileIsError = false;
        state.employeeProfileError = "";
        state.employeeProfileIsSuccess = false;
      })
      .addCase(getEmployeeProfileData.fulfilled, (state, action) => {
        // console.log("Inside fulfilled", action)

        state.employeeProfileData = action.payload;
        state.employeeProfileIsLoading = false;
        state.employeeProfileIsError = false;
        state.employeeProfileError = "";
        state.employeeProfileIsSuccess = true;

        // console.log("Inside fulfilled payload", action.meta.arg)
      })
      .addCase(getEmployeeProfileData.rejected, (state, action) => {
        // console.log("Inside error", action)

        state.employeeProfileData = {};
        state.employeeProfileIsLoading = false;
        state.employeeProfileIsError = true;
        state.employeeProfileError = action.error.message == "Invalid Token" ? <div>{action.error.message} <Link href="/login">Please login again</Link></div>: action.error.message;
        state.employeeProfileIsSuccess = false;

        // console.log("Inside error payload", action.meta.arg)
      })
      .addCase(addEmployeeTableData.pending, (state, action) => {
        // console.log("Inside pending", action)

        state.employeeAddedData = {};
        state.employeeAddDataLoading = true;
        state.employeeAddedDataIsError = false;
        state.employeeAddedDataError = "";
        state.employeeAddedDataIsSuccess = false;
      })
      .addCase(addEmployeeTableData.fulfilled, (state, action) => {
        // console.log("Inside fulfilled", action)

        state.employeeAddedData = action.payload;
        state.employeeAddDataLoading = false;
        state.employeeAddedDataIsError = false;
        state.employeeAddedDataError = "";
        state.employeeAddedDataIsSuccess = true;

        // console.log("Inside fulfilled payload", action.meta.arg)
        const { handleAddEmployeeClose, setPage } = action.meta.arg;
        handleAddEmployeeClose();
        setPage(1);
        sessionStorage.setItem("page", 1);
        toast("User Added Successully", { autoClose: 2000, type: "success" });
        employeeTableSlice.caseReducers.resetAddEmployee(state, action);
      })
      .addCase(addEmployeeTableData.rejected, (state, action) => {
        // console.log("Inside error", action)

        state.employeeAddedData = {};
        state.employeeAddDataLoading = false;
        state.employeeAddedDataIsError = true;
        state.employeeAddedDataError = action.error.message;
        state.employeeAddedDataIsSuccess = false;

        toast(action.error.message, { autoClose: 2000, type: "error" });
        employeeTableSlice.caseReducers.resetAddEmployee(state, action);
      })
      .addCase(editEmployeeTableData.pending, (state, action) => {
        // console.log("Inside pending", action)

        state.employeeEditedData = {};
        state.employeeEditDataLoading = true;
        state.employeeEditDataIsError = false;
        state.employeeEditDataError = "";
        state.employeeEditDataIsSuccess = false;
      })
      .addCase(editEmployeeTableData.fulfilled, (state, action) => {
        // console.log("Inside fulfilled", action)

        state.employeeEditedData = action.payload;
        state.employeeEditDataLoading = false;
        state.employeeEditDataIsError = false;
        state.employeeEditDataError = "";
        state.employeeEditDataIsSuccess = true;

        // console.log("Inside fulfilled payload", action.meta.arg)
        const { handleEditEmployeeClose } = action.meta.arg;
        handleEditEmployeeClose();

        toast("User Edited Successully", {
          autoClose: 2000,
          type: "success",
        });
        employeeTableSlice.caseReducers.resetEditEmployee(state, action);
      })
      .addCase(editEmployeeTableData.rejected, (state, action) => {
        // console.log("Inside error", action)

        state.employeeEditedData = {};
        state.employeeEditDataLoading = false;
        state.employeeEditDataIsError = true;
        state.employeeEditDataError = action.error.message;
        state.employeeEditDataIsSuccess = false;

        toast(action.error.message, { autoClose: 2000, type: "error" });
        employeeTableSlice.caseReducers.resetEditEmployee(state, action);
      })
      .addCase(deleteEmployeeTableData.pending, (state, action) => {
        // console.log("Inside pending", action)

        state.employeeDeletedData = {};
        state.employeeDeleteDataLoading = true;
        state.employeeDeleteDataIsError = false;
        state.employeeDeleteDataError = "";
        state.employeeDeleteDataIsSuccess = false;
      })
      .addCase(deleteEmployeeTableData.fulfilled, (state, action) => {
        // console.log("Inside fulfilled", action)

        state.employeeDeletedData = action.payload;
        state.employeeDeleteDataLoading = false;
        state.employeeDeleteDataIsError = false;
        state.employeeDeleteDataError = "";
        state.employeeDeleteDataIsSuccess = true;

        // console.log("Inside fulfilled payload", action.meta.arg)
        const { handleDeleteEmployeeClose, setPage, page } = action.meta.arg;
        handleDeleteEmployeeClose();
        sessionStorage.setItem("page", page);
        setPage(page);
        toast("User Deleted Successully", {
          autoClose: 2000,
          type: "success",
        });
        employeeTableSlice.caseReducers.resetDeleteEmployee(state, action);
      })
      .addCase(deleteEmployeeTableData.rejected, (state, action) => {
        // console.log("Inside error", action)

        state.employeeDeletedData = {};
        state.employeeDeleteDataLoading = false;
        state.employeeDeleteDataIsError = true;
        state.employeeDeleteDataError = action.error.message;
        state.employeeDeleteDataIsSuccess = true;

        toast(action.error.message, { autoClose: 2000, type: "error" });
        employeeTableSlice.caseReducers.resetDeleteEmployee(state, action);
      });
  },
});

export default employeeTableSlice.reducer;
