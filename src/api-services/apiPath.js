const API_URL = import.meta.env.VITE_REACT_APP_AUTH_SERVICE;
export const API_PATH = {

  //Authentication
  SIGN_IN: `${API_URL}/login`,
  SIGN_OUT: `${API_URL}/logout`,
  FORGET_PASSWORD: `${API_URL}/forgot-password`,
  RESET_PASSWORD: `${API_URL}/reset-password`,

  //contacts
  ADD_CONTACT: `${API_URL}/contacts`,
  EDIT_CONTACT: `${API_URL}/contacts/update`,
  GET_CONTACTS: `${API_URL}/get-all-contacts`,
  DELETE_CONTACT_DETAILS: `${API_URL}/delete-contacts`,
  GET_CONTACT_DETAILS: `${API_URL}/get-contacts`,

  //service
  ADD_SERVICE: `${API_URL}/create/services`,
  GET_SERVICE: `${API_URL}/get/services`,
  UPDATE_SERVICE: `${API_URL}/update/services`,
  GET_ALL_SERVICES: `${API_URL}/get/allservices`,
  DELETE_SERVICE: `${API_URL}/delete/service`,

  //review
  GET_REVIEW: `${API_URL}/get/allratting`,
  ADD_REVIEW: `${API_URL}/create/ratting`,
  GET_REVIEW_DETAILS: `${API_URL}/get/ratting`,
  UPDATE_REVIEW: `${API_URL}/update/ratting`,
  DELETE_REVIEW: `${API_URL}/delete/ratting`,

  //Social Media
  GET_SOCIAL_MEDIA: `${API_URL}/get/all/social/media`,
  UPDATE_SOCIAL_MEDIA: `${API_URL}/update/social/media`,
  GET_SOCIAL_MEDIA_DETAILS: `${API_URL}/get/social/media/ById`,


  //About Us Data
  GET_ABOUT_DATA: `${API_URL}/get/allabout`,
  GET_ABOUT_DETAILS: `${API_URL}/get/about`,
  ADD_ABOUT_DETAILS: `${API_URL}/create/about`,
  UPDATE_ABOUT_DETAILS: `${API_URL}/update/about`,
  DELETE_ABOUT_DETAILS: `${API_URL}/delete/about`,

  // Home Data
  GET_PATH: `${API_URL}/get/allPath`,
  GET_HOME_DATA: `${API_URL}/get/allDashboard`,
  ADD_HOME_DATA: `${API_URL}/create/dashboard`,
  UPDATE_HOME_DATA: `${API_URL}/update/dashboard`,
  GET_HOME_DETAILS: `${API_URL}/get/dashboard`,

  //FAQ 
  GET_FAQ_DATA: `${API_URL}/get/allFaq`,
  GET_FAQ_DETAILS: `${API_URL}/get/faq`,
  ADD_FAQ_DETAILS: `${API_URL}/create/faq`,
  UPDATE_FAQ_DETAILS: `${API_URL}/update/faq`,
  DELETE_FAQ_DETAILS: `${API_URL}/delete/faq`,

  //PodCast
  GET_PODCAST_DATA: `${API_URL}/get/allprodcast`,
  GET_PODCAST_DETAILS: `${API_URL}/get/prodcast`,
  ADD_PODCAST_DETAILS: `${API_URL}/create/prodcast`,
  UPDATE_PODCAST_DETAILS: `${API_URL}/update/prodcast`,
  DELETE_PODCAST_DETAILS: `${API_URL}/delete/prodcast`,

  //Resources
  GET_RESOURCES_DATA: `${API_URL}/get/allresource`,
  GET_RESOURCES_DETAILS: `${API_URL}/get/resource`,
  ADD_RESOURCES_DETAILS: `${API_URL}/create/resource`,
  UPDATE_RESOURCES_DETAILS: `${API_URL}/update/resource`,
  DELETE_RESOURCES_DETAILS: `${API_URL}/delete/resource`,

  //Founder /C.E.O
  GET_FOUNDER_DATA: `${API_URL}/get/allblog`,
  GET_FOUNDER_DETAILS: `${API_URL}/get/blog`,
  ADD_FOUNDER_DETAILS: `${API_URL}/create/blog`,
  UPDATE_FOUNDER_DETAILS: `${API_URL}/update/blog`,
  DELETE_FOUNDER_DETAILS: `${API_URL}/delete/blog`,

};
export const IMAGE_BASE_URL = "http://170.64.144.128:5000/get/image"
export const getImageSource = (urlPath) => `${IMAGE_BASE_URL}?urlPath=/${urlPath?.replace(/\\/g, '/')}`;
