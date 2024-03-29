import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import darkModeReducer from "./darkModeSlice";
import colorSchemeReducer from "./colorSchemeSlice";
import sideMenuReducer from "./sideMenuSlice";
import authReducer from "./auth";
import toastReducer from "./toastSlice";
import dashboardReducer from "./dashboard";
import roleReducer from "./manageRole";
import permissionReducer from "./managePermission";
import listReducer from "./commonList";
import logsReducer from "./logs";

export const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    colorScheme: colorSchemeReducer,
    sideMenu: sideMenuReducer,
    // authentication store
    auth: authReducer,
    role: roleReducer,
    permission: permissionReducer,
    dashboard: dashboardReducer,
    toast: toastReducer,
    list: listReducer,
    logs: logsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
