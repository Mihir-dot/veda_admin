import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import axios from "axios";
import { API_PATH } from "../api-services/apiPath";
import { displayToast } from "./toastSlice";

// interface type of role values
interface roleState {
  roles: Array<Record<string, any>>;
  error: boolean;
  loading: boolean;
  role: Object | null;
}

// define state value
const initialState: roleState = {
  roles: [],
  error: false,
  loading: false,
  role: null,
};

export const fetchAllRoles = createAsyncThunk(
  "role/fetchAllRoles",
  async () => {
    const response = await axios.get(`${API_PATH.GET_ALL_ROLES}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  }
);

export const addRole = createAsyncThunk(
  "role/addRole",
  async (data: any, { dispatch }) => {
    try {
      const response = await axios.post(`${API_PATH.ADD_ROLE}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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

export const updateSingleRole = createAsyncThunk(
  "role/updateSingleRole",
  async (data: any, { dispatch }) => {
    try {
      const response = await axios.put(`${API_PATH.EDIT_ROLE}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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

export const fetchSingleRole = createAsyncThunk(
  "role/fetchSingleRole",
  async (id) => {
    try {
      const response = await axios.get(`${API_PATH.GET_SINGLE_ROLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("Error--", error);
    }
  }
);

// create store with auth namespace

export const roleStore = createSlice({
  name: "role",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllRoles.fulfilled, (state, action) => {
        if (action.payload.type === "Success") {
          state.roles = action.payload.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllRoles.rejected, (state) => {
        state.roles = [];
        state.loading = false;
        state.error = true;
      })
      .addCase(addRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(addRole.fulfilled, (state, action) => {
        if (action.payload.type === "Success") {
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(addRole.rejected, (state) => {
        state.error = true;
      })
      .addCase(fetchSingleRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleRole.fulfilled, (state, action) => {
        if (action.payload.type === "Success") {
          state.role = action.payload.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchSingleRole.rejected, (state) => {
        state.error = true;
        state.role = null;
      });
  },
});

// getters of state with toke and user
export const getRolesData: any = (state: RootState) => state.role;

export default roleStore.reducer;
