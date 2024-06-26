import React from "react";
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
import logoUrl from "../../assets/images/vida-logo.png";
import logoDarkUrl from "../../assets/images/vida-logo.png";
import Lucide from "../../base-components/Lucide";
import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import { resetPassword } from "../../stores/auth";
import Toast from "../../components/Toast";
import { toast } from "react-toastify";
import { toastMessage } from "../../stores/toastSlice";

const initialState = {
  password: "",
  confirmPassword: "",
};

type TextInputState = {
  password: string;
  confirmPassword: string;
};

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(selectDarkMode);
  const toastMsg = useAppSelector(toastMessage);

  const [formData, setFormData] = useState<TextInputState>({ ...initialState });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const schema = yup
    .object({
      password: yup.string().required("Password is required"),
      confirmPassword: yup
        .string()
        .required("This field is required.")
        .oneOf([yup.ref("password"), null], "Passwords must match"),
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
    const str: string = window.location.href;
    const regex = /reset-password\?uid=(.*)/;
    const token = str.match(regex)[1];
    const payload = {
      password: formData.password,
      confirm_password: formData.confirmPassword,
      token,
    };
    const result = await trigger();
    try {
      if (result) {
        // Handle form submission here
        setIsLoading(true);
        const response = await dispatch(resetPassword(payload));
        if (response.payload.type === "Success") {
          toast.success(toastMsg || "");
          navigate("/login");
        }
      }
    } catch (error) {
      console.log("Errrr--", error);
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
            Reset Password
          </div>
          <Preview>
            {/* BEGIN: Validation Form */}
            <form className="mt-4" onSubmit={onSubmit}>
              <div className="input-form">
                <FormLabel
                  htmlFor="validation-form-3"
                  className="flex w-full gap-1"
                >
                  Password <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <div className="relative">
                  <FormInput
                    {...register("password")}
                    id="validation-form-3"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={clsx({
                      "border-danger": errors.password,
                    })}
                    onInput={handleInputChange}
                    placeholder="Password..."
                    value={formData.password}
                  />
                  <div
                    className={`absolute inset-y-0 right-2 flex items-center cursor-pointer ${
                      errors.password && "-mt-7"
                    }`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Lucide icon="Eye" className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Lucide icon="EyeOff" className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  {errors.password && (
                    <div className="mt-2 text-danger">
                      {typeof errors.password.message === "string" &&
                        errors.password.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 input-form">
                <FormLabel htmlFor="input-wizard-5 flex w-full gap-1">
                  Confirm Password{" "}
                  <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <div className="relative">
                  <FormInput
                    {...register("confirmPassword")}
                    id="input-wizard-5"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className={clsx({
                      "border-danger": errors.confirmPassword,
                    })}
                    onInput={handleInputChange}
                    disabled={formData.password === ""}
                    placeholder="ReEnter Password"
                    value={formData.password ? formData.confirmPassword : ""}
                  />
                  <div
                    className={`absolute inset-y-0 right-2 flex items-center cursor-pointer ${
                      errors.confirmPassword && "-mt-7"
                    }`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <Lucide icon="Eye" className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Lucide icon="EyeOff" className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <div className="mt-2 text-danger">
                      {typeof errors.confirmPassword.message === "string" &&
                        errors.confirmPassword.message}
                    </div>
                  )}
                </div>
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
                      Change Password
                      <LoadingIcon
                        icon="oval"
                        color="white"
                        className="w-4 h-4 ml-2"
                      />
                    </>
                  ) : (
                    "Change Password"
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

export default ResetPassword;
