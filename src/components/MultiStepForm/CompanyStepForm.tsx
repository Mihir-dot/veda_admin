import React from "react";
import Button from "../../base-components/Button";

interface companyStepProps {
  page: string;
  onPageNumberClick?: (pageNumber: string) => void;
  setPage: (newPage: string) => void;
}

const stepNames = ["Company Information", "Media / Social"];

const CompanyStepForm: React.FC<companyStepProps> = ({
  page,
  onPageNumberClick,
  setPage,
}) => {
  return (
    <>
      {/* BEGIN: Wizard Layout */}
      <div className="relative before:hidden before:md:block before:absolute before:w-[40%] before:h-[3px] before:top-0 before:bottom-0 before:mt-3 before:bg-slate-200 before:dark:bg-darkmode-400 flex flex-col md:flex-row justify-center px-5 sm:px-20">
        {stepNames.map((name, idx) => (
          <div
            className="z-10 flex items-center flex-1 intro-x md:text-center md:block first:mt-0 mt-3 md:mt-0"
            key={idx}
          >
            <Button
              variant={page === String(idx + 1) ? "primary" : "secondary"}
              className="w-7 h-7 rounded-full"
              onClick={() => {
                if (page > String(idx + 1)) {
                  setPage(String(idx + 1));
                }
              }}
            >
              {idx + 1}
            </Button>
            <div
              className={`ml-3 text-sm font-medium md:w-32 md:mt-3 md:mx-auto ${
                page === String(idx + 1) ? "text-inherit" : "text-slate-400"
              }`}
            >
              {name}
            </div>
          </div>
        ))}
      </div>
      {/* END: Wizard Layout */}
    </>
  );
};

export default CompanyStepForm;
