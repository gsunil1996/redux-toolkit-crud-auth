import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

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

export const getEmployeeTableData = createAsyncThunk(
  "employeeTable/getEmployeeTableData",
  async (payload) => {
    try {
      const { search, gender, status, sort, page } = payload;
      const { data } = await axios.get(
        `http://localhost:5000/employeesTable?search=${search}&gender=${gender}&status=${status}&sort=${sort}&page=${page}`
      );

      return data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const getEmployeeProfileData = createAsyncThunk(
  "employeeTable/getEmployeeProfileData",
  async ({ id }) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/employeesTable/${id}`
      );

      return data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const addEmployeeTableData = createAsyncThunk(
  "employeeTable/addEmployeeTableData",
  async (payload, thunkAPI) => {
    try {
      const { data, employeeData } = payload;

      const response = await axios.post(
        `http://localhost:5000/addEmployee`,
        data
      );

      thunkAPI.dispatch(getEmployeeTableData(employeeData));

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const editEmployeeTableData = createAsyncThunk(
  "employeeTable/editEmployeeTableData",
  async (payload, thunkAPI) => {
    try {
      const { tableRowId, data, employeeData } = payload;

      const response = await axios.patch(
        `http://localhost:5000/updateEmployeeDetails/${tableRowId}`,
        data
      );

      thunkAPI.dispatch(getEmployeeTableData(employeeData));

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const deleteEmployeeTableData = createAsyncThunk(
  "employeeTable/deleteEmployeeTableData",
  async (payload, thunkAPI) => {
    try {
      const { tableRowId, employeeData } = payload;

      const response = await axios.delete(
        `http://localhost:5000/deleteEmployee/${tableRowId}`
      );

      thunkAPI.dispatch(getEmployeeTableData(employeeData));

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
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
        state.error = action.error.message;
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
        state.employeeProfileError = action.error.message;
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
