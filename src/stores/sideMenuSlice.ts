import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "../base-components/Lucide";
import { SUPER_ADMIN } from "../utils/constants";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
  key?: string;
  custom_key?: string;
}

export interface SideMenuState {
  menu: Array<Menu | string>;
  loading: boolean;
}

export const fetchPermissions = createAsyncThunk(
  "permissions/fetch",
  async () => {
    try {
      const permissionsStr = await localStorage.getItem("permissions");
      const permissions = JSON.parse(permissionsStr);
      return permissions;
    } catch (error) {
      console.error("Error retrieving permissions from localStorage:", error);
      throw error;
    }
  }
);

const initialState: SideMenuState = {
  menu: [],
  loading: false,
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {
    removeItemFromLocalStorage: () => {
      localStorage.removeItem("currentPage");
      localStorage.removeItem("newlyAddedUser");
      localStorage.removeItem("newlyAddedCompany");
      localStorage.removeItem("newlyAddedAccounts");
      localStorage.removeItem("companyId");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPermissions.fulfilled, (state, action) => {

      state.menu = [
        "START MENU",
        {
          icon: "Home",
          title: "Dashboard",
          pathname: "/",
          custom_key: "dashboard",
        },
        {
          icon: "Album",
          title: "Services",
          pathname: "/service",
        },
        {
          icon: "Contact",
          title: "Contact",
          pathname: "/contact",
        },
        {
          icon: "User",
          title: "User Contact",
          pathname: "/user-contact",
        },
       
      ];
     
    });
  },
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export const { removeItemFromLocalStorage } = sideMenuSlice.actions;

export default sideMenuSlice.reducer;
