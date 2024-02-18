import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import AccountsInfo from "../../components/Accounts/AccountsInfo";
import AccountsSocialInfo from "../../components/Accounts/AccountsSocialInfo";
import AccountsStepForm from "../../components/MultiStepForm/AccountsStepForm";
import { checkPermission } from "../../utils/checkPermissions";
import { useNavigate } from "react-router-dom";

const ManageAccounts: React.FC = () => {
  const accountsId = localStorage.getItem("newlyAddedAccounts");
  const [hasAddPermission, setHasAddPermission] = useState<boolean>(false);
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(false);
  const navigate = useNavigate();

  const [page, setPage] = useState<string>("1");

  useEffect(() => {
    const fetchPermission = async () => {
      const doesHaveAddPermission = await checkPermission(
        "account_management",
        "add"
      );
      const doesHaveEditPermission = await checkPermission(
        "account_management",
        "edit"
      );
      setHasAddPermission(doesHaveAddPermission);
      setHasEditPermission(doesHaveEditPermission);
      if (!doesHaveAddPermission && !doesHaveEditPermission) {
        navigate("/unauthorized");
        localStorage.removeItem("currentPage");
      }
    };
    fetchPermission();
  }, []);

  useEffect(() => {
    const storedPage = localStorage.getItem("currentPage");
    if (storedPage) {
      setPage(storedPage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentPage", page);
  }, [page]);

  const nextPage = (page: string) => {
    setPage(page);
  };

  const nextPageNumber = (pageNumber: string) => {
    switch (pageNumber) {
      case "1":
        setPage("1");
        break;
      case "2":
        setPage("2");
        break;
      default:
        setPage("1");
    }
  };

  return (
    <>
      {(hasAddPermission || hasEditPermission) && (
        <div>
          <PageHeader
            HeaderText="Accounts List"
            Breadcrumb={[
              {
                name: `${accountsId ? "Accounts Update" : "Accounts Add"}`,
                navigate: "#",
              },
            ]}
            to="/accounts"
          />

          <div className="flex items-center mt-5">
            <h2 className="mr-auto text-lg font-medium intro-y">
              {accountsId ? "Update Accounts" : "Add Accounts"}
            </h2>
          </div>
          <div className="py-10 mt-5 intro-y box">
            <AccountsStepForm
              setPage={setPage}
              page={page}
              onPageNumberClick={nextPageNumber}
            />
            <div className="px-5 pt-5 mt-5 border-t sm:px-20 border-slate-200/60 dark:border-darkmode-400">
              {
                {
                  1: <AccountsInfo nextPage={nextPage} setPage={setPage} />,
                  2: (
                    <AccountsSocialInfo nextPage={nextPage} setPage={setPage} />
                  ),
                }[page]
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageAccounts;
