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
      localStorage.removeItem("newServiceAdded")
      localStorage.removeItem("reviewId")

    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPermissions.fulfilled, (state, action) => {

      state.menu = [
        "START MENU",
        {
          icon: "Database",
          title: "Dashboard",
          pathname: "/",
          custom_key: "dashboard",
        },
        {
          icon: "Home",
          title: "Home",
          pathname: "/home",
          custom_key: "home",
        },
        {
          icon: "Building2",
          title: "About Us",
          pathname: "/about",
        },
        {
          icon: "Album",
          title: "Services",
          pathname: "/service",
        },
        {
          icon: "Navigation",
          title: "Advocacy & Career",
          subMenu: [
            {
              icon: "Album",
              pathname: "/podcast",
              title: "Podcast",
              key: "manage-podcast",
            },
            {
              icon: "RefreshCw",
              pathname: "/resource",
              title: "Resources",
              key: "manage-resource",
            },
            {
              icon: "Factory",
              pathname: "/founder",
              title: "Founder / C.E.O",
              key: "manage-founder",
            },
          ],
        },
        {
          icon: "Contact",
          title: "Contact",
          pathname: "/contact",
        },
      
        {
          icon: "Building",
          title: "Review & Rating",
          pathname: "/review",
        },
        {
          icon: "Youtube",
          title: "Social Media",
          pathname: "/social-media",
        },
     
        // {
        //   icon: "User",
        //   title: "User Contact",
        //   pathname: "/user-contact",
        // },
      
        {
          icon: "Factory",
          title: "FAQs",
          pathname: "/faq",
        },
       
      ];
     
    });
  },
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export const { removeItemFromLocalStorage } = sideMenuSlice.actions;

export default sideMenuSlice.reducer;
