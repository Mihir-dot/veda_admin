import React, { useState, ChangeEvent, useEffect } from "react";
import { FormInput, FormLabel, FormTextarea } from "../../base-components/Form";
import clsx from "clsx";
import TomSelect from "../../base-components/TomSelect";

import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingIcon from "../../base-components/LoadingIcon";
import { validateService } from "../../utils/validations";
import { getAuthHeaders } from "../../utils/helper";
import { API_PATH } from "../../api-services/apiPath";

interface Path {
  _id: string;
  title: string;
  path: string;
}
const initialState = {
  _id: "",
  banner1: null,
  banner2: null,
  card_title: "",
  card_main_title: "",
  card_content: "",
  Link: "",
  homePageTitleOne: "",
  homePageTitleTwo: "",
  homePageDescription: "",
  homageImageOne: null,
  homePageImageTwo: null,
};

type TextInputState = {
  _id: string;
  banner1: File | null;
  banner2: File | null;
  card_title: string;
  card_main_title: string;
  card_content: string;
  Link: string;
  homePageTitleOne: string;
  homePageTitleTwo: string;
  homePageDescription: string;
  homageImageOne: File | null;
  homePageImageTwo: File | null;
};

type ErrorState = {
  card_title: string;
  card_main_title: string;
  card_content: string;
  Link: string;
  homePageTitleOne: string;
  homePageTitleTwo: string;
  homePageDescription: string;
};
type ImageState = {
  image: File | null;
  banner: File | null;
};

type FormState = TextInputState;

