import React, { useState, ChangeEvent, useEffect } from "react";
import { FormInput, FormLabel, FormTextarea } from "../../base-components/Form";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useAppDispatch } from "../../stores/hooks";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingIcon from "../../base-components/LoadingIcon";
import { validateService } from "../../utils/validations";
import { getAuthHeaders } from "../../utils/helper";
import { API_PATH } from "../../api-services/apiPath";


const initialState = {
  _id: "",
  name: "",
  sortName: "",
  titleOne: "",
  containtOne: "",
  titleTwo: "",
  containtTwo: "",
  banner: null,
  image: null,
};

type TextInputState = {
  _id: string;
  name: string;
  sortName: string;
  titleOne: string;
  containtOne: string;
  titleTwo: string;
  containtTwo: string;
  banner: File | null;
  image: File | null;
};

type ErrorState = {
  name: string;
  sortName: string;
  titleOne: string;
  containtOne: string;
  titleTwo: string;
  containtTwo: string;
};
type ImageState = {
  image: File | null;
  banner: File | null;
};

type FormState = TextInputState;

const AddSevice: React.FC = () => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
  });
  console.log("initFormData------", initFormData);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const isServiceAdded = localStorage.getItem("newServiceAdded");

  const [formErrors, setFormErrors] = useState<ErrorState>({
    name: "",
    sortName: "",
    titleOne: "",
    containtOne: "",
    titleTwo: "",
    containtTwo: "",
  });
  const [imageError, setImageError] = useState({
    image: "",
    banner: "",
  });

  const getServiceDetails = async () => {
    try {
      if (isServiceAdded) {
        const response = await axios.get(
          `${API_PATH.GET_SERVICE}/${isServiceAdded}`
        );
        const serviceData = response.data;

        // Set the form data with the fetched details
        setInitFormData(serviceData);
      }
    } catch (error) {
      console.log("error----", error);
    }
  };
  useEffect(() => {
    getServiceDetails();
  }, []);

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
    fieldName: "image" | "banner"
  ) => {
    const file = event.target.files?.[0];
    const checkFile = (
      allowedImageExtensions: string[],
      allowedBannerExtensions: string[],
      fileType: string,
      requiredWidth: number,
      requiredHeight: number
    ) => {
      const fileExtension = (file?.name.split(".").pop() || "").toLowerCase();
      let allowedExtensions: string[];

      if (fileType === "image") {
        allowedExtensions = allowedImageExtensions;
      } else if (fileType === "banner") {
        allowedExtensions = allowedBannerExtensions;
      } else {
        allowedExtensions = []; // Handle other file types here if needed
      }

      if (file && allowedExtensions.includes(fileExtension)) {
        const image = new Image();
        image.src = URL.createObjectURL(file);

        image.onload = () => {
          const width = image.width;
          const height = image.height;

          if (width === requiredWidth && height === requiredHeight) {
            // Valid dimensions
            setInitFormData((prevState) => ({
              ...prevState,
              [fieldName]: file,
            }));
            setImageError((prev) => ({
              ...prev,
              [fieldName]: "",
            }));
          } else {
            // Invalid dimensions
            setImageError((prev) => ({
              ...prev,
              [fieldName]: `Please select a ${fileType} with dimensions ${requiredWidth}x${requiredHeight} pixels.`,
            }));
            setInitFormData((prev) => ({
              ...prev,
              [fieldName]: null,
            }));
          }
        };
      } else {
        setImageError((prev) => ({
          ...prev,
          [fieldName]: `Please select a ${fileType} file with ${allowedExtensions.join(", ")} extension`,
        }));
        setInitFormData((prev) => ({
          ...prev,
          [fieldName]: null,
        }));
      }
    };

    if (fieldName === "image") {
      checkFile(["jpg", "jpeg", "png"], [], "image", 850, 470);
    } else if (fieldName === "banner") {
      checkFile([], ["jpg", "jpeg", "png"], "banner", 1920, 400);
    } else {
      // Handle other file types if needed
      checkFile([], [], "other", 0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const formDataToSend = new FormData();
      // formDataToSend.append("id", initFormData._id);
      formDataToSend.append("name", initFormData.name);
      formDataToSend.append("sortName", initFormData.sortName);
      formDataToSend.append("titleOne", initFormData.titleOne);
      formDataToSend.append("containtOne", initFormData.containtOne);
      formDataToSend.append("titleTwo", initFormData.titleTwo);
      formDataToSend.append("containtTwo", initFormData.containtTwo);
      if (initFormData.image) {
        formDataToSend.append("image", initFormData.image);
      }
      // formDataToSend.append("image", initFormData.image as File);
      if (initFormData.banner) {
        formDataToSend.append("banner", initFormData.banner);
      }

      const imageErrors = {
        image: "",
        banner: "",
      };
      if (!initFormData.image) {
        imageErrors.image = "Please attach an image file";
      }
      if (!initFormData.banner) {
        imageErrors.banner = "Please attach a banner file";
      }
      setIsLoading(true);
      if (isServiceAdded) {
        const response = await axios.put(
          `${API_PATH.UPDATE_SERVICE}/${isServiceAdded}`,
          formDataToSend,
          {
            headers: getAuthHeaders(),
          }
        );
        console.log("res---------", response);
        if (response.data) {
          toast.success(response.data.message);
          localStorage.removeItem("newServiceAdded");
          navigate("/service");
        }
      } else {
        const response = await axios.post(
          `${API_PATH.ADD_SERVICE}`,
          formDataToSend,
          { headers: getAuthHeaders() }
        );
        if (response.data) {
          toast.success(response.data.message);
          navigate("/service");
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
          HeaderText="Service"
          Breadcrumb={[
            {
              name: `${isServiceAdded ? "Service Update" : "Service Add"}`,
              navigate: "#",
            },
          ]}
          to="/service"
        />
        <div className="flex items-center mt-5">
          <h2 className="mr-auto text-lg font-medium intro-y">
            {isServiceAdded ? "Update Service" : "Add Service"}
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
                  name="name"
                  className={clsx({
                    "border-danger": formErrors.name,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "name")
                  }
                  placeholder="Enter Name"
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
                  Short Name <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="sortName"
                  className={clsx({
                    "border-danger": formErrors.sortName,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "sortName")
                  }
                  placeholder="Enter Short Name"
                  value={initFormData.sortName}
                />
                {formErrors.sortName && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.sortName === "string" &&
                      formErrors.sortName}
                  </div>
                )}
              </div>

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Main Title <span className="text-red-600 font-bold">*</span>
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
                  placeholder="Enter Main Title"
                  value={initFormData.titleOne}
                />
                {formErrors.titleOne && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.titleOne === "string" &&
                      formErrors.titleOne}
                  </div>
                )}
              </div>

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Main Description{" "}
                  <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormTextarea
                  id="input-wizard-1"
                  name="containtOne"
                  className={clsx({
                    "border-danger": formErrors.containtOne,
                  })}
                  onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange(e, "containtOne")
                  }
                  placeholder="Enter Main Content"
                  value={initFormData.containtOne}
                />
                {formErrors.containtOne && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.containtOne === "string" &&
                      formErrors.containtOne}
                  </div>
                )}
              </div>
              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Sub Title <span className="text-red-600 font-bold">*</span>
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
                  placeholder="Enter Sub Title"
                  value={initFormData.titleTwo}
                />
                {formErrors.titleTwo && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.titleTwo === "string" &&
                      formErrors.titleTwo}
                  </div>
                )}
              </div>

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Sub Description{" "}
                  <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormTextarea
                  id="input-wizard-1"
                  name="containtTwo"
                  className={clsx({
                    "border-danger": formErrors.containtTwo,
                  })}
                  onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange(e, "containtTwo")
                  }
                  placeholder="Enter Sub Content"
                  value={initFormData.containtTwo}
                />
                {formErrors.containtTwo && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.containtTwo === "string" &&
                      formErrors.containtTwo}
                  </div>
                )}
              </div>
              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Banner Image<span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="file"
                  name="banner"
                  onChange={(e) => handleFileChange(e, "banner")}
                  className="border border-gray-200 p-1 bg-white"
                />
                {imageError.banner && (
                  <div className="mt-2 text-danger">
                    {typeof imageError.banner === "string" && imageError.banner}
                  </div>
                )}
              </div>
              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Image<span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="file"
                  name="image"
                  onChange={(e) => handleFileChange(e, "image")}
                  className="border border-gray-200 p-1 bg-white"
                />
                {imageError.image && (
                  <div className="mt-2 text-danger">
                    {typeof imageError.image === "string" && imageError.image}
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
                      {isServiceAdded ? "Update Service" : "Add Service"}
                      <LoadingIcon
                        icon="oval"
                        color="white"
                        className="w-4 h-4 ml-2"
                      />
                    </>
                  ) : (
                    <> {isServiceAdded ? "Update Service" : "Add Service"}</>
                  )}
                </Button>
                <Button
                  variant="instagram"
                  className="ml-2"
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("newServiceAdded");
                    navigate("/service");
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

export default AddSevice;
