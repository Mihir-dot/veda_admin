import { useRoutes, Navigate, useNavigate } from "react-router-dom";
import Menu from "../layouts/SideMenu";
import { selectAuth } from "../stores/auth";
import { useAppDispatch, useAppSelector } from "../stores/hooks";
import { Suspense, lazy, useEffect, useState } from "react";
import Loader from "../components/Loader";
import { ToastContainer } from "react-toastify";
import { selectDarkMode } from "../stores/darkModeSlice";

import { resetToast, toastMessage } from "../stores/toastSlice";

interface AuthType {
  token: string;
}

interface RoleType {
  role: string | null;
}

const RenderRoutes: React.FC<RoleType> = ({ role }) => {
  // const auth: AuthType = useAppSelector(selectAuth);
  const auth = localStorage.getItem("token");

  const DashboardOverview1 = lazy(() => import("../pages/DashboardOverview1"));
  const Profile = lazy(() => import("../pages/Profile"));
  const Login = lazy(() => import("../pages/Login"));
  const Contact = lazy(() => import("../pages/Contact"));
  const UserContact = lazy(() => import("../pages/UserContactData"));
  const ForgetPassword = lazy(() => import("../pages/Login/ForgetPassword"));
  const ResetPassword = lazy(() => import("../pages/Login/ResetPassword"));
  const ErrorPage = lazy(() => import("../pages/ErrorPage"));
  const Service = lazy(() => import("../pages/Service"));
  const Review = lazy(() => import("../pages/Review"));
  const ManageService = lazy(() => import("../components/Service/addService"));
  const ManageReview = lazy(() => import("../components/Review/addReview"));
  const SocialMedia = lazy(() => import("../pages/SocialMedia"));
  const AboutUs = lazy(() => import("../pages/About"));
  const Home = lazy(() => import("../pages/home"));
  const ManageHome = lazy(() => import("../components/Home/addHome"));
  const ManageAbout = lazy(() => import("../components/About/addAboutData"));
  const ManageFaq = lazy(() => import("../components/Faqs/addFaq"));
  const Faqs = lazy(() => import("../pages/Faqs"));
  const ManagePodcast = lazy(() => import("../components/PodCast/addPodCast"));
  const PodCast = lazy(() => import("../pages/PodCast"));
  const ManageResources = lazy(() => import("../components/Resources/addResources"));
  const Resources = lazy(() => import("../pages/Resources"));
  const ManageFounder = lazy(() => import("../components/Founder/addFounder"));
  const Founder = lazy(() => import("../pages/Founder"));

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
          path: "/home",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: "/home/manage-home-details",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <ManageHome />
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
          path: "/about",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <AboutUs />
            </Suspense>
          ),
        },
        {
          path: "/about/manage-about",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <ManageAbout />
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
          path: "/socialmedia-management/edit-socialmedia",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <SocialMedia />
            </Suspense>
          ),
        },
        {
          path: "/faq",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <Faqs />
            </Suspense>
          ),
        },
        {
          path: "/faq/manage-faq",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <ManageFaq />
            </Suspense>
          ),
        },
        {
          path: "/podcast",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <PodCast />
            </Suspense>
          ),
        },
        {
          path: "/podcast/manage-podcast",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <ManagePodcast />
            </Suspense>
          ),
        },
        {
          path: "/resources",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <Resources />
            </Suspense>
          ),
        },
        {
          path: "/resources/manage-resources",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <ManageResources />
            </Suspense>
          ),
        },
        {
          path: "/founder",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <Founder />
            </Suspense>
          ),
        },
        {
          path: "/founder/manage-founder",
          element: (
            <Suspense fallback={<Loader icon="puff" />}>
              <ManageFounder />
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
