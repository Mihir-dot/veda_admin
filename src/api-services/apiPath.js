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
  GET_ALL_SERVICES:`${API_URL}/get/allservices`
};
export const IMAGE_BASE_URL = "http://170.64.144.128:5000/get/image"
export const getImageSource = (urlPath) => `${IMAGE_BASE_URL}?urlPath=/${urlPath?.replace(/\\/g, '/')}`;
