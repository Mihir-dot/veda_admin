import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import axios from "axios";
import { API_PATH } from "../api-services/apiPath";
import { displayToast } from "./toastSlice";
import { hasAccess } from "../utils/checkPermissions";

// interface type of usertype values
interface UserTypeState {
  error: boolean;
  loading: boolean;
  usersList: Array<Record<string, any>>;
  usertype: Object | null;
}

// define state value
const initialState: UserTypeState = {
  error: false,
  loading: false,
  usersList: [],
  usertype: null,
};

export const fetchUserTypeList = createAsyncThunk(
  "usertype/fetchUserTypeList",
  async (_, { dispatch }) => {
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      const response = await axios.get(`${API_PATH.GET_USERTYPE_DROPDOWN}`, {
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

export const addUserType = createAsyncThunk(
  "usertype/addUserType",
  async (data, { dispatch }) => {
    const hasAddPermission = await hasAccess("add");

    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    if (hasAddPermission.includes("add_usertype")) {
      headers["action"] = "add_usertype";
    }
    try {
      const response = await axios.post(`${API_PATH.ADD_USER_TYPE}`, data, {
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

export const editUserType = createAsyncThunk(
  "usertype/editUserType",
  async (data, { dispatch }) => {
    const hasEditPermission = await hasAccess("edit");
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    if (hasEditPermission.includes("edit_usertype")) {
      headers["action"] = "edit_usertype";
    }
    try {
      const response = await axios.put(`${API_PATH.EDIT_USER_TYPE}`, data, {
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

export const fetchSingleUserType = createAsyncThunk(
  "usertype/fetchSingleUserType",
  async (id) => {
    try {
      const response = await axios.get(
        `${API_PATH.GET_SINGLE_USERTYPE}/${id}`,
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

export const usertypeStore = createSlice({
  name: "usertype",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUserTypeList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserTypeList.fulfilled, (state, action) => {
        if (action.payload !== undefined && action.payload.type === "Success") {
          state.usersList = action.payload.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchUserTypeList.rejected, (state) => {
        state.usersList = [];
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchSingleUserType.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleUserType.fulfilled, (state, action) => {
        if (action.payload.type === "Success") {
          state.usertype = action.payload.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchSingleUserType.rejected, (state) => {
        state.error = true;
        state.usertype = null;
      });
  },
});

export const getUserTypeData: any = (state: RootState) =>
  state.usertype.usersList;
export const getSingleUserType: any = (state: RootState) =>
  state.usertype.usertype;

export default usertypeStore.reducer;
