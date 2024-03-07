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
import { validateReview } from "../../utils/validations";
import { getAuthHeaders } from "../../utils/helper";
import { API_PATH } from "../../api-services/apiPath";


const initialState = {
  _id: "",
  name: "",
  post: "",
  rating: "",
  text: "",
  picture: null,
};

type TextInputState = {
  _id: string;
  name: string;
  post: string;
  rating: string;
  text: string;
  picture: File | null;
};

type ErrorState = {
  name: string;
  post: string;
  rating: string;
  text: string;
};
type ImageState = {
  picture: File | null;
};

type FormState = TextInputState;

const AddReview: React.FC = () => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const isRevireAdded = localStorage.getItem("reviewId");

  const [formErrors, setFormErrors] = useState<ErrorState>({
    name: "",
    post: "",
    rating: "",
    text: ""
  });
  const [imageError, setImageError] = useState({
    picture: "",
  });

  const getServiceDetails = async () => {
    try {
      if (isRevireAdded) {
        const response = await axios.get(
          `${API_PATH.GET_REVIEW_DETAILS}/${isRevireAdded}`,{
            headers:getAuthHeaders()
          }
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

      let errors = validateReview(formData);
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

    const checkFile = (allowedExtensions: string[], fileType: string) => {
        const fileExtension = (file?.name.split(".").pop() || "").toLowerCase();
        if (file && allowedExtensions.includes(fileExtension)) {
            setInitFormData((prevState) => ({
                ...prevState,
                [fieldName]: file,
            }));
            setImageError((prev) => ({
                ...prev,
                [fieldName]: "",
            }));
        } else {
            setImageError((prev) => ({
                ...prev,
                [fieldName]: `Please select a ${fileType} file with ${allowedExtensions.join(', ')} extension`,
            }));
            setInitFormData((prev) => ({
                ...prev,
                [fieldName]: null,
            }));
        }
    };

    if (fieldName === "picture") {
        checkFile(["jpg", "jpeg", "png"], "picture");
    } 
};

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const formDataToSend = new FormData();
      formDataToSend.append("name", initFormData.name);
      formDataToSend.append("post", initFormData.post);
      formDataToSend.append("rating", initFormData.rating);
      formDataToSend.append("text", initFormData.text);
      if (initFormData.picture) {
        formDataToSend.append("picture", initFormData.picture);
      }

      const imageErrors = {
        picture: "",
      };
      if (!initFormData.picture) {
        imageErrors.picture = "Please attach a picture file";
      }
      setIsLoading(true);
      if (isRevireAdded) {
        const response = await axios.put(
          `${API_PATH.UPDATE_REVIEW}/${isRevireAdded}`,
          formDataToSend,
          {
            headers: getAuthHeaders(),
          }
        );
        console.log("res---------", response);
        if (response.data) {
          toast.success(response.data.message);
          localStorage.removeItem("newReviewAdded");
          navigate("/review");
        }
      } else {
        const response = await axios.post(
          `${API_PATH.ADD_REVIEW}`,
          formDataToSend,
          { headers: getAuthHeaders() }
        );
        if (response.data) {
          toast.success(response.data.message);
          navigate("/review");
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
          HeaderText="Review"
          Breadcrumb={[
            {
              name: `${isRevireAdded ? "Review Update" : "Review Add"}`,
              navigate: "#",
            },
          ]}
          to="/Review"
        />
        <div className="flex items-center mt-5">
          <h2 className="mr-auto text-lg font-medium intro-y">
            {isRevireAdded ? "Update Review" : "Add Review"}
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
                  Designation / Post <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="post"
                  className={clsx({
                    "border-danger": formErrors.post,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "post")
                  }
                  placeholder="Enter Short Name"
                  value={initFormData.post}
                />
                {formErrors.post && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.post === "string" &&
                      formErrors.post}
                  </div>
                )}
              </div>

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Rating <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="number"
                  name="rating"
                  className={clsx({
                    "border-danger": formErrors.rating,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "rating")
                  }
                  placeholder="Enter Main Title"
                  value={initFormData.rating}
                />
                {formErrors.rating && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.rating === "string" &&
                      formErrors.rating}
                  </div>
                )}
              </div>
              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Review Text{" "}
                  <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormTextarea
                  id="input-wizard-1"
                  name="text"
                  className={clsx({
                    "border-danger": formErrors.text,
                  })}
                  onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange(e, "text")
                  }
                  placeholder="Enter Main Content"
                  value={initFormData.text}
                />
                {formErrors.text && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.text === "string" &&
                      formErrors.text}
                  </div>
                )}
              </div>
              <div className="col-span-12 intro-y sm:col-span-12">
                <FormLabel htmlFor="input-wizard-1">
                  Picture<span className="text-red-600 font-bold">*</span>
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
                    {typeof imageError.picture === "string" && imageError.picture}
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
                      {isRevireAdded ? "Update Review" : "Add Review"}
                      <LoadingIcon
                        icon="oval"
                        color="white"
                        className="w-4 h-4 ml-2"
                      />
                    </>
                  ) : (
                    <> {isRevireAdded ? "Update Review" : "Add Review"}</>
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

export default AddReview;
