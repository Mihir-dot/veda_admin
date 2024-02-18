import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { displayToast } from "./toastSlice";
import axios from "axios";
import { API_PATH } from "../api-services/apiPath";
import { resetUserData } from "./dashboard";

// interface type of auth values
interface AuthState {
  token: any;
  user: Object | any;
  error: any;
}

// define state value
const initialState: AuthState = {
  token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
  user: localStorage.getItem("user") ? localStorage.getItem("user") : null,
  error: null,
};

export const setAuthentication = createAsyncThunk(
  "auth/setAuthentication",
  async (data: any, { dispatch }) => {
    try {
      const response = await axios.post(`${API_PATH.SIGN_IN}`, data);
      if (response.status === 200) {
        dispatch(
          displayToast({
            msg: response.data.message,
            type: response.data.type,
          })
        );
      }
      return response;
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

export const setLogout = createAsyncThunk(
  "auth/setLogout",
  async (_, { dispatch }) => {
    try {
      const response = await axios.post(
        `${API_PATH.SIGN_OUT}`,
        {},
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
        dispatch(resetUserData());
      }
      return response.data;
    } catch (error) {
      dispatch(
        displayToast({
          msg: "Something went wrong",
          type: "Error",
        })
      );
    }
  }
);

export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async (data: any, { dispatch }) => {
    try {
      const response = await axios.post(`${API_PATH.FORGET_PASSWORD}`, data);
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

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: any, { dispatch }) => {
    try {
      const response = await axios.post(`${API_PATH.RESET_PASSWORD}`, data);
      if (response.status === 200) {
        dispatch(
          displayToast({
            msg: response.data.message,
            type: response.data.type,
          })
        );
      }
      return response.data;
    } catch (error) {
      dispatch(
        displayToast({
          msg: "Something went wrong",
          type: "Error",
        })
      );
    }
  }
);

// create store with auth namespace

export const authStore = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(setAuthentication.fulfilled, (state, action) => {
        if (action.payload !== undefined) {
          if (action.payload.status === 200) {
            state.token = action.payload.data.data.token;
            state.user = action.payload.data.data.user;
            localStorage.setItem("token", state.token);
            localStorage.setItem("user", JSON.stringify(state.user));
            localStorage.setItem(
              "role",
              action.payload.data.data.user.role.role_name
            );
            localStorage.setItem(
              "permissions",
              JSON.stringify(action.payload.data.data.user.permissions)
            );
            localStorage.setItem("username", JSON.stringify(state.user.name));
          }
        }
      })
      .addCase(setAuthentication.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(setLogout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.setItem("permissions", JSON.stringify({}));
      })
      .addCase(setLogout.rejected, (state) => {
        state.error = "Error";
      });
  },
});

// getters of state with toke and user
export const selectAuth: any = (state: RootState) => {
  if (!localStorage.getItem("token")) {
    localStorage.setItem("token", "");
  }

  return state.auth;
};

export default authStore.reducer;
