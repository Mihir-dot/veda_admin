import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import axios from "axios";
import { API_PATH } from "../api-services/apiPath";
import { hasAccess } from "../utils/checkPermissions";
import { displayToast } from "./toastSlice";

// interface type of company values
interface CompanyState {
  companies: Array<Record<string, any>>;
  error: boolean;
  loading: boolean;
  limit: number;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  companyCode: string;
  company: Object | null;
  searchText: string;
}

// define state value
const initialState: CompanyState = {
  companies: [],
  error: false,
  loading: false,
  limit: 10,
  currentPage: 1,
  totalPages: 1,
  totalRecords: 1,
  companyCode: "",
  company: null,
  searchText: "",
};

export const fetchAllCompaniesData = createAsyncThunk(
  "company/fetchAllCompaniesData",
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

    if (hasViewPermission.includes("view_company")) {
      headers["action"] = "view_company";
    }
    try {
      const response = await axios.get(`${API_PATH.GET_ALL_COMPANIES}`, {
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

export const fetchSingleCompany = createAsyncThunk(
  "company/fetchSingleCompany",
  async (id, { dispatch }) => {
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      const response = await axios.get(`${API_PATH.GET_SINGLE_COMPANY}/${id}`, {
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

export const addCompany = createAsyncThunk(
  "company/addCompany",
  async (data, { dispatch }) => {
    const hasAddPermission = await hasAccess("add");

    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    };

    if (hasAddPermission.includes("add_company")) {
      headers["action"] = "add_company";
    }
    try {
      const response = await axios.post(`${API_PATH.ADD_COMPANY}`, data, {
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

export const editCompany = createAsyncThunk(
  "company/editCompany",
  async (data, { dispatch }) => {
    const hasEditPermission = await hasAccess("edit");

    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    };

    if (hasEditPermission.includes("edit_company")) {
      headers["action"] = "edit_company";
    }
    try {
      const response = await axios.put(`${API_PATH.ADD_COMPANY}`, data, {
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

export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (id, { dispatch }) => {
    const hasDeletePermission = await hasAccess("delete");
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    if (hasDeletePermission.includes("delete_company")) {
      headers["action"] = "delete_company";
    }
    try {
      const response = await axios.delete(`${API_PATH.DELETE_COMPANY}/${id}`, {
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

export const fetchCompanyCode = createAsyncThunk(
  "company/fetchCompanyCode",
  async (_, { dispatch }) => {
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      const response = await axios.get(`${API_PATH.GET_COMPANY_CODE}`, {
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

// create store with auth namespace

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllCompaniesData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCompaniesData.fulfilled, (state, action) => {
        if (action.payload !== undefined && action.payload.type === "Success") {
          state.companies = action.payload.data.company_details;
          state.currentPage = action.payload.data.current_page;
          state.limit = action.payload.data.limit;
          state.totalPages = action.payload.data.total_pages;
          state.totalRecords = action.payload.data.total_records;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllCompaniesData.rejected, (state) => {
        state.companies = [];
        state.loading = false;
        state.error = true;
        state.limit = 10;
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalRecords = 1;
      })
      .addCase(fetchSingleCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleCompany.fulfilled, (state, action) => {
        if (action.payload !== undefined && action.payload.type === "Success") {
          state.company = action.payload.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchSingleCompany.rejected, (state) => {
        state.company = null;
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchCompanyCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyCode.fulfilled, (state, action) => {
        if (action.payload !== undefined && action.payload.type === "Success") {
          state.companyCode = action.payload.data.next_company_code;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchCompanyCode.rejected, (state) => {
        state.companyCode = "";
        state.loading = false;
        state.error = true;
      });
  },
});

// getters of state with toke and user
export const getCompaniesData: any = (state: RootState) => state.company;

export default companySlice.reducer;
