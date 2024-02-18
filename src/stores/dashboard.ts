import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import axios from "axios";
import { API_PATH } from "../api-services/apiPath";
import { displayToast } from "./toastSlice";

// interface type of dashboard values
interface DashboardState {
  user: Object | any;
  error: boolean;
  loading: boolean;
}

// define state value
const initialState: DashboardState = {
  user: null,
  error: false,
  loading: false,
};

export const setDashboardData = createAsyncThunk(
  "auth/setDashboardData",
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`${API_PATH.GET_DASHBOARD_DATA}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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

// create store with auth namespace

export const dashboardStore = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetUserData: (state) => {
      state.user = null;
      state.error = false;
      state.loading = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(setDashboardData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(setDashboardData.fulfilled, (state, action) => {
        if (action.payload?.type === "Success") {
          state.user = action.payload.user_details;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(setDashboardData.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = true;
      });
  },
});

// getters of state with toke and user
export const getUserData: any = (state: RootState) => state.dashboard;
export const { resetUserData } = dashboardStore.actions;

export default dashboardStore.reducer;
