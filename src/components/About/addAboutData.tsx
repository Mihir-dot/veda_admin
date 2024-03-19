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
import { validateAboutPage, validateService } from "../../utils/validations";
import { getAuthHeaders } from "../../utils/helper";
import { API_PATH } from "../../api-services/apiPath";


const initialState = {
  _id: "",
  name: "",
  titleOne: "",
  titleTwo: "",
  containtOne: "",
  visionTitleOne:"",
  visionTitleTwo:"",
  visionDesscriptionOne: "",
  visionDesscriptionTwo: "",
  banner: null,
  visionBanner: null,
};

type TextInputState = {
  _id: string;
  name: string;
  titleOne: string;
  titleTwo: string;
  containtOne: string;
  visionTitleOne:string;
  visionTitleTwo:string;
  visionDesscriptionOne: string;
  visionDesscriptionTwo: string;
  banner: File | null;
  visionBanner: File | null;
};

type ErrorState = {
    name: string;
    titleOne: string;
    titleTwo: string;
    containtOne: string;
    visionTitleOne:string;
    visionTitleTwo:string;
    visionDesscriptionOne: string;
    visionDesscriptionTwo: string;
};
type ImageState = {
    banner: File | null;
    visionBanner: File | null;
};

type FormState = TextInputState;

const AddAboutData: React.FC = () => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const isAboutUsAdded = localStorage.getItem("newAboutAdded");

  const [formErrors, setFormErrors] = useState<ErrorState>({
    name: "",
    titleOne: "",
    titleTwo: "",
    containtOne: "",
    visionTitleOne:"",
    visionTitleTwo:"",
    visionDesscriptionOne: "",
    visionDesscriptionTwo: "",
  });
  const [imageError, setImageError] = useState({
   banner:"",
   visionBanner:""
  });

  const getServiceDetails = async () => {
    try {
      if (isAboutUsAdded) {
        const response = await axios.get(
          `${API_PATH.GET_ABOUT_DETAILS}/${isAboutUsAdded}`
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

      let errors = validateAboutPage(formData);
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
    fieldName: "visionBanner" | "banner"
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

      if (fileType === "visionBanner") {
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

    if (fieldName === "visionBanner") {
      checkFile(["jpg", "jpeg", "png"], [], "visionBanner",  1920, 400);
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
      formDataToSend.append("titleOne", initFormData.titleOne);
      formDataToSend.append("titleTwo", initFormData.titleTwo);
      formDataToSend.append("containtOne", initFormData.containtOne);
      formDataToSend.append("visionTitleOne", initFormData.visionTitleOne);
      formDataToSend.append("visionTitleTwo", initFormData.visionTitleTwo);
      formDataToSend.append("visionDesscriptionOne", initFormData.visionDesscriptionOne);
      formDataToSend.append("visionDesscriptionTwo", initFormData.visionDesscriptionTwo);

      if (initFormData.visionBanner) {
        formDataToSend.append("visionBanner", initFormData.visionBanner);
      }
      if (initFormData.banner) {
        formDataToSend.append("banner", initFormData.banner);
      }

      const imageErrors = {
        visionBanner: "",
        banner: "",
      };
      if (!initFormData.visionBanner) {
        imageErrors.visionBanner = "Please attach an image file";
      }
      if (!initFormData.banner) {
        imageErrors.banner = "Please attach a banner file";
      }
      setIsLoading(true);
      if (isAboutUsAdded) {
        const response = await axios.put(
          `${API_PATH.UPDATE_ABOUT_DETAILS}/${isAboutUsAdded}`,
          formDataToSend,
          {
            headers: getAuthHeaders(),
          }
        );
        if (response.data) {
          toast.success(response.data.message);
          localStorage.removeItem("newAboutAdded");
          navigate("/about");
        }
      } else {
        const response = await axios.post(
          `${API_PATH.ADD_ABOUT_DETAILS}`,
          formDataToSend,
          { headers: getAuthHeaders() }
        );
        if (response.data) {
          toast.success(response.data.message);
          navigate("/about");
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
          HeaderText="About Page"
          Breadcrumb={[
            {
              name: `${isAboutUsAdded ? "About Page Update" : "About Page Add"}`,
              navigate: "#",
            },
          ]}
          to="/about"
        />
        <div className="flex items-center mt-5">
          <h2 className="mr-auto text-lg font-medium intro-y">
            {isAboutUsAdded ? "Update About Page" : "Add About Page"}
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
                  Description{" "}
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
            
              <div className="col-span-12 intro-y sm:col-span-12">
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

{/* Vision page*/}
<div className="col-span-12 intro-y sm:col-span-12 text-center bg-green-400 p-2 mt-9">
                <p className="font-semibold text-base">
                Our Vision Page Details</p>
                  </div>
              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                Vision Title One <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="visionTitleOne"
                  className={clsx({
                    "border-danger": formErrors.visionTitleOne,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "visionTitleOne")
                  }
                  placeholder="Enter Main Title"
                  value={initFormData.visionTitleOne}
                />
                {formErrors.visionTitleOne && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.visionTitleOne === "string" &&
                      formErrors.visionTitleOne}
                  </div>
                )}
              </div>

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                 Vision Title Two <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="visionTitleTwo"
                  className={clsx({
                    "border-danger": formErrors.visionTitleTwo,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "visionTitleTwo")
                  }
                  placeholder="Enter Sub Title"
                  value={initFormData.visionTitleTwo}
                />
                {formErrors.visionTitleTwo && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.visionTitleTwo === "string" &&
                      formErrors.visionTitleTwo}
                  </div>
                )}
              </div>

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                 Vision Content One{" "}
                  <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormTextarea
                  id="input-wizard-1"
                  name="visionDesscriptionOne"
                  className={clsx({
                    "border-danger": formErrors.visionDesscriptionOne,
                  })}
                  onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange(e, "visionDesscriptionOne")
                  }
                  placeholder="Enter Main Content"
                  value={initFormData.visionDesscriptionOne}
                />
                {formErrors.visionDesscriptionOne && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.visionDesscriptionOne === "string" &&
                      formErrors.visionDesscriptionOne}
                  </div>
                )}
              </div>
            
              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                 Vision Content Two{" "}
                  <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormTextarea
                  id="input-wizard-1"
                  name="visionDesscriptionTwo"
                  className={clsx({
                    "border-danger": formErrors.visionDesscriptionTwo,
                  })}
                  onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange(e, "visionDesscriptionTwo")
                  }
                  placeholder="Enter Main Content"
                  value={initFormData.visionDesscriptionTwo}
                />
                {formErrors.visionDesscriptionTwo && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.visionDesscriptionTwo === "string" &&
                      formErrors.visionDesscriptionTwo}
                  </div>
                )}
              </div>
            
              <div className="col-span-12 intro-y sm:col-span-12">
                <FormLabel htmlFor="input-wizard-1">
                  Vision Banner<span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="file"
                  name="visionBanner"
                  onChange={(e) => handleFileChange(e, "visionBanner")}
                  className="border border-gray-200 p-1 bg-white"
                />
                {imageError.visionBanner && (
                  <div className="mt-2 text-danger">
                    {typeof imageError.visionBanner === "string" && imageError.visionBanner}
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
                      {isAboutUsAdded ? "Update About Data" : "Add About Data"}
                      <LoadingIcon
                        icon="oval"
                        color="white"
                        className="w-4 h-4 ml-2"
                      />
                    </>
                  ) : (
                    <> {isAboutUsAdded ? "Update About Data" : "Add About Data"}</>
                  )}
                </Button>
                <Button
                  variant="instagram"
                  className="ml-2"
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("newAboutAdded");
                    navigate("/about");
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

export default AddAboutData;
