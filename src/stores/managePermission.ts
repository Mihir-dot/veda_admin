import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import axios from "axios";
import { API_PATH } from "../api-services/apiPath";
import { displayToast } from "./toastSlice";

// interface type of permission values
interface roleState {
  permissions: Object | null;
  error: boolean;
  loading: boolean;
  permission: Object | null;
}

// define state value
const initialState: roleState = {
  permissions: null,
  error: false,
  loading: false,
  permission: null,
};

export const fetchAllPermissions = createAsyncThunk(
  "permission/fetchAllPermissions",
  async () => {
    const response = await axios.get(
      `${API_PATH.PERMISSIONS_URL}/get-all-perm`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  }
);

export const updatePermission = createAsyncThunk(
  "permission/updatePermission",
  async (data: any, { dispatch }) => {
    try {
      const response = await axios.put(
        `${API_PATH.PERMISSIONS_URL}/edit-role-perm`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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

export const fetchSingleModulePermission = createAsyncThunk(
  "permission/fetchSingleModulePermission",
  async (id) => {
    try {
      const response = await axios.get(
        `${API_PATH.PERMISSIONS_URL}/get-role-perm?role_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error--", error);
    }
  }
);

// create store with auth namespace

export const roleStore = createSlice({
  name: "permission",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPermissions.fulfilled, (state, action) => {
        if (action.payload.type === "Success") {
          state.permissions = action.payload.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllPermissions.rejected, (state) => {
        state.permissions = null;
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchSingleModulePermission.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleModulePermission.fulfilled, (state, action) => {
        if (action.payload.type === "Success") {
          state.permission = action.payload.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchSingleModulePermission.rejected, (state) => {
        state.error = true;
        state.permission = null;
      });
  },
});

// getters of state with toke and user
export const getPermissionsData: any = (state: RootState) =>
  state.permission.permissions;
export const getSomePermissionsData: any = (state: RootState) =>
  state.permission.permission;

export default roleStore.reducer;
