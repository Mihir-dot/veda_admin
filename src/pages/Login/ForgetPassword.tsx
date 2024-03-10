import React from "react";
import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import Button from "../../base-components/Button";
import { FormInput, FormLabel } from "../../base-components/Form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { selectDarkMode } from "../../stores/darkModeSlice";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import { Preview } from "../../base-components/PreviewComponent";
import LoadingIcon from "../../base-components/LoadingIcon";
import logoUrl from "../../assets/images/driver007-dark.png";
import logoDarkUrl from "../../assets/images/driver007-dark.png";
import { forgetPassword } from "../../stores/auth";
import Toast from "../../components/Toast";
import { toast } from "react-toastify";
import { toastMessage } from "../../stores/toastSlice";

const ForgetPassword: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(selectDarkMode);
  const toastMsg = useAppSelector(toastMessage);

  const [formData, setFormData] = useState({
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup
    .object({
      email: yup
        .string()
        .required("Email is required")
        .email("Email must be a valid email"),
    })
    .required();

  const {
    register,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();
    try {
      if (result && isValid) {
        // Handle form submission here
        setIsLoading(true);
        const response = await dispatch(forgetPassword(formData));
        if (response.payload === undefined) {
          return toast.error(toastMsg || "User not found");
        }
        if (response.payload.type === "Success") {
          toast.success(
            toastMsg ||
              "The email has been sent to the registered email address to generate a new password"
          );
          navigate("/login");
        }
      }
    } catch (error) {
      console.log("Error------", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <DarkModeSwitcher />
      <MainColorSwitcher />
      <div className="flex items-center justify-center w-full min-h-screen p-5 md:p-20">
        <div className="w-96 intro-y box px-5 py-5 max-w-[450px] relative before:content-[''] before:z-[-1] before:w-[95%] before:h-full before:-mt-5 before:absolute before:rounded-lg before:mx-auto before:inset-x-0">
          <img
            className="w-40 mx-auto"
            alt="Driver 007"
            src={darkMode ? logoUrl : logoDarkUrl}
          />
          <div className="text-lg sm:text-2xl font-medium text-center dark:text-slate-300 mt-5">
            Forget Password
          </div>
          <Preview>
            {/* BEGIN: Validation Form */}
            <form className="mt-4" onSubmit={onSubmit}>
              <div className="input-form">
                <FormLabel
                  htmlFor="validation-form-2"
                  className="flex w-full gap-1"
                >
                  Email<span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  {...register("email")}
                  id="validation-form-2"
                  type="email"
                  name="email"
                  className={clsx({
                    "border-danger": errors.email,
                  })}
                  onInput={handleInputChange}
                  placeholder="example@gmail.com"
                  value={formData.email}
                />
                {errors.email && (
                  <div className="mt-2 text-danger">
                    {typeof errors.email.message === "string" &&
                      errors.email.message}
                  </div>
                )}
              </div>

              <div className="mt-5 text-center xl:mt-8 xl:text-left">
                <Button
                  variant="primary"
                  type="submit"
                  className="w-full xl:mr-3"
                  disabled={!isValid || isLoading}
                >
                  {isLoading ? (
                    <>
                      Submit
                      <LoadingIcon
                        icon="oval"
                        color="white"
                        className="w-4 h-4 ml-2"
                      />
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>

                <Button
                  variant="outline-secondary"
                  onClick={() => navigate("/login")}
                  type="button"
                  className="w-full mt-3"
                >
                  Back
                </Button>
              </div>
            </form>
            {/* END: Validation Form */}
          </Preview>
          {/* <Toast /> */}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
