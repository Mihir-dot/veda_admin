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
import { validateFAQ, validateService } from "../../utils/validations";
import { getAuthHeaders } from "../../utils/helper";
import { API_PATH } from "../../api-services/apiPath";

const initialState = {
  _id: "",
  question: "",
  answer: "",
};

type TextInputState = {
  _id: string;
  question: string;
  answer: string;
};

type ErrorState = {
  question: string;
  answer: string;
};
type FormState = TextInputState;

const AddFaqs: React.FC = () => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
  });
  console.log("initFormdata------", initFormData);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const isFaqAdded = localStorage.getItem("newFaqAdded");
  const [formErrors, setFormErrors] = useState<ErrorState>({
    question: "",
    answer: "",
  });
  useEffect(() => {
    getHomeDetails();
  }, []);

  const getHomeDetails = async () => {
    try {
      if (isFaqAdded) {
        const response = await axios.get(
          `${API_PATH.GET_FAQ_DETAILS}/${isFaqAdded}`
        );
        const faqData = response.data;

        // Set the form data with the fetched details
        setInitFormData(faqData);
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

      let errors = validateFAQ(formData);
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

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const payload = {
        question: initFormData.question || "",
        answer: initFormData.answer || "",
      };
      setIsLoading(true);
      if (isFaqAdded) {
        const response = await axios.put(
          `${API_PATH.UPDATE_FAQ_DETAILS}/${isFaqAdded}`,
          payload,
          {
            headers: getAuthHeaders(),
          }
        );
        if (response.data) {
          toast.success(response.data.message);
          localStorage.removeItem("newFaqAdded");
          navigate("/faq");
        }
      } else {
        const response = await axios.post(
          `${API_PATH.ADD_FAQ_DETAILS}`,
          payload,
          { headers: getAuthHeaders() }
        );
        if (response.data) {
          toast.success(response.data.message);
          navigate("/faq");
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
          HeaderText="FAQ Page"
          Breadcrumb={[
            {
              name: `${isFaqAdded ? "FAQ Update" : "FAQ Add"}`,
              navigate: "#",
            },
          ]}
          to="/faq"
        />
        <div className="flex items-center mt-5">
          <h2 className="mr-auto text-lg font-medium intro-y">
            {isFaqAdded ? "Update FAQ" : "Add FAQ"}
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
              <div className="col-span-12 intro-y sm:col-span-12">
                <FormLabel htmlFor="input-wizard-1">
                  Question <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="question"
                  className={clsx({
                    "border-danger": formErrors.question,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "question")
                  }
                  placeholder="Enter Question"
                  value={initFormData.question}
                />
                {formErrors.question && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.question === "string" &&
                      formErrors.question}
                  </div>
                )}
              </div>

              <div className="col-span-12 intro-y sm:col-span-12">
                <FormLabel htmlFor="input-wizard-1">
                  Answer <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="answer"
                  className={clsx({
                    "border-danger": formErrors.answer,
                  })}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "answer")
                  }
                  placeholder="Enter Answer"
                  value={initFormData.answer}
                />
                {formErrors.answer && (
                  <div className="mt-2 text-danger">
                    {typeof formErrors.answer === "string" && formErrors.answer}
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
                      {isFaqAdded ? "Update FAQ Data" : "Add FAQ Data"}
                      <LoadingIcon
                        icon="oval"
                        color="white"
                        className="w-4 h-4 ml-2"
                      />
                    </>
                  ) : (
                    <> {isFaqAdded ? "Update FAQ Data" : "Add FAQ Data"}</>
                  )}
                </Button>
                <Button
                  variant="instagram"
                  className="ml-2"
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("newFaqAdded");
                    navigate("/faq");
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

export default AddFaqs;
