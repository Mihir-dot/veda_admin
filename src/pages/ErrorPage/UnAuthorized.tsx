import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import errorIllustration from "../../assets/images/error-illustration.svg";
import Button from "../../base-components/Button";
import { useAppSelector } from "../../stores/hooks";
import { selectAuth } from "../../stores/auth";
import { useNavigate } from "react-router";

function UnAuthorized() {
  const auth = useAppSelector(selectAuth);
  const navigate = useNavigate();

  const goBack = () => {
    // auth.token ? navigate("/") : navigate("/login");
    navigate("/") ;

  };

  return (
    <>
      <div>
        <DarkModeSwitcher />
        <MainColorSwitcher />
        <div className="container">
          {/* BEGIN: UnAuthorized Page */}
          <div className="flex flex-col items-center justify-center h-screen text-center error-page lg:flex-row lg:text-left">
            <div className="-intro-x lg:mr-20">
              <img
                alt="UnAuthorized Page"
                className="w-[450px] h-48 lg:h-auto"
                src={errorIllustration}
              />
            </div>
            <div className="mt-10 text-white lg:mt-0">
              <div className="font-medium intro-x text-8xl">Unauthorized</div>
              <div className="mt-5 text-xl font-medium intro-x lg:text-3xl">
                You are not authorized to access this page.
              </div>
              <div className="mt-3 text-lg intro-x">
                You can click below button to go back to dashboard.
              </div>
              <Button
                className="px-4 py-3 mt-10 text-white border-white intro-x dark:border-darkmode-400 dark:text-slate-200"
                onClick={goBack}
              >
                Back to Home
              </Button>
            </div>
          </div>
          {/* END: UnAuthorized Page */}
        </div>
      </div>
    </>
  );
}

export default UnAuthorized;
