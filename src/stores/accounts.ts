import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import axios from "axios";
import { API_PATH } from "../api-services/apiPath";
import { hasAccess } from "../utils/checkPermissions";
import { displayToast } from "./toastSlice";

// interface type of account values
interface AccountState {
  accounts: Array<Record<string, any>>;
  error: boolean;
  loading: boolean;
  limit: number;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  account: Object | null;
  searchText: string;
}

// define state value
const initialState: AccountState = {
  accounts: [],
  error: false,
  loading: false,
  limit: 10,
  currentPage: 1,
  totalPages: 1,
  totalRecords: 1,
  account: null,
  searchText: "",
};

export const fetchAllAccountsData = createAsyncThunk(
  "account/fetchAllAccountsData",
  async (data: any, { dispatch }) => {
    const hasViewPermission = await hasAccess("view");

    const queryParams = {
      limit: data.limit,
      page: data.page,
      search: data.searchText,
    };

    if (data.status !== "all") {
      queryParams.status = data.status;
    }
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    if (hasViewPermission.includes("view_account")) {
      headers["action"] = "view_account";
    }
    try {
      const response = await axios.get(`${API_PATH.GET_ALL_ACCOUNTS}`, {
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

export const fetchSingleAccount = createAsyncThunk(
  "account/fetchSingleAccount",
  async (id, { dispatch }) => {
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      const response = await axios.get(`${API_PATH.GET_SINGLE_ACCOUNT}/${id}`, {
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

export const addAccount = createAsyncThunk(
  "account/addAccount",
  async (data, { dispatch }) => {
    const hasAddPermission = await hasAccess("add");

    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    };

    if (hasAddPermission.includes("add_account")) {
      headers["action"] = "add_account";
    }
    try {
      const response = await axios.post(`${API_PATH.ADD_ACCOUNT}`, data, {
        headers,
      });
      if (response.status === 200) {
        dispatch(
          displayToast({
            msg: response.data.message,
            type: response.data.type,
          })
        );
      }
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

export const editAccount = createAsyncThunk(
  "account/editAccount",
  async (data, { dispatch }) => {
    const hasEditPermission = await hasAccess("edit");

    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    };

    if (hasEditPermission.includes("edit_account")) {
      headers["action"] = "edit_account";
    }
    try {
      const response = await axios.put(`${API_PATH.ADD_ACCOUNT}`, data, {
        headers,
      });
      if (response.status === 200) {
        dispatch(
          displayToast({
            msg: response.data.message,
            type: response.data.type,
          })
        );
      }
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

export const deleteAccount = createAsyncThunk(
  "account/deleteAccount",
  async (id, { dispatch }) => {
    const hasDeletePermission = await hasAccess("delete");
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    if (hasDeletePermission.includes("delete_account")) {
      headers["action"] = "delete_account";
    }
    try {
      const response = await axios.delete(`${API_PATH.DELETE_ACCOUNT}/${id}`, {
        headers,
      });
      if (response.status === 200) {
        dispatch(
          displayToast({
            msg: response.data.message,
            type: response.data.type,
          })
        );
      }
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

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllAccountsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAccountsData.fulfilled, (state, action) => {
        if (action.payload !== undefined && action.payload.type === "Success") {
          state.accounts = action.payload.data.account_details;
          state.currentPage = action.payload.data.current_page;
          state.limit = action.payload.data.limit;
          state.totalPages = action.payload.data.total_pages;
          state.totalRecords = action.payload.data.total_records;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllAccountsData.rejected, (state) => {
        state.accounts = [];
        state.loading = false;
        state.error = true;
        state.limit = 10;
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalRecords = 1;
      })
      .addCase(fetchSingleAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleAccount.fulfilled, (state, action) => {
        if (action.payload !== undefined && action.payload.type === "Success") {
          state.account = action.payload.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchSingleAccount.rejected, (state) => {
        state.account = null;
        state.loading = false;
        state.error = true;
      });
  },
});

// getters of state with toke and user
export const getAccountsData: any = (state: RootState) => state.account;

export default accountSlice.reducer;
