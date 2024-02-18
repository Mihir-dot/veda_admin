import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import axios from "axios";
import { API_PATH } from "../api-services/apiPath";
import { hasAccess } from "../utils/checkPermissions";
import { displayToast } from "./toastSlice";

// interface type of log values
interface LogsState {
  apiLogs: Array<Record<string, any>>;
  systemLogs: Array<Record<string, any>>;
  error: boolean;
  loading: boolean;
  limit: number;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  apiLog: Object | null;
  systemLog: Object | null;
}

// define state value
const initialState: LogsState = {
  apiLogs: [],
  systemLogs: [],
  error: false,
  loading: false,
  limit: 10,
  currentPage: 1,
  totalPages: 1,
  totalRecords: 1,
  apiLog: null,
  systemLog: null,
};

export const fetchAllApiLogs = createAsyncThunk(
  "log/fetchAllApiLogs",
  async (data: any, { dispatch }) => {
    const hasLogsPermission = await hasAccess("action");

    const queryParams = {
      limit: data.limit,
      page: data.page,
    };

    if (data.status !== "all") {
      queryParams.status = data.status;
    }
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    if (hasLogsPermission.includes("logs")) {
      headers["action"] = "logs";
    }
    try {
      const response = await axios.get(`${API_PATH.GET_ALL_API_LOGS}`, {
        params: queryParams,
        headers,
      });
      return response.data;
    } catch (error: any) {
      dispatch(
        displayToast({
          msg: error.response.data.message,
          type: "Error",
        })
      );
    }
  }
);

export const fetchSingleApiLog = createAsyncThunk(
  "log/fetchSingleApiLog",
  async (id, { dispatch }) => {
    const hasLogsPermission = await hasAccess("action");
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    if (hasLogsPermission.includes("logs")) {
      headers["action"] = "logs";
    }
    try {
      const response = await axios.get(`${API_PATH.GET_SINGLE_API_LOG}/${id}`, {
        headers,
      });

      return response.data;
    } catch (error: any) {
      dispatch(
        displayToast({
          msg: error.response.data.message,
          type: "Error",
        })
      );
    }
  }
);

export const fetchAllSystemLogs = createAsyncThunk(
  "log/fetchAllSystemLogs",
  async (data: any, { dispatch }) => {
    const hasLogsPermission = await hasAccess("action");

    const queryParams = {
      limit: data.limit,
      page: data.page,
    };

    if (data.res_type !== "all") {
      queryParams.res_type = data.res_type;
    }
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    if (hasLogsPermission.includes("logs")) {
      headers["action"] = "logs";
    }
    try {
      const response = await axios.get(`${API_PATH.GET_ALL_SYSTEM_LOGS}`, {
        params: queryParams,
        headers,
      });
      return response.data;
    } catch (error: any) {
      dispatch(
        displayToast({
          msg: error.response.data.message,
          type: "Error",
        })
      );
    }
  }
);

export const fetchSingleSystemLog = createAsyncThunk(
  "log/fetchSingleSystemLog",
  async (id, { dispatch }) => {
    const hasLogsPermission = await hasAccess("action");
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    if (hasLogsPermission.includes("logs")) {
      headers["action"] = "logs";
    }
    try {
      const response = await axios.get(
        `${API_PATH.GET_SINGLE_SYSTEM_LOG}/${id}`,
        {
          headers,
        }
      );

      return response.data;
    } catch (error: any) {
      dispatch(
        displayToast({
          msg: error.response.data.message,
          type: "Error",
        })
      );
    }
  }
);

// create store with auth namespace

export const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllApiLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllApiLogs.fulfilled, (state, action) => {
        if (action.payload !== undefined && action.payload.type === "Success") {
          state.apiLogs = action.payload.data.log_details;
          state.currentPage = action.payload.data.current_page;
          state.limit = action.payload.data.limit;
          state.totalPages = action.payload.data.total_pages;
          state.totalRecords = action.payload.data.total_records;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllApiLogs.rejected, (state) => {
        state.apiLogs = [];
        state.loading = false;
        state.error = true;
        state.limit = 10;
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalRecords = 1;
      })
      .addCase(fetchAllSystemLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSystemLogs.fulfilled, (state, action) => {
        if (action.payload !== undefined && action.payload.type === "Success") {
          state.systemLogs = action.payload.data.log_details;
          state.currentPage = action.payload.data.current_page;
          state.limit = action.payload.data.limit;
          state.totalPages = action.payload.data.total_pages;
          state.totalRecords = action.payload.data.total_records;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllSystemLogs.rejected, (state) => {
        state.systemLogs = [];
        state.loading = false;
        state.error = true;
        state.limit = 10;
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalRecords = 1;
      })
      .addCase(fetchSingleApiLog.fulfilled, (state, action) => {
        if (action.payload !== undefined && action.payload.type === "Success") {
          state.apiLog = action.payload.data;
          state.error = false;
        }
      })
      .addCase(fetchSingleApiLog.rejected, (state) => {
        state.apiLog = null;
        state.error = true;
      })
      .addCase(fetchSingleSystemLog.fulfilled, (state, action) => {
        if (action.payload !== undefined && action.payload.type === "Success") {
          state.systemLog = action.payload.data;
          state.error = false;
        }
      })
      .addCase(fetchSingleSystemLog.rejected, (state) => {
        state.systemLog = null;
        state.error = true;
      });
  },
});

// getters of state with toke and user
export const getLogsData: any = (state: RootState) => state.logs;

export default logSlice.reducer;
