import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import Button from "../../base-components/Button";
import { FormInput, FormLabel } from "../../base-components/Form";
import { setAuthentication } from "../../stores/auth";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios"
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import { Preview } from "../../base-components/PreviewComponent";
import LoadingIcon from "../../base-components/LoadingIcon";
import logoUrl from "../../assets/images/driver007-dark.png";
import logoDarkUrl from "../../assets/images/driver007.png";
import { selectDarkMode } from "../../stores/darkModeSlice";
import Lucide from "../../base-components/Lucide";
import DarkModeToggle from "../../components/DarkModeToggle";
import { toast } from "react-toastify";
import { toastMessage } from "../../stores/toastSlice";

function Main() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(selectDarkMode);
  const toastMsg = useAppSelector(toastMessage);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const schema = yup
    .object({
      email: yup
        .string()
        .required("Email is required")
        .email("Email must be a valid email"),
      password: yup.string().required("Password is required"),
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
      if (result) {
        // Start loading
        setIsLoading(true);
        // Login API calling
        const response = await axios.post('http://localhost:5000/api/login', {
          email: formData.email,
          password: formData.password
        });
        if(response.data.token){
            navigate("/");
            localStorage.setItem("token", response.data.token);
          toast.success("Login Sucessfully.")
        }else{
          toast.error("Something wenr wrong")
        }
        // Handle the response
        console.log(response); // Assuming the response contains data
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
 
 
  const onSubmit1 = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();
    try {
      if (result) {
        // start loading
        setIsLoading(true);
        // Login api calling
        const dataRes: any = await dispatch(setAuthentication(formData));
        if (dataRes.payload === undefined) {
          return toast.error(toastMsg || "Incorrect email or password");
        } else {
          if (dataRes.payload.status === 200) {
            toast.success(toastMsg || "User loggedin successful");
            navigate("/");
          }
        }
      }
    } catch (error) {
      console.log("Er--", error);
    } finally {
      setIsLoading(false);
    }
  };
 
 
  return (
    <>
      <div className="container">
        <DarkModeSwitcher />
        <MainColorSwitcher />
        {/* <DarkModeToggle /> */}
        <div className="flex items-center justify-center w-full min-h-screen p-5 md:p-20">
          <div className="w-96 intro-y box px-5 py-5 max-w-[450px] relative before:content-[''] before:z-[-1] before:w-[95%] before:h-full before:-mt-5 before:absolute before:rounded-lg before:mx-auto before:inset-x-0">
            <img
              className="w-40 mx-auto"
              alt="vida Admin"
              // src={darkMode ? logoUrl : logoDarkUrl}
            />
            <div className="text-lg sm:text-2xl font-medium text-center dark:text-slate-300 mt-5">
              Login to Your Account!
            </div>
            <Preview>
              {/* BEGIN: Validation Form */}
              <form className="mt-4 sm:mt-8" onSubmit={onSubmit}>
                <div className="input-form">
                  <FormLabel
                    htmlFor="validation-form-2"
                    className="flex flex-col w-full sm:flex-row"
                  >
                    Email
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
                <div className="mt-5 input-form">
                  <FormLabel
                    htmlFor="validation-form-3"
                    className="flex flex-col w-full sm:flex-row"
                  >
                    Password
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
                        <Lucide
                          icon="EyeOff"
                          className="h-5 w-5 text-gray-500"
                        />
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
                <div className="flex mt-4 text-xs justify-end text-slate-500 sm:text-sm">
                  <Link to={`/forget-password`}>Forgot Password?</Link>
                </div>
                <div className="mt-5 text-center xl:text-left">
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-full xl:mr-3"
                    disabled={!isValid || isLoading}
                  >
                    {isLoading ? (
                      <>
                        Login
                        <LoadingIcon
                          icon="oval"
                          color="white"
                          className="w-4 h-4 ml-2"
                        />
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
              </form>
              {/* END: Validation Form */}
            </Preview>
            {/* <Toast /> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
