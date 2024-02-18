import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import axios from "axios";
import { API_PATH } from "../api-services/apiPath";
import { displayToast } from "./toastSlice";

// interface type of commonlist values
interface ListState {
  countries: Array<Record<string, any>>;
  error: boolean;
  loading: boolean;
  states: Array<Record<string, any>>;
  companiesList: Array<Record<string, any>>;
  currenciesList: Array<Record<string, any>>;
  accountsList: Array<Record<string, any>>;
}

// define state value
const initialState: ListState = {
  countries: [],
  states: [],
  error: false,
  loading: false,
  companiesList: [],
  currenciesList: [],
  accountsList: [],
};

export const fetchAllCountries = createAsyncThunk(
  "list/fetchAllCountries",
  async (_, { dispatch }) => {
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      const response = await axios.get(`${API_PATH.GET_ALL_COUNTRIES}`, {
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

export const fetchAllStates = createAsyncThunk(
  "list/fetchAllStates",
  async (id, { dispatch }) => {
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      const response = await axios.get(`${API_PATH.GET_STATES}/${id}`, {
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

export const fetchCompanyDropdown = createAsyncThunk(
  "list/fetchCompanyDropdown",
  async (_, { dispatch }) => {
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      const response = await axios.get(`${API_PATH.GET_COMPANY_DROPDOWN}`, {
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

export const fetchAccountsDropsown = createAsyncThunk(
  "list/fetchAccountsDropsown",
  async (_, { dispatch }) => {
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      const response = await axios.get(`${API_PATH.GET_ACCOUNT_DROPDOWN}`, {
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

export const fetchCurrency = createAsyncThunk(
  "list/fetchCurrency",
  async (_, { dispatch }) => {
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      const response = await axios.get(`${API_PATH.GET_CURRENCY}`, {
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

export const listStore = createSlice({
  name: "list",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllCountries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCountries.fulfilled, (state, action) => {
        if (action.payload !== undefined && action.payload.type === "Success") {
          state.countries = action.payload.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllCountries.rejected, (state) => {
        state.countries = [];
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchAllStates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllStates.fulfilled, (state, action) => {
        if (action.payload !== undefined && action.payload.type === "Success") {
          state.states = action.payload.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllStates.rejected, (state) => {
        state.states = [];
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchCompanyDropdown.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyDropdown.fulfilled, (state, action) => {
        if (action.payload !== undefined && action.payload.type === "Success") {
          state.companiesList = action.payload.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchCompanyDropdown.rejected, (state) => {
        state.companiesList = [];
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchAccountsDropsown.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAccountsDropsown.fulfilled, (state, action) => {
        if (action.payload !== undefined && action.payload.type === "Success") {
          state.accountsList = action.payload.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAccountsDropsown.rejected, (state) => {
        state.accountsList = [];
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchCurrency.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrency.fulfilled, (state, action) => {
        if (action.payload !== undefined && action.payload.type === "Success") {
          state.currenciesList = action.payload.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchCurrency.rejected, (state) => {
        state.currenciesList = [];
        state.loading = false;
        state.error = true;
      });
  },
});

// getters of state with toke and user
export const getCountriesData: any = (state: RootState) => state.list.countries;
export const getStatesData: any = (state: RootState) => state.list.states;
export const getCompanyDropdownData: any = (state: RootState) =>
  state.list.companiesList;
export const getAccountDropdownData: any = (state: RootState) =>
  state.list.accountsList;
export const getCurrenciesData: any = (state: RootState) =>
  state.list.currenciesList;

export default listStore.reducer;
