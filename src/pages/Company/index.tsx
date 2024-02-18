import { useNavigate } from "react-router-dom";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import PageHeader from "../../components/PageHeader";
import TomSelect from "../../base-components/TomSelect";
import { FormInput, FormSelect, FormSwitch } from "../../base-components/Form";
import Table from "../../base-components/Table";
import Tippy from "../../base-components/Tippy";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { selectDarkMode } from "../../stores/darkModeSlice";
import { ChangeEvent, useState, useEffect, useRef } from "react";
import {
  deleteCompany,
  fetchAllCompaniesData,
  getCompaniesData,
} from "../../stores/company";
import moment from "moment";
import { Dialog } from "../../base-components/Headless";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";
import { checkPermission } from "../../utils/checkPermissions";

let filterList = [
  { label: "Active", value: "active" },
  { label: "Deactive", value: "deactive" },
  { label: "All", value: "all" },
];

function Main() {
  const companiesState: any = useAppSelector(getCompaniesData);
  const itemsPerPageOptions: number[] = [10, 20, 50, 100];
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [limit, setLimit] = useState<number>(companiesState.limit);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [deleteCompanyModal, setDeleteCompanyModal] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [status, setStatus] = useState<boolean>(true);
  const [filterCompany, setFilterCompany] = useState<string>("active");
  const totalPages: number = Math.ceil(
    companiesState.totalRecords / companiesState.limit
  );
  const [hasViewPermission, setHasViewPermission] = useState<boolean>(false);
  const [hasAddPermission, setHasAddPermission] = useState<boolean>(false);
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(false);
  const [hasDeletePermission, setHasDeletePermission] =
    useState<boolean>(false);
  let startIndex: number = (currentPage - 1) * itemsPerPage;
  let endIndex: number = Math.min(
    startIndex + itemsPerPage,
    companiesState.companies.length
  );

  const darkMode = useAppSelector(selectDarkMode);
  const dispatch = useAppDispatch();
  const deleteButtonRef = useRef(null);

  if (endIndex - startIndex < itemsPerPage) {
    startIndex = Math.max(0, companiesState.companies.length - itemsPerPage);
    endIndex = companiesState.companies.length;
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedItems = [...companiesState.companies].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  const displayedCompanies = sortedItems.slice(startIndex, endIndex);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      const doesHaveViewPermission = await checkPermission(
        "company_management",
        "view"
      );
      const doesHaveAddPermission = await checkPermission(
        "company_management",
        "add"
      );
      const doesHaveDeletePermission = await checkPermission(
        "company_management",
        "delete"
      );
      const doesHaveEditPermission = await checkPermission(
        "company_management",
        "edit"
      );
      setHasViewPermission(doesHaveViewPermission);
      setHasAddPermission(doesHaveAddPermission);
      setHasEditPermission(doesHaveEditPermission);
      setHasDeletePermission(doesHaveDeletePermission);
      if (!doesHaveViewPermission) {
        navigate("/unauthorized");
      } else {
        const data = await dispatch(
          fetchAllCompaniesData({
            limit,
            page: currentPage,
            searchText,
            enable: 1,
          })
        );
        console.log("data--", data);
      }
    };
    fetchCompanies();
  }, [searchText]);

  const changeCompanyStatus = async (selectedValue: string) => {
    setFilterCompany(selectedValue);
    const newLimit = itemsPerPage;
    setItemsPerPage(10);
    setLimit(newLimit);
    if (selectedValue === "active") {
      await dispatch(
        fetchAllCompaniesData({
          limit: 10,
          page: 1,
          searchText,
          enable: 1,
        })
      );
    } else if (selectedValue === "deactive") {
      await dispatch(
        fetchAllCompaniesData({
          limit: 10,
          page: 1,
          searchText,
          enable: 0,
        })
      );
    } else {
      await dispatch(fetchAllCompaniesData({ limit: 10, page: 1, searchText }));
    }
    setCurrentPage(1);
  };

  const changeStatus = () => {
    setStatus(!status);
    console.log(status);
  };

  const handlePageChange = async (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      if (filterCompany === "all") {
        await dispatch(
          fetchAllCompaniesData({
            limit,
            page: pageNumber,
            searchText,
          })
        );
      } else if (filterCompany === "active") {
        await dispatch(
          fetchAllCompaniesData({
            limit,
            page: pageNumber,
            searchText,
            enable: 1,
          })
        );
      } else {
        await dispatch(
          fetchAllCompaniesData({
            limit,
            page: pageNumber,
            searchText,
            enable: 0,
          })
        );
      }
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = async (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const newItemsPerPage = parseInt(event.target.value);
    setItemsPerPage(newItemsPerPage);
    setLimit(newItemsPerPage);
    if (filterCompany === "all") {
      await dispatch(
        fetchAllCompaniesData({
          limit: newItemsPerPage,
          page: 1,
          searchText,
        })
      );
    } else if (filterCompany === "active") {
      await dispatch(
        fetchAllCompaniesData({
          limit: newItemsPerPage,
          page: 1,
          searchText,
          enable: 1,
        })
      );
    } else {
      await dispatch(
        fetchAllCompaniesData({
          limit: newItemsPerPage,
          page: 1,
          searchText,
          enable: 0,
        })
      );
    }
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const openDeleteCompanyModal = (id: number) => {
    setSelectedCompanyId(id);
    setDeleteCompanyModal(true);
  };

  const deleteSelectedCompany = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(deleteCompany(selectedCompanyId));
      if (res.payload.type === "Success") {
        toast.success(res.payload.message || "Company deleted successfully.");
        dispatch(
          fetchAllCompaniesData({ limit, page: currentPage, searchText })
        );
        setDeleteCompanyModal(false);
      } else {
        toast.error(res.payload.message || "Something went wrong.");
      }
    } catch (error) {
      console.log("Err-", error);
    } finally {
      setFilterCompany("active");
      setIsLoading(false);
    }
  };

  const updateCompany = (id: number) => {
    localStorage.setItem("newlyAddedCompany", String(id));
    navigate("/company/manage-company");
  };

  return (
    <>
      {hasViewPermission && (
        <div>
          <PageHeader HeaderText="Company List" to="/company" />
          <div className="flex px-2 flex-wrap gap-5 justify-between mt-5">
            <div className="w-32">
              <TomSelect
                name="companyStatus"
                onChange={changeCompanyStatus}
                value={filterCompany}
              >
                {filterList.map((list, idx) => (
                  <option value={list.value} key={idx}>
                    {list.label}
                  </option>
                ))}
              </TomSelect>
            </div>
            <div className="w-full sm:flex-1">
              <div className="relative text-slate-500">
                <FormInput
                  type="text"
                  className="pr-10 !box dark:text-gray-300"
                  placeholder="Search by company code or company name..."
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Lucide
                  icon="Search"
                  className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                />
              </div>
            </div>
            {hasAddPermission && (
              <Button
                variant="primary"
                className="mb-2 mr-2 py-[0.35rem] sm:text-sm text-xs"
                onClick={() => navigate("/company/manage-company")}
              >
                <Lucide icon="PlusCircle" className="mr-2 w-5" /> Add Company
              </Button>
            )}
          </div>

          <div className="mt-3">
            {/* BEGIN: Data List */}
            {companiesState.loading ? (
              <div role="status" className="flex justify-center mt-10">
                <svg
                  aria-hidden="true"
                  className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
              <>
                <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
                  <Table className="border-spacing-y-[10px] border-separate -mt-2">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th
                          className="border-b-0 whitespace-nowrap cursor-pointer flex items-center gap-2"
                          onClick={toggleSortOrder}
                        >
                          <span>#</span>
                          <span>
                            <Lucide
                              icon={
                                sortOrder === "asc" ? "ArrowDown" : "ArrowUp"
                              }
                              className={`w-4 h-4 transform transition ease-in duration-500`}
                            ></Lucide>
                          </span>
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Company Code
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Logo
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Company Name
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Last Update
                        </Table.Th>
                        {/* <Table.Th className="border-b-0 whitespace-nowrap">
                          Activate / Deactivate
                        </Table.Th> */}
                        {(hasEditPermission || hasDeletePermission) && (
                          <Table.Th className="border-b-0 whitespace-nowrap">
                            Action
                          </Table.Th>
                        )}
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {companiesState.companies.length !== 0 &&
                        displayedCompanies.map((company: any) => (
                          <Table.Tr key={company.id} className="intro-x">
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <span>{company.id}</span>
                            </Table.Td>

                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              {company.company_code}
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <div className="flex -ml-[0.35rem]">
                                <div className="w-10 h-10 image-fit zoom-in">
                                  <Tippy
                                    as="img"
                                    alt={company.name.slice(0, 10) + "..."}
                                    className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                    src={
                                      company.logo !== ""
                                        ? `${
                                            import.meta.env
                                              .VITE_REACT_APP_COMPANY_IMAGE_URL
                                          }/${company.logo}`
                                        : `/user2.jpg`
                                    }
                                    content={`Uploaded at ${moment(
                                      company.updated_at
                                    ).format("MM/DD/YYYY hh:mm a")}`}
                                  />
                                </div>
                              </div>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <div>{company.name}</div>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                              <div className="flex items-center">
                                {moment(company.updated_at).format(
                                  "DD MMMM YYYY"
                                )}
                              </div>
                            </Table.Td>
                            {/* <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                              <div className="flex items-center">
                                <FormSwitch>
                                  <FormSwitch.Input
                                    id="checkbox-switch-7"
                                    type="checkbox"
                                    onChange={changeStatus}
                                    checked={
                                      company.enable === 1 ? true : false
                                    }
                                  />
                                </FormSwitch>
                              </div>
                            </Table.Td> */}
                            {(hasEditPermission || hasDeletePermission) && (
                              <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                                <div className="flex items-center gap-3">
                                  {hasEditPermission && (
                                    <span
                                      className="flex items-center cursor-pointer"
                                      onClick={() => updateCompany(company.id)}
                                    >
                                      <Lucide
                                        icon="Edit"
                                        className="w-[1.15rem] h-[1.15rem] text-blue-600"
                                      />
                                    </span>
                                  )}
                                  {hasDeletePermission &&
                                    !company?.is_root_company && (
                                      <span
                                        className="flex items-center cursor-pointer"
                                        onClick={() =>
                                          openDeleteCompanyModal(company.id)
                                        }
                                      >
                                        <Lucide
                                          icon="Trash2"
                                          className="w-4 h-4 text-red-600"
                                        />
                                      </span>
                                    )}
                                </div>
                              </Table.Td>
                            )}
                          </Table.Tr>
                        ))}
                    </Table.Tbody>
                  </Table>
                </div>
                {companiesState.companies.length === 0 && (
                  <h1
                    className={`text-center mt-10 text-2xl font-medium ${
                      companiesState.loading ? "text-inherit" : "text-[#8b8a8a]"
                    }`}
                  >
                    No data to display...
                  </h1>
                )}
                {/* END: Data List */}
                {/* BEGIN: Pagination */}
                {companiesState.companies.length > 0 && (
                  <div className="flex flex-wrap items-center justify-between col-span-12 mt-5 intro-y sm:flex-row sm:flex-nowrap mb-10">
                    <div className="w-full sm:w-auto flex flex-wrap gap-2 sm:gap-5 sm:mr-auto">
                      <Button
                        variant={
                          darkMode ? "outline-secondary" : "soft-secondary"
                        }
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                      >
                        <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                      </Button>
                      {/* Previous page link */}
                      {currentPage > 1 && (
                        <Button
                          variant={
                            darkMode ? "outline-secondary" : "soft-secondary"
                          }
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          <Lucide icon="ChevronLeft" className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Page numbers */}
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const currentPageNumber = index + 1;

                        // Determine if this page number should be displayed
                        const shouldDisplay =
                          currentPageNumber <= 2 || // Display the first 2 pages
                          currentPageNumber > totalPages - 2 || // Display the last 2 pages
                          (currentPageNumber >= currentPage - 1 &&
                            currentPageNumber <= currentPage + 1); // Display pages around the current page

                        // Render the page number button if it should be displayed
                        if (shouldDisplay) {
                          return (
                            <Button
                              key={index}
                              variant={
                                darkMode
                                  ? "outline-secondary"
                                  : "soft-secondary"
                              }
                              className={`${
                                currentPageNumber === currentPage
                                  ? "!box font-medium dark:bg-darkmode-400"
                                  : ""
                              } px-[0.9rem]`}
                              onClick={() =>
                                handlePageChange(currentPageNumber)
                              }
                            >
                              {currentPageNumber}
                            </Button>
                          );
                        }

                        // Render '...' for ellipsis
                        if (
                          (currentPageNumber === 3 && currentPage > 2) ||
                          (currentPageNumber === totalPages - 2 &&
                            currentPage < totalPages - 1)
                        ) {
                          return (
                            <p key={index} className="mt-1">
                              ...
                            </p>
                          );
                        }

                        return null; // Don't render anything for other cases
                      })}

                      {/* Next page link */}
                      {currentPage < totalPages && (
                        <Button
                          variant={
                            darkMode ? "outline-secondary" : "soft-secondary"
                          }
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          <Lucide icon="ChevronRight" className="w-4 h-4" />
                        </Button>
                      )}

                      <Button
                        variant={
                          darkMode ? "outline-secondary" : "soft-secondary"
                        }
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        <Lucide icon="ChevronsRight" className="w-4 h-4" />
                      </Button>
                    </div>
                    <FormSelect
                      className="w-20 mt-3 !box sm:mt-0"
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                    >
                      {itemsPerPageOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </FormSelect>
                  </div>
                )}
                {/* END: Pagination */}
              </>
            )}
          </div>

          {/* BEGIN: Delete Confirmation Modal */}
          <Dialog
            open={deleteCompanyModal}
            onClose={() => {
              setDeleteCompanyModal(false);
            }}
            initialFocus={deleteButtonRef}
          >
            <Dialog.Panel>
              <div className="p-5 text-center">
                <div className="mt-5 text-xl">
                  Are you sure to delete this company?
                </div>
              </div>
              <div className="px-5 pb-8 text-center flex justify-end gap-5">
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => {
                    setDeleteCompanyModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  type="button"
                  ref={deleteButtonRef}
                  onClick={deleteSelectedCompany}
                >
                  {isLoading ? (
                    <>
                      Loading...
                      <LoadingIcon
                        icon="oval"
                        color="white"
                        className="w-4 h-4 ml-2"
                      />
                    </>
                  ) : (
                    "Delete Company"
                  )}
                </Button>
              </div>
            </Dialog.Panel>
          </Dialog>
          {/* END: Delete Confirmation Modal */}
        </div>
      )}
    </>
  );
}

export default Main;
