import React, { useState, ChangeEvent, useEffect } from "react";
import { FormInput, FormLabel } from "../../base-components/Form";
import { Autocomplete, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { selectDarkMode } from "../../stores/darkModeSlice";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../stores/dashboard";
import {
  fetchCompanyDropdown,
  getCompanyDropdownData,
} from "../../stores/commonList";
import Lucide from "../../base-components/Lucide";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";
// import { updateUserProfile } from "../../stores/user";

const initialState = {
  name: "",
  email: "",
  password: "",
  companySelect: "",
};

interface ListOptions {
  name: string;
  id: number;
}

type TextInputState = {
  name: string;
  email: string;
  password: string;
};

type SelectState = {
  companySelect: string;
};

type FormState = TextInputState & SelectState;

type ErrorState = {
  name: string;
};

const ProfileForm: React.FC = () => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
  });
  const userState: any = useAppSelector(getUserData);
  const [isFormValid, setIsFormValid] = useState(false);
  const companyDropdownOptions: any = useAppSelector(getCompanyDropdownData);
  const [formErrors, setFormErrors] = useState<ErrorState>({
    name: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsFormValid(Object.keys(formErrors).length === 0);
  }, [formErrors]);

  useEffect(() => {
    if (userState.user === null) {
      dispatch(fetchCompanyDropdown());
    }
  }, []);

  useEffect(() => {
    if (userState.user !== null) {
      setInitFormData((prev) => ({
        ...prev,
        name: userState.user.name || "",
        email: userState.user.email || "",
        companySelect: userState.user.company_id || "",
      }));
    }
  }, [userState.user]);

  const { control } = useForm({
    mode: "onChange",
    defaultValues: initFormData,
  });

  const darkMode = useAppSelector(selectDarkMode);
  const navigate = useNavigate();

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof TextInputState
  ) => {
    const { value } = event.target;
    const errors: { name: string } = { name: "" };
    if (fieldName === "name") {
      if (value === "") {
        errors.name = "Name is required";
        setFormErrors(errors);
      } else {
        delete errors.name;
        setFormErrors(errors);
      }
    }
    setInitFormData((prevState) => ({
      ...prevState,
      [fieldName]: value.trim(),
    }));
  };

  const submitUserInfo = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: { name: string } = { name: "" };
    // if (initFormData.name === "") {
    //   errors.name = "Name is required";
    //   setFormErrors(errors);
    // }
    // if (errors.name) return;
    // try {
    //   setIsLoading(true);
    //   const payload = {
    //     name: initFormData.name,
    //     password: initFormData.password ? initFormData.password : "",
    //   };
    //   if (initFormData.password === "") {
    //     delete payload.password;
    //   }
    //   const res = await dispatch(updateUserProfile(payload));
    //   if (res.payload === undefined)
    //     return toast.error("Something went wrong.");
    //   localStorage.setItem("username", JSON.stringify(payload.name));
    //   toast.success(res.payload.message || "User updated succesfully");
    //   navigate("/");
    // } catch (error) {
    //   console.log("Err--", error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <form
      className="grid grid-cols-12 gap-4 mt-5 gap-y-5"
      onSubmit={submitUserInfo}
    >
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-1">
          Profile Name <span className="text-red-600 font-bold">*</span>
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
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-2">Password</FormLabel>
        <FormInput
          id="input-wizard-2"
          type={showPassword ? "text" : "password"}
          name="password"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "password")
          }
          placeholder="Enter Password"
          value={initFormData.password}
        />
        <div
          className={`absolute inset-y-0 right-2 flex items-center cursor-pointer mt-7`}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <Lucide icon="Eye" className="h-5 w-5 text-gray-500" />
          ) : (
            <Lucide icon="EyeOff" className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-3">Email Address</FormLabel>
        <FormInput
          id="input-wizard-3"
          type="email"
          name="email"
          disabled
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "email")
          }
          placeholder="Enter Email Address"
          value={initFormData.email}
        />
      </div>

      <div className="flex items-center col-span-12 mt-5 gap-5 intro-y">
        <Button
          variant="primary"
          type="submit"
          disabled={formErrors.name || isLoading ? true : false}
        >
          {isLoading ? (
            <>
              Loading...
              <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />
            </>
          ) : (
            "Update User"
          )}
        </Button>
        <Button
          variant="secondary"
          className="px-7"
          type="button"
          onClick={() => navigate("/")}
        >
          Exit
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
