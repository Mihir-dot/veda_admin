import clsx from "clsx";
import Statistics from "../../components/Dashboard/statistics";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { getUserData, setDashboardData } from "../../stores/dashboard";
import moment from "moment";
import { removeItemFromLocalStorage } from "../../stores/sideMenuSlice";

function Main() {
  const dispatch = useAppDispatch();
  const userState: any = useAppSelector(getUserData);
  const [message, setMessage] = useState<string>("");
  const statisticsData = [
    {
      title: "Site Statistics",
      icon: "TrendingUp",
      items: [
        {
          icon: "Users",
          title: "Users",
          number: "22",
        },
        {
          icon: "Truck",
          title: "Drivers or carriers",
          number: "7",
        },
        {
          icon: "UserCheck",
          title: "Online drivers",
          number: "3",
        },
        {
          icon: "ShoppingBag",
          title: "Retailer",
          number: "12",
        },
      ],
    },
    {
      title: "Job Statistics",
      icon: "Sliders",
      items: [
        {
          icon: "Codesandbox",
          title: "Total jobs",
          number: "12",
        },
        {
          icon: "Briefcase",
          title: "Running job",
          number: "5",
        },
        {
          icon: "CheckCircle",
          title: "Completed jobs",
          number: "7",
        },
        {
          icon: "PlusSquare",
          title: "Created jobs",
          number: "3",
        },
      ],
    },
  ];

  // useEffect(() => {
  //   dispatch(setDashboardData());
  //   dispatch(removeItemFromLocalStorage());
  // }, []);



  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 2xl:col-span-9">
        <div className="grid grid-cols-12 gap-6">
          {/* BEGIN: General Report */}
         
            <div className="col-span-12 mt-6">
              <div className="items-center block h-10 intro-y sm:flex sm:justify-between">
                <h2 className="mr-5 text-lg font-medium truncate">Dashboard</h2>
                <h2>{message}</h2>
              </div>
              {/*BEGIN: Dashboard cards */}
              <div className={clsx(["relative intro-y mt-4"])}>
                <div className="grid grid-cols-12 gap-x-2 gap-y-4">
                  {/* BEGIN: Statistics */}
                  {statisticsData?.map((item: any, i: number) => {
                    return (
                      <Statistics
                        key={i}
                        title={item.title}
                        items={item.items}
                        icon={item.icon}
                      />
                    );
                  })}
                  {/* END: Statistics */}
                </div>
              </div>
              {/*END: Dashboard cards */}
            </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
