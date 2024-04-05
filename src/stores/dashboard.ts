import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

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
});

// getters of state with toke and user
export const getUserData: any = (state: RootState) => state.dashboard;
export const { resetUserData } = dashboardStore.actions;

export default dashboardStore.reducer;