const AddHome: React.FC = () => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
  });
  console.log("initFormdata------", initFormData);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paths, setPaths] = useState<Path[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState(false);
  const isHomeAdded = localStorage.getItem("newHomeAdded");
  const [formErrors, setFormErrors] = useState<ErrorState>({
    card_title: "",
    card_main_title: "",
    card_content: "",
    Link: "",
    homePageTitleOne: "",
    homePageTitleTwo: "",
    homePageDescription: "",
  });
  const [imageError, setImageError] = useState({
    banner1: "",
    banner2: "",
    homageImageOne: "",
    homePageImageTwo: "",
  });

  useEffect(() => {
    // Fetch paths from the API when the component mounts
    const fetchPaths = async () => {
      try {
        const response = await axios.get(API_PATH.GET_PATH);
        setPaths(response.data);
      } catch (error) {
        console.error("Error fetching paths:", error);
      }
    };
    fetchPaths();
    getHomeDetails();
  }, []);



  const getHomeDetails = async () => {
    try {
      if (isHomeAdded) {
        const response = await axios.get(
          `${API_PATH.GET_HOME_DETAILS}/${isHomeAdded}`
        );
        const homeData = response.data;

        // Set the form data with the fetched details
        setInitFormData(homeData);
      }
    } catch (error) {
      console.log("error----", error);
    }
  };
  const handleChange = (key: string, value: string) => {
    const form = document.forms.namedItem("serviceForm") as HTMLFormElement;
    if (form) {
      const formData = new FormData(form);
      formData.set(key, value);

      let errors = validateService(formData);
      setFormErrors(errors);
      setIsFormValid(Object.keys(errors).length === 0);
    } else {
      console.error("Form not found");
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    fieldName: keyof TextInputState
  ) => {
    const value = e.target.value;
    setInitFormData((prevState) => ({ ...prevState, [fieldName]: value }));
    handleChange(fieldName, value);
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: "banner1" | "banner2" | "homageImageOne" | "homePageImageTwo"
  ) => {
    const file = event.target.files?.[0];
  
    const checkFile = (allowedExtensions: string[]) => {
      const fileExtension = (file?.name.split(".").pop() || "").toLowerCase();
  
      if (file && allowedExtensions.includes(fileExtension)) {
        // Valid file extension
        setInitFormData((prevState) => ({
          ...prevState,
          [fieldName]: file,
        }));
        setImageError((prev) => ({
          ...prev,
          [fieldName]: "",
        }));
      } else {
        // Invalid file extension
        setImageError((prev) => ({
          ...prev,
          [fieldName]: `Please select a file with ${allowedExtensions.join(", ")} extension`,
        }));
      }
    };
  
    if (fieldName === "banner1") {
      checkFile(["jpg", "jpeg", "png"]);
    } else if (fieldName === "banner2") {
      checkFile(["jpg", "jpeg", "png"]);
    } else if (fieldName === "homageImageOne") {
      checkFile(["jpg", "jpeg", "png"]);
    } else if (fieldName === "homePageImageTwo") {
      checkFile(["jpg", "jpeg", "png"]);
    } else {
      // Handle other file types if needed
      checkFile([]);
    }
  };
  

  const handleSelectChange = (selectedOption: string) => {
    // Update the selected path when the dropdown value changes
    setSelectedPath(selectedOption);

    // Update the Link field in the initFormData state
    setInitFormData((prevState) => ({
      ...prevState,
      Link: selectedOption, // Assuming selectedOption contains the path value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const formDataToSend = new FormData();
      // formDataToSend.append("id", initFormData._id);
      formDataToSend.append("card_title", initFormData.card_title);
      formDataToSend.append("card_main_title", initFormData.card_main_title);
      formDataToSend.append("card_content", initFormData.card_content);
      formDataToSend.append("Link", initFormData.Link);
      formDataToSend.append("homePageTitleOne", initFormData.homePageTitleOne);
      formDataToSend.append("homePageTitleTwo", initFormData.homePageTitleTwo);
      formDataToSend.append("homePageDescription", initFormData.homePageDescription);

      if (initFormData.banner1) {
        formDataToSend.append("banner1", initFormData.banner1);
      }
      if (initFormData.banner2) {
        formDataToSend.append("banner2", initFormData.banner2);
      }
      if (initFormData.homageImageOne) {
        formDataToSend.append("homageImageOne", initFormData.homageImageOne);
      }
      if (initFormData.homePageImageTwo) {
        formDataToSend.append(
          "homePageImageTwo",
          initFormData.homePageImageTwo
        );
      }

      const imageErrors = {
        banner1: "",
        banner2: "",
        homageImageOne: "",
        homePageImageTwo: "",
      };
      if (!initFormData.banner1) {
        imageErrors.banner1 = "Please attach an banner file";
      }
      if (!initFormData.banner2) {
        imageErrors.banner2 = "Please attach a banner file";
      }
      if (!initFormData.homageImageOne) {
        imageErrors.homageImageOne = "Please attach an image file";
      }
      if (!initFormData.homePageImageTwo) {
        imageErrors.homePageImageTwo = "Please attach a banner file";
      }
      setIsLoading(true);
      if (isHomeAdded) {
        const response = await axios.put(
          `${API_PATH.UPDATE_HOME_DATA}/${isHomeAdded}`,
          formDataToSend,
          {
            headers: getAuthHeaders(),
          }
        );
        if (response.data) {
          toast.success(response.data.message);
          localStorage.removeItem("newHomeAdded");
          navigate("/home");
        }
      } else {
        const response = await axios.post(
          `${API_PATH.ADD_HOME_DATA}`,
          formDataToSend,
          { headers: getAuthHeaders() }
        );
        if (response.data) {
          toast.success(response.data.message);
          navigate("/home");
        }
      }
    } catch (error) {
      console.log("error--", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <PageHeader
          HeaderText="Home Page"
          Breadcrumb={[
            {
              name: `${isHomeAdded ? "Home Update" : "Home Add"}`,
              navigate: "#",
            },
          ]}
          to="/home"
        />
        <div className="flex items-center mt-5">
          <h2 className="mr-auto text-lg font-medium intro-y">
            {isHomeAdded ? "Update Home" : "Add Home"}
          </h2>
        </div>
        <div className="py-5 mt-5 intro-y box">
          <div className="px-5 sm:px-20">
            <form
              className="grid grid-cols-12 gap-4 mt-5 gap-y-5"
              name="serviceForm"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Card Title <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="card_title"
                  className={clsx({
                    "border-danger": formErrors.card_title,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "card_title")
                  }
                  placeholder="Enter Card Title"
                  value={initFormData.card_title}
                />
                {formErrors.card_title && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.card_title === "string" &&
                      formErrors.card_title}
                  </div>
                )}
              </div>

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Card Main Title{" "}
                  <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="card_main_title"
                  className={clsx({
                    "border-danger": formErrors.card_main_title,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "card_main_title")
                  }
                  placeholder="Enter Main title"
                  value={initFormData.card_main_title}
                />
                {formErrors.card_main_title && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.card_main_title === "string" &&
                      formErrors.card_main_title}
                  </div>
                )}
              </div>

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Card Content <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormTextarea
                  id="input-wizard-1"
                  name="card_content"
                  className={clsx({
                    "border-danger": formErrors.card_content,
                  })}
                  onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange(e, "card_content")
                  }
                  placeholder="Enter Content"
                  value={initFormData.card_content}
                />
                {formErrors.card_content && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.card_content === "string" &&
                      formErrors.card_content}
                  </div>
                )}
              </div>

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">Link</FormLabel>
                <TomSelect
                  name="userStatus"
                  onChange={handleSelectChange}
                  value={selectedPath}
                >
                  {paths.map((path) => (
                    <option value={path.path} key={path._id}>
                      {path.title}
                    </option>
                  ))}
                </TomSelect>
              </div>


              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  About Us Title One{" "}
                  <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="homePageTitleOne"
                  className={clsx({
                    "border-danger": formErrors.homePageTitleOne,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "homePageTitleOne")
                  }
                  placeholder="Enter title one"
                  value={initFormData.homePageTitleOne}
                />
                {formErrors.homePageTitleOne && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.homePageTitleOne === "string" &&
                      formErrors.homePageTitleOne}
                  </div>
                )}
              </div>
              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  About Us Title Two{" "}
                  <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="homePageTitleTwo"
                  className={clsx({
                    "border-danger": formErrors.homePageTitleTwo,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "homePageTitleTwo")
                  }
                  placeholder="Enter title one"
                  value={initFormData.homePageTitleTwo}
                />
                {formErrors.homePageTitleTwo && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.homePageTitleTwo === "string" &&
                      formErrors.homePageTitleTwo}
                  </div>
                )}
              </div>

              <div className="col-span-12 intro-y sm:col-span-12">
                <FormLabel htmlFor="input-wizard-1">
                  About Us Description <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormTextarea
                  id="input-wizard-1"
                  name="homePageDescription"
                  className={clsx({
                    "border-danger": formErrors.homePageDescription
                  })}
                  onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange(e, "homePageDescription")
                  }
                  placeholder="Enter Content"
                  value={initFormData.homePageDescription}
                />
                {formErrors.homePageDescription && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.homePageDescription === "string" &&
                      formErrors.homePageDescription}
                  </div>
                )}
              </div>



              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Banner 1 <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="file"
                  name="banner1"
                  onChange={(e) => handleFileChange(e, "banner1")}
                  className="border border-gray-200 p-1 bg-white"
                />
                {imageError.banner1 && (
                  <div className="mt-2 text-danger">
                    {typeof imageError.banner1 === "string" &&
                      imageError.banner1}
                  </div>
                )}
              </div>
              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Banner 2<span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="file"
                  name="banner2"
                  onChange={(e) => handleFileChange(e, "banner2")}
                  className="border border-gray-200 p-1 bg-white"
                />
                {imageError.banner2 && (
                  <div className="mt-2 text-danger">
                    {typeof imageError.banner2 === "string" &&
                      imageError.banner2}
                  </div>
                )}
              </div>

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  About Image 1<span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="file"
                  name="homageImageOne"
                  onChange={(e) => handleFileChange(e, "homageImageOne")}
                  className="border border-gray-200 p-1 bg-white"
                />
                {imageError.homageImageOne && (
                  <div className="mt-2 text-danger">
                    {typeof imageError.homageImageOne === "string" &&
                      imageError.homageImageOne}
                  </div>
                )}
              </div>
              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  About Image 2<span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="file"
                  name="homePageImageTwo"
                  onChange={(e) => handleFileChange(e, "homePageImageTwo")}
                  className="border border-gray-200 p-1 bg-white"
                />
                {imageError.homePageImageTwo && (
                  <div className="mt-2 text-danger">
                    {typeof imageError.homePageImageTwo === "string" &&
                      imageError.homePageImageTwo}
                  </div>
                )}
              </div>

              <div className="flex items-center col-span-12 mt-5 intro-y">
                <Button
                  variant="primary"
                  className=""
                  type="submit"
                  // disabled={imageError.image || imageError.video ? true : false}
                >
                  {isLoading ? (
                    <>
                      {isHomeAdded ? "Update Home Data" : "Add Home Data"}
                      <LoadingIcon
                        icon="oval"
                        color="white"
                        className="w-4 h-4 ml-2"
                      />
                    </>
                  ) : (
                    <> {isHomeAdded ? "Update Home Data" : "Add Home Data"}</>
                  )}
                </Button>
                <Button
                  variant="instagram"
                  className="ml-2"
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("newHomeAdded");
                    navigate("/home");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddHome;
