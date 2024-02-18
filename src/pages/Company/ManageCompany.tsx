import PageHeader from "../../components/PageHeader";
import CompanyInfo from "../../components/Company/CompanyInfo";
import CompanySocialInfo from "../../components/Company/CompanySocialInfo";
import { useState, useEffect } from "react";
import CompanyStepForm from "../../components/MultiStepForm/CompanyStepForm";
import { useNavigate } from "react-router-dom";
import { checkPermission } from "../../utils/checkPermissions";

function Main() {
  const companyId = localStorage.getItem("newlyAddedCompany");
  const navigate = useNavigate();
  const [hasAddPermission, setHasAddPermission] = useState<boolean>(false);
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(false);

  const [page, setPage] = useState<string>("1");

  useEffect(() => {
    const fetchPermission = async () => {
      const doesHaveAddPermission = await checkPermission(
        "company_management",
        "add"
      );
      const doesHaveEditPermission = await checkPermission(
        "company_management",
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
            HeaderText="Company List"
            Breadcrumb={[
              {
                name: `${companyId ? "Company Update" : "Company Add"}`,
                navigate: "#",
              },
            ]}
            to="/company"
          />

          <div className="flex items-center mt-5">
            <h2 className="mr-auto text-lg font-medium intro-y">
              {companyId ? "Update Company" : "Add Company"}
            </h2>
          </div>
          <div className="py-10 mt-5 intro-y box">
            <CompanyStepForm
              setPage={setPage}
              page={page}
              onPageNumberClick={nextPageNumber}
            />
            <div className="px-5 pt-5 mt-5 border-t sm:px-20 border-slate-200/60 dark:border-darkmode-400">
              {
                {
                  1: <CompanyInfo nextPage={nextPage} setPage={setPage} />,
                  2: (
                    <CompanySocialInfo nextPage={nextPage} setPage={setPage} />
                  ),
                }[page]
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Main;
