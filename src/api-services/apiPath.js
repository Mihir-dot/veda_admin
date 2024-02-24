const API_URL = import.meta.env.VITE_REACT_APP_AUTH_SERVICE;
const API_ROLE_URL = import.meta.env.VITE_REACT_APP_ROLL_SERVICE;
const API_PERMISSION_URL = import.meta.env.VITE_REACT_APP_PERMISSION_SERVICE;
const API_COMPANY_URL = import.meta.env.VITE_REACT_APP_COMPANY_SERVICE;
const API_USER_URL = import.meta.env.VITE_REACT_APP_USER_SERVICE;
const API_ACCOUNTS_URL = import.meta.env.VITE_REACT_APP_ACCOUNTS_SERVICE;
const API_COMMON_URL = import.meta.env.VITE_REACT_APP_COMMON_SERVICE;
const API_LOGS_URL = import.meta.env.VITE_REACT_APP_LOGS_SERVICE;

export const API_PATH = {
  //Authentication
  SIGN_IN: `${API_URL}/login`,
  SIGN_OUT: `${API_URL}/logout`,
  FORGET_PASSWORD: `${API_URL}/forgot-password`,
  RESET_PASSWORD: `${API_URL}/reset-password`,

  //Dashboard
  GET_DASHBOARD_DATA: `${API_URL}/me`,

  //Roles
  GET_ALL_ROLES: `${API_ROLE_URL}/getall`,
  GET_SINGLE_ROLE: `${API_ROLE_URL}/get`,
  ADD_ROLE: `${API_ROLE_URL}/create`,
  EDIT_ROLE: `${API_ROLE_URL}/update`,

  //Permissions
  PERMISSIONS_URL: `${API_PERMISSION_URL}`,

  //Company
  GET_ALL_COMPANIES: `${API_COMPANY_URL}/getall`,
  ADD_COMPANY: `${API_COMPANY_URL}/add-or-edit`,
  GET_COMPANY_CODE: `${API_COMPANY_URL}/get-next-company-code`,
  GET_SINGLE_COMPANY: `${API_COMPANY_URL}/get`,
  DELETE_COMPANY: `${API_COMPANY_URL}/delete`,
  GET_COMPANY_DROPDOWN: `${API_COMPANY_URL}/get-company-list`,

  //Accounts
  GET_ALL_ACCOUNTS: `${API_ACCOUNTS_URL}/getall`,
  DELETE_ACCOUNT: `${API_ACCOUNTS_URL}/delete`,
  ADD_ACCOUNT: `${API_ACCOUNTS_URL}/add-or-edit`,
  GET_SINGLE_ACCOUNT: `${API_ACCOUNTS_URL}/get`,
  GET_ACCOUNT_DROPDOWN: `${API_ACCOUNTS_URL}/get-list`,

  //User
  GET_ALL_USERS: `${API_USER_URL}/getall`,
  DELETE_USER: `${API_USER_URL}/delete`,
  ADD_USER: `${API_USER_URL}/add-or-edit`,
  GET_SINGLE_USER: `${API_USER_URL}/get`,
  UPDATE_USER_PROFILE: `${API_USER_URL}/edit-profile`,
  VERIFY_USER: `${API_USER_URL}/email-verify`,

  //User Type
  GET_USERTYPE_DROPDOWN: `${API_USER_URL}/usertype/getall`,
  GET_SINGLE_USERTYPE: `${API_USER_URL}/usertype/get`,
  ADD_USER_TYPE: `${API_USER_URL}/usertype/add-or-edit`,
  EDIT_USER_TYPE: `${API_USER_URL}/usertype/add-or-edit`,

  //Logs
  GET_ALL_API_LOGS: `${API_LOGS_URL}/getall-apilogs`,
  GET_SINGLE_API_LOG: `${API_LOGS_URL}/get-apilog`,
  GET_ALL_SYSTEM_LOGS: `${API_LOGS_URL}/getall-adminlogs`,
  GET_SINGLE_SYSTEM_LOG: `${API_LOGS_URL}/get-adminlog`,

  //Get Country List
  GET_ALL_COUNTRIES: `${API_COMMON_URL}/get-country`,
  GET_STATES: `${API_COMMON_URL}/get-state`,
  GET_CURRENCY: `${API_COMMON_URL}/get-currency`,

  //contacts
  ADD_CONTACT: `${API_URL}/contact`,

  //service
  ADD_SERVICE: `${API_URL}/create/services`,

};
