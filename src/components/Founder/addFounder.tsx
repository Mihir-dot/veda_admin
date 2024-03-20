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
  title: "",
  email: "",
  expertise: "",
  phone_no: "",
  description:""
};

type TextInputState = {
  _id: string;
  picture: File | null;
  title: string;
  email: string;
  expertise: string;
  phone_no: string;
  description:string;
};

type ErrorState = {
  title: string;
  email: string;
  expertise: string;
  phone_no: string;
  description:string;
};
type ImageState = {
  picture: File | null;
};

type FormState = TextInputState;

const AddFounder: React.FC = () => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const inFounderAdded = localStorage.getItem("newFounderAdded");
  const [formErrors, setFormErrors] = useState<ErrorState>({
    title: "",
    email: "",
    expertise: "",
    phone_no: "",
    description:""
  });
  const [imageError, setImageError] = useState({
    picture: "",
  });

  useEffect(() => {
    getHomeDetails();
  }, []);

  const getHomeDetails = async () => {
    try {
      if (inFounderAdded) {
        const response = await axios.get(
          `${API_PATH.GET_FOUNDER_DETAILS}/${inFounderAdded}`
        );
        const founderData = response.data;

        // Set the form data with the fetched details
        setInitFormData(founderData);
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
      formDataToSend.append("title", initFormData.title);
      formDataToSend.append("email", initFormData.email);
      formDataToSend.append("expertise", initFormData.expertise);
      formDataToSend.append("phone_no", initFormData.phone_no);
      formDataToSend.append("description", initFormData.description);


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
      if (inFounderAdded) {
        const response = await axios.put(
          `${API_PATH.UPDATE_FOUNDER_DETAILS}/${inFounderAdded}`,
          formDataToSend,
          {
            headers: getAuthHeaders(),
          }
        );
        if (response.data) {
          toast.success(response.data.message);
          localStorage.removeItem("newFounderAdded");
          navigate("/founder");
        }
      } else {
        const response = await axios.post(
          `${API_PATH.ADD_FOUNDER_DETAILS}`,
          formDataToSend,
          { headers: getAuthHeaders() }
        );
        if (response.data) {
          toast.success(response.data.message);
          navigate("/founder");
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
          HeaderText="Founder Page"
          Breadcrumb={[
            {
              name: `${inFounderAdded ? "Founder Update" : "Founder Add"}`,
              navigate: "#",
            },
          ]}
          to="/founder"
        />
        <div className="flex items-center mt-5">
          <h2 className="mr-auto text-lg font-medium intro-y">
            {inFounderAdded ? "Update Founder" : "Add Founder"}
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
                  Name <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="title"
                  className={clsx({
                    "border-danger": formErrors.title,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "title")
                  }
                  placeholder="Enter Title"
                  value={initFormData.title}
                />
                {formErrors.title && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.title === "string" && formErrors.title}
                  </div>
                )}
              </div>

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Email <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="email"
                  className={clsx({
                    "border-danger": formErrors.email,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "email")
                  }
                  placeholder="Enter descritpion"
                  value={initFormData.email}
                />
                {formErrors.email && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.email === "string" && formErrors.email}
                  </div>
                )}
              </div>

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Expertise <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="expertise"
                  className={clsx({
                    "border-danger": formErrors.expertise,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "expertise")
                  }
                  placeholder="Enter Title"
                  value={initFormData.expertise}
                />
                {formErrors.expertise && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.expertise === "string" &&
                      formErrors.expertise}
                  </div>
                )}
              </div>

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Phone No <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="phone_no"
                  className={clsx({
                    "border-danger": formErrors.phone_no,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "phone_no")
                  }
                  placeholder="Enter description"
                  value={initFormData.phone_no}
                />
                {formErrors.phone_no && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.phone_no === "string" &&
                      formErrors.phone_no}
                  </div>
                )}
              </div>
              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                   Description{" "}
                  <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormTextarea
                  id="input-wizard-1"
                  name="description"
                  className={clsx({
                    "border-danger": formErrors.description,
                  })}
                  onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange(e, "description")
                  }
                  placeholder="Enter Main Content"
                  value={initFormData.description}
                />
                {formErrors.description && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.description === "string" &&
                      formErrors.description}
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
                      {inFounderAdded
                        ? "Update Founder Data"
                        : "Add Founder Data"}
                      <LoadingIcon
                        icon="oval"
                        color="white"
                        className="w-4 h-4 ml-2"
                      />
                    </>
                  ) : (
                    <>
                      {" "}
                      {inFounderAdded
                        ? "Update Founder Data"
                        : "Add Founder Data"}
                    </>
                  )}
                </Button>
                <Button
                  variant="instagram"
                  className="ml-2"
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("newFounderAdded");
                    navigate("/founder");
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

export default AddFounder;
