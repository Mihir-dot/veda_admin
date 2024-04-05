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
  name: "",
  link: "",
};

type TextInputState = {
  _id: string;
  picture: File | null;
  name: string;
  link: string;
};

type ErrorState = {
  name: string;
  link: string;
};
type ImageState = {
  picture: File | null;
};

type FormState = TextInputState;

const AddPodCast: React.FC = () => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const isPodcastAdded = localStorage.getItem("newPodcastAdded");
  const [formErrors, setFormErrors] = useState<ErrorState>({
    name: "",
    link: "",
  });
  const [imageError, setImageError] = useState({
    picture: "",
  });

  useEffect(() => {
    getHomeDetails();
  }, []);

  const getHomeDetails = async () => {
    try {
      if (isPodcastAdded) {
        const response = await axios.get(
          `${API_PATH.GET_PODCAST_DETAILS}/${isPodcastAdded}`
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
      formDataToSend.append("name", initFormData.name);
      formDataToSend.append("link", initFormData.link);

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
      if (isPodcastAdded) {
        const response = await axios.put(
          `${API_PATH.UPDATE_PODCAST_DETAILS}/${isPodcastAdded}`,
          formDataToSend,
          {
            headers: getAuthHeaders(),
          }
        );
        if (response.data) {
          toast.success(response.data.message);
          localStorage.removeItem("newPodcastAdded");
          navigate("/podcast");
        }
      } else {
        const response = await axios.post(
          `${API_PATH.ADD_PODCAST_DETAILS}`,
          formDataToSend,
          { headers: getAuthHeaders() }
        );
        if (response.data) {
          toast.success(response.data.message);
          navigate("/podcast");
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
          HeaderText="Podcast Page"
          Breadcrumb={[
            {
              name: `${isPodcastAdded ? "Podcast Update" : "Podcast Add"}`,
              navigate: "#",
            },
          ]}
          to="/podcast"
        />
        <div className="flex items-center mt-5">
          <h2 className="mr-auto text-lg font-medium intro-y">
            {isPodcastAdded ? "Update Podcast" : "Add Podcast"}
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
                  name <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="name"
                  className={clsx({
                    "border-danger": formErrors.name,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "name")
                  }
                  placeholder="Enter Card Title"
                  value={initFormData.name}
                />
                {formErrors.name && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.name === "string" && formErrors.name}
                  </div>
                )}
              </div>

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Link <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="link"
                  className={clsx({
                    "border-danger": formErrors.link,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "link")
                  }
                  placeholder="Enter Main title"
                  value={initFormData.link}
                />
                {formErrors.link && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.link === "string" && formErrors.link}
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
                <b className="text-green-800">
                  * Please Upload banner image in 1920 x 400 px
                </b>
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
                      {isPodcastAdded
                        ? "Update Podcast Data"
                        : "Add Podcast Data"}
                      <LoadingIcon
                        icon="oval"
                        color="white"
                        className="w-4 h-4 ml-2"
                      />
                    </>
                  ) : (
                    <>
                      {" "}
                      {isPodcastAdded
                        ? "Update Podcast Data"
                        : "Add Podcast Data"}
                    </>
                  )}
                </Button>
                <Button
                  variant="instagram"
                  className="ml-2"
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("newPodcastAdded");
                    navigate("/podcast");
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

export default AddPodCast;
