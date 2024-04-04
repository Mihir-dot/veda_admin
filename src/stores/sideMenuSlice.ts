import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "../base-components/Lucide";

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
}

const initialState: SideMenuState = {
  menu: [
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
          pathname: "/resources",
          title: "Resources",
          key: "manage-resources",
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
  ],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {
    removeItemFromLocalStorage: () => {
      localStorage.removeItem("newHomeAdded");
      localStorage.removeItem("newAboutAdded");
      localStorage.removeItem("newServiceAdded");
      localStorage.removeItem("newPodcastAdded")
      localStorage.removeItem("newResourcesAdded")
      localStorage.removeItem("newFounderAdded")
      localStorage.removeItem("reviewId");
      localStorage.removeItem("newFaqAdded")
    },
  },
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export const { removeItemFromLocalStorage } = sideMenuSlice.actions;

export default sideMenuSlice.reducer;
