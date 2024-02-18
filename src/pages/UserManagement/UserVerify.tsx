import React, { useEffect, useState } from "react";
import Button from "../../base-components/Button";
import { verifyUser } from "../../stores/user";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { toastMessage } from "../../stores/toastSlice";
import { useNavigate } from "react-router-dom";
import Lucide from "../../base-components/Lucide";

const UserVerify: React.FC = () => {
  const dispatch = useAppDispatch();
  const toastMsg = useAppSelector(toastMessage);
  const navigate = useNavigate();
  const [responseType, setResponseType] = useState<"Success" | "Error">(
    "Success"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const verifyUserByToken = async () => {
      const str: string = window.location.href;
      const regex = /user-verify\?uid=(.*)/;
      const token = str.match(regex)[1];
      const payload = {
        token,
      };
      try {
        setIsLoading(true);
        const res = await dispatch(verifyUser(payload));
        setResponseType(res.payload.type);
      } catch (error) {
        console.log("Error--", error);
      } finally {
        setIsLoading(false);
      }
    };
    verifyUserByToken();
  }, []);

  return (
    <div className="container">
      <div className="flex items-center justify-center w-full min-h-screen p-5 md:p-20">
        {isLoading ? (
          <div role="status" className="flex justify-center mt-10">
            <svg
              aria-hidden="true"
              className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <div className="w-96 intro-y box px-5 py-5 max-w-[450px] relative before:content-[''] before:z-[-1] before:w-[95%] before:h-full before:-mt-5 before:absolute before:rounded-lg before:mx-auto before:inset-x-0">
            {responseType === "Success" ? (
              <div className="flex flex-col justify-center items-center">
                <Lucide
                  icon="CheckCircle"
                  className="w-[5rem] h-[5rem] text-success"
                />
                <div className="text-lg sm:text-2xl font-medium text-center dark:text-slate-300 mt-5">
                  You are verified.
                </div>
                <p className="mt-3">
                  You are now able to log in to the dashboard.
                </p>
                <p>Click below to login.</p>
                <div className="mt-2 text-center xl:mt-4 xl:text-left">
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-full xl:mr-3"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center flex-col items-center">
                <Lucide
                  icon="XCircle"
                  className="w-[5rem] h-[5rem] text-danger"
                />
                <div className="mt-5">
                  <p className="text-2xl">You are not verified.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserVerify;
