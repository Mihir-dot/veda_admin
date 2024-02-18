import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import axios from "axios";
import { API_PATH } from "../api-services/apiPath";
import { hasAccess } from "../utils/checkPermissions";
import { displayToast } from "./toastSlice";

// interface type of user values
interface UserState {
  users: Array<Record<string, any>>;
  error: boolean;
  loading: boolean;
  limit: number;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  user: Object | null;
  searchText: string;
  userProfile: Object | null;
}

// define state value
const initialState: UserState = {
  users: [],
  error: false,
  loading: false,
  limit: 10,
  currentPage: 1,
  totalPages: 1,
  totalRecords: 1,
  user: null,
  searchText: "",
  userProfile: null,
};

export const fetchAllUsersData = createAsyncThunk(
  "user/fetchAllUsersData",
  async (data: any, { dispatch }) => {
    const hasViewPermission = await hasAccess("view");

    const queryParams = {
      limit: data.limit,
      page: data.page,
      search: data.searchText,
    };

    if (data.enable !== "all") {
      queryParams.enable = data.enable;
    }
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    if (hasViewPermission.includes("view_user")) {
      headers["action"] = "view_user";
    }
    try {
      const response = await axios.get(`${API_PATH.GET_ALL_USERS}`, {
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

export const fetchSingleUser = createAsyncThunk(
  "user/fetchSingleUser",
  async (id, { dispatch }) => {
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      const response = await axios.get(`${API_PATH.GET_SINGLE_USER}/${id}`, {
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

export const addUser = createAsyncThunk(
  "user/addUser",
  async (data, { dispatch }) => {
    const hasAddPermission = await hasAccess("add");

    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    };

    if (hasAddPermission.includes("add_user")) {
      headers["action"] = "add_user";
    }
    try {
      const response = await axios.post(`${API_PATH.ADD_USER}`, data, {
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

export const editUser = createAsyncThunk(
  "user/editUser",
  async (data, { dispatch }) => {
    const hasEditPermission = await hasAccess("edit");
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    };

    if (hasEditPermission.includes("edit_user")) {
      headers["action"] = "edit_user";
    }
    try {
      const response = await axios.put(`${API_PATH.ADD_USER}`, data, {
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

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { dispatch }) => {
    const hasDeletePermission = await hasAccess("delete");

    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    if (hasDeletePermission.includes("delete_user")) {
      headers["action"] = "delete_user";
    }
    try {
      const response = await axios.delete(`${API_PATH.DELETE_USER}/${id}`, {
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

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (data, { dispatch }) => {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      const response = await axios.put(
        `${API_PATH.UPDATE_USER_PROFILE}`,
        data,
        {
          headers,
        }
      );
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

export const verifyUser = createAsyncThunk(
  "user/verifyUser",
  async (data, { dispatch }) => {
    try {
      const response = await axios.post(`${API_PATH.VERIFY_USER}`, data);
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

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllUsersData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsersData.fulfilled, (state, action) => {
        if (action.payload !== undefined && action.payload.type === "Success") {
          state.users = action.payload.data.user_details;
          state.currentPage = action.payload.data.current_page;
          state.limit = action.payload.data.limit;
          state.totalPages = action.payload.data.total_pages;
          state.totalRecords = action.payload.data.total_records;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllUsersData.rejected, (state) => {
        state.users = [];
        state.loading = false;
        state.error = true;
        state.limit = 10;
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalRecords = 1;
      })
      .addCase(fetchSingleUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleUser.fulfilled, (state, action) => {
        if (action.payload !== undefined && action.payload.type === "Success") {
          state.user = action.payload.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchSingleUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.error = true;
      });
  },
});

// getters of state with toke and user
export const getUsersData: any = (state: RootState) => state.user;

export default userSlice.reducer;
