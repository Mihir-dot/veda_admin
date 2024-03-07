import { useRoutes, Navigate, useNavigate } from "react-router-dom";
import Menu from "../layouts/SideMenu";
import { selectAuth } from "../stores/auth";
import { useAppDispatch, useAppSelector } from "../stores/hooks";
import { Suspense, lazy, useEffect, useState } from "react";
import Loader from "../components/Loader";
import { ToastContainer } from "react-toastify";
import { selectDarkMode } from "../stores/darkModeSlice";

import { resetToast, toastMessage } from "../stores/toastSlice";

function getUserRole() {
  return localStorage.getItem("role");
}

interface AuthType {
  token: string;
}

interface RoleType {
  role: string | null;
}

const RenderRoutes: React.FC<RoleType> = ({ role }) => {
  // const auth: AuthType = useAppSelector(selectAuth);
  const auth= localStorage.getItem("token")


  const DashboardOverview1 = lazy(() => import("../pages/DashboardOverview1"));
  const Profile = lazy(() => import("../pages/Profile"));
  const Login = lazy(() => import("../pages/Login"));
  const Contact =lazy(()=>import("../pages/Contact"))
 const UserContact = lazy(()=>import("../pages/UserContactData"))
  const ForgetPassword = lazy(() => import("../pages/Login/ForgetPassword"));
  const ResetPassword = lazy(() => import("../pages/Login/ResetPassword"));
  const ErrorPage = lazy(() => import("../pages/ErrorPage"));
  const Service=lazy(()=>import("../pages/Service"))
  const Review=lazy(()=>import("../pages/Review"))
  const ManageService=lazy(()=>import("../components/Service/addService"))
  const ManageReview=lazy(()=>import("../components/Review/addReview"))
  const SocialMedia =lazy(()=>import("../pages/SocialMedia"))

  const UnAuthorizedPage = lazy(
    () => import("../pages/ErrorPage/UnAuthorized")
  );

  const routes: any = [
    {
      path: "/",
      // if token available then navigate to dashboard
      element: auth ? <Menu /> : <Navigate to="/login" />,
      // element:  <Menu /> ,

      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <DashboardOverview1 />
            </Suspense>
          ),
        },
        {
          path: "/profile",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <Profile />
            </Suspense>
          ),
        },
        {
          path: "/service",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <Service />
            </Suspense>
          ),
        },
        {
          path: "/service/manage-service",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <ManageService />
            </Suspense>
          ),
        },
        {
          path: "/contact",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <Contact />
            </Suspense>
          ),
        },
        {
          path: "/contact-management/add-contact",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <Contact />
            </Suspense>
          ),
        },
        {
          path: "/review",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <Review />
            </Suspense>
          ),
        },
        {
          path: "review/manage-review",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <ManageReview />
            </Suspense>
          ),
        },
        {
          path: "/social-media",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <SocialMedia />
            </Suspense>
          ),
        },
        {
          path: "/user-contact",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <UserContact />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "/login",
      // if token not available then navigate to login
      element: !auth ? (
        <Suspense fallback={<Loader icon="puff" />}>
          <Login />
        </Suspense>
      ) : (
        <Navigate to="/" />
      ),
    },
    {
      path: "/forget-password",
      element: !auth ? (
        <Suspense fallback={<Loader icon="puff" />}>
          <ForgetPassword />
        </Suspense>
      ) : (
        <Navigate to="/" />
      ),
    },
    {
      path: "/reset-password",
      element: !auth ? (
        <Suspense fallback={<Loader icon="puff" />}>
          <ResetPassword />
        </Suspense>
      ) : (
        <Navigate to="/" />
      ),
    },
    {
      path: "/unauthorized",
      element: !auth ? (
        <Suspense fallback={<Loader icon="puff" />}>
          <UnAuthorizedPage />
        </Suspense>
      ) : (
        <Navigate to="/" />
      ),
    },
    {
      path: "*",
      element: (
        <Suspense fallback={<Loader icon="puff" />}>
          <ErrorPage />
        </Suspense>
      ),
    },
  ];
  return useRoutes(routes);
};
//Router file

function Router() {
  const [role, setRole] = useState(null);
  const auth: AuthType = useAppSelector(selectAuth);
  const darkMode = useAppSelector(selectDarkMode);
  const toastMsg = useAppSelector(toastMessage);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.token) {
      // setRole(getUserRole());
    }
  }, [auth.token]);

  useEffect(() => {
    if (toastMsg !== undefined) {
      if (toastMsg !== "") {
        dispatch(resetToast());
      }
    }
  }, [toastMsg, dispatch]);

  return (
    <>
      {/* ToastContainer for displaying toast messages */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className={`${darkMode ? "text-white" : "text-black"}`}
        theme={darkMode ? "dark" : "light"}
      />

      <RenderRoutes role={role} />
    </>
  );
}

export default Router;
