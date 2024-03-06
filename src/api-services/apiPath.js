const API_URL = import.meta.env.VITE_REACT_APP_AUTH_SERVICE;
export const API_PATH = {
  
  //Authentication
  SIGN_IN: `${API_URL}/login`,
  SIGN_OUT: `${API_URL}/logout`,
  FORGET_PASSWORD: `${API_URL}/forgot-password`,
  RESET_PASSWORD: `${API_URL}/reset-password`,

  //contacts
  ADD_CONTACT: `${API_URL}/contacts`,
  EDIT_CONTACT:`${API_URL}/contacts/update`,
  GET_CONTACTS: `${API_URL}/get-all-contacts`,
  DELETE_CONTACT_DETAILS: `${API_URL}/delete-contacts`,
  GET_CONTACT_DETAILS:`${API_URL}/get-contacts`,

  //service
  ADD_SERVICE: `${API_URL}/create/services`,
  GET_SERVICE:`${API_URL}/get/services`,
  UPDATE_SERVICE:`${API_URL}/update/services`,
};
