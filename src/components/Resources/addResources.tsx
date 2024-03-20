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
import { validatePodcast, validateService } from "../../utils/validations";
import { getAuthHeaders } from "../../utils/helper";
import { API_PATH } from "../../api-services/apiPath";

const initialState = {
  _id: "",
  picture: null,
  titleOne: "",
  descriptionOne: "",
  titleTwo:"",
  descriptionTwo:""
};

type TextInputState = {
  _id: string;
  picture: File | null;
  titleOne: string;
  descriptionOne: string;
  titleTwo: string;
  descriptionTwo: string;
};

type ErrorState = {
  titleOne: string;
  descriptionOne: string;
  titleTwo: string;
  descriptionTwo: string;
};
type ImageState = {
  picture: File | null;
};

type FormState = TextInputState;

const AddResources: React.FC = () => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const isResourcesAdded = localStorage.getItem("newResourcesAdded");
  const [formErrors, setFormErrors] = useState<ErrorState>({
    titleOne: "",
    descriptionOne: "",
    titleTwo:"",
    descriptionTwo:""
  });
  const [imageError, setImageError] = useState({
    picture: "",
  });

  useEffect(() => {
    getHomeDetails();
  }, []);

  const getHomeDetails = async () => {
    try {
      if (isResourcesAdded) {
        const response = await axios.get(
          `${API_PATH.GET_RESOURCES_DETAILS}/${isResourcesAdded}`
        );
        const podCastData = response.data;

        // Set the form data with the fetched details
        setInitFormData(podCastData);
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

      let errors = validatePodcast(formData);
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
    fieldName: "picture"
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
          [fieldName]: `Please select a file with ${allowedExtensions.join(
            ", "
          )} extension`,
        }));
      }
    };

    if (fieldName === "picture") {
      checkFile(["jpg", "jpeg", "png"]);
    } else {
      // Handle other file types if needed
      checkFile([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const formDataToSend = new FormData();
      // formDataToSend.append("id", initFormData._id);
      formDataToSend.append("titleOne", initFormData.titleOne);
      formDataToSend.append("descriptionOne", initFormData.descriptionOne);
      formDataToSend.append("titleTwo", initFormData.titleTwo);
      formDataToSend.append("descriptionTwo", initFormData.descriptionTwo);

      if (initFormData.picture) {
        formDataToSend.append("picture", initFormData.picture);
      }
      const imageErrors = {
        picture: "",
      };
      if (!initFormData.picture) {
        imageErrors.picture = "Please attach an picture file";
      }

      setIsLoading(true);
      if (isResourcesAdded) {
        const response = await axios.put(
          `${API_PATH.UPDATE_RESOURCES_DETAILS}/${isResourcesAdded}`,
          formDataToSend,
          {
            headers: getAuthHeaders(),
          }
        );
        if (response.data) {
          toast.success(response.data.message);
          localStorage.removeItem("newResourcesAdded");
          navigate("/resources");
        }
      } else {
        const response = await axios.post(
          `${API_PATH.ADD_RESOURCES_DETAILS}`,
          formDataToSend,
          { headers: getAuthHeaders() }
        );
        if (response.data) {
          toast.success(response.data.message);
          navigate("/resources");
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
          HeaderText="Resources Page"
          Breadcrumb={[
            {
              name: `${isResourcesAdded ? "Resources Update" : "Resources Add"}`,
              navigate: "#",
            },
          ]}
          to="/resources"
        />
        <div className="flex items-center mt-5">
          <h2 className="mr-auto text-lg font-medium intro-y">
            {isResourcesAdded ? "Update Resources" : "Add Resources"}
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
                  Title One <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="titleOne"
                  className={clsx({
                    "border-danger": formErrors.titleOne,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "titleOne")
                  }
                  placeholder="Enter Title"
                  value={initFormData.titleOne}
                />
                {formErrors.titleOne && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.titleOne === "string" && formErrors.titleOne}
                  </div>
                )}
              </div>

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Description One <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="descriptionOne"
                  className={clsx({
                    "border-danger": formErrors.descriptionOne,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "descriptionOne")
                  }
                  placeholder="Enter descritpion"
                  value={initFormData.descriptionOne}
                />
                {formErrors.descriptionOne && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.descriptionOne === "string" && formErrors.descriptionOne}
                  </div>
                )}
              </div>

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Title Two <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="titleTwo"
                  className={clsx({
                    "border-danger": formErrors.titleTwo,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "titleTwo")
                  }
                  placeholder="Enter Title"
                  value={initFormData.titleTwo}
                />
                {formErrors.titleTwo && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.titleTwo === "string" && formErrors.titleTwo}
                  </div>
                )}
              </div>

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Description Two <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="descriptionTwo"
                  className={clsx({
                    "border-danger": formErrors.descriptionTwo,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "descriptionTwo")
                  }
                  placeholder="Enter description"
                  value={initFormData.descriptionTwo}
                />
                {formErrors.descriptionTwo && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.descriptionTwo === "string" && formErrors.descriptionTwo}
                  </div>
                )}
              </div>


              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Picture <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="file"
                  name="picture"
                  onChange={(e) => handleFileChange(e, "picture")}
                  className="border border-gray-200 p-1 bg-white"
                />
                {imageError.picture && (
                  <div className="mt-2 text-danger">
                    {typeof imageError.picture === "string" &&
                      imageError.picture}
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
                      {isResourcesAdded ? "Update Resources Data" : "Add Resources Data"}
                      <LoadingIcon
                        icon="oval"
                        color="white"
                        className="w-4 h-4 ml-2"
                      />
                    </>
                  ) : (
                    <>
                      {" "}
                      {isResourcesAdded ? "Update Resources Data" : "Add Resources Data"}
                    </>
                  )}
                </Button>
                <Button
                  variant="instagram"
                  className="ml-2"
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("newResourcesAdded");
                    navigate("/resources");
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

export default AddResources;
