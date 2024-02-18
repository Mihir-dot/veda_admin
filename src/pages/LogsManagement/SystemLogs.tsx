import React, { useState, useEffect, ChangeEvent } from "react";
import PageHeader from "../../components/PageHeader";
import TomSelect from "../../base-components/TomSelect";
import Table from "../../base-components/Table";
import Lucide from "../../base-components/Lucide";
import Button from "../../base-components/Button";
import { FormSelect } from "../../base-components/Form";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import {
  fetchAllSystemLogs,
  fetchSingleSystemLog,
  getLogsData,
} from "../../stores/logs";
import { selectDarkMode } from "../../stores/darkModeSlice";
import moment from "moment";
import clsx from "clsx";
import { ERROR_TEXT, SUCCESS_TEXT } from "../../utils/constants";
import { Dialog, DialogContent } from "@mui/material";
import Loader from "../../components/Loader";

const filterList = [
  { label: "Success", value: "success" },
  { label: "Error", value: "error" },
  { label: "All", value: "all" },
];

const SystemLogs: React.FC = () => {
  const systemLogsState: any = useAppSelector(getLogsData);
  const [systemLogModal, setSystemLogModal] = useState<boolean>(false);
  const [selectedSystemId, setSelectedSystemId] = useState<number | null>(null);
  const itemsPerPageOptions: number[] = [10, 20, 50, 100];
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [limit, setLimit] = useState<number>(systemLogsState.limit);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const darkMode = useAppSelector(selectDarkMode);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterSystemLogs, setFilterSystemLogs] = useState<string>("success");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const totalPages: number = Math.ceil(
    systemLogsState.totalRecords / systemLogsState.limit
  );
  let startIndex: number = (currentPage - 1) * itemsPerPage;
  let endIndex: number = Math.min(
    startIndex + itemsPerPage,
    systemLogsState.systemLogs.length
  );
  const dispatch = useAppDispatch();

  if (endIndex - startIndex < itemsPerPage) {
    startIndex = Math.max(0, systemLogsState.systemLogs.length - itemsPerPage);
    endIndex = systemLogsState.systemLogs.length;
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedItems = [...systemLogsState.systemLogs].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  const displayedSystemLogs = sortedItems.slice(startIndex, endIndex);
  const systemLogData = systemLogsState.systemLog;

  useEffect(() => {
    const fetchSystemLogs = async () => {
      const data = await dispatch(
        fetchAllSystemLogs({
          limit: 10,
          page: currentPage,
          res_type: SUCCESS_TEXT,
        })
      );
      console.log("data--", data);
    };
    fetchSystemLogs();
  }, []);

  useEffect(() => {
    if (systemLogModal) {
      try {
        setIsLoading(true);
        dispatch(fetchSingleSystemLog(selectedSystemId));
      } catch (error) {
        console.log("Err--", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [systemLogModal]);

  const changeSystemLogStatus = async (selectedValue: string) => {
    setFilterSystemLogs(selectedValue);
    const newLimit = itemsPerPage;
    setItemsPerPage(10);
    setLimit(newLimit);
    if (selectedValue === "success") {
      await dispatch(
        fetchAllSystemLogs({
          limit: 10,
          page: 1,
          res_type: SUCCESS_TEXT,
        })
      );
    } else if (selectedValue === "error") {
      await dispatch(
        fetchAllSystemLogs({
          limit: 10,
          page: 1,
          res_type: ERROR_TEXT,
        })
      );
    } else {
      await dispatch(fetchAllSystemLogs({ limit: 10, page: 1 }));
    }
    setCurrentPage(1);
  };

  const handlePageChange = async (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      if (filterSystemLogs === "all") {
        await dispatch(
          fetchAllSystemLogs({
            limit,
            page: pageNumber,
          })
        );
      } else if (filterSystemLogs === "success") {
        await dispatch(
          fetchAllSystemLogs({
            limit,
            page: pageNumber,
            res_type: SUCCESS_TEXT,
          })
        );
      } else {
        await dispatch(
          fetchAllSystemLogs({
            limit,
            page: pageNumber,
            res_type: ERROR_TEXT,
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
    if (filterSystemLogs === "all") {
      await dispatch(
        fetchAllSystemLogs({
          limit: newItemsPerPage,
          page: 1,
        })
      );
    } else if (filterSystemLogs === "success") {
      await dispatch(
        fetchAllSystemLogs({
          limit: newItemsPerPage,
          page: 1,
          res_type: SUCCESS_TEXT,
        })
      );
    } else {
      await dispatch(
        fetchAllSystemLogs({
          limit: newItemsPerPage,
          page: 1,
          res_type: ERROR_TEXT,
        })
      );
    }
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const openSystemLogModal = (id: number) => {
    setSelectedSystemId(id);
    setSystemLogModal(true);
  };

  return (
    <div>
      <PageHeader HeaderText="System Logs" to="/system-logs" />
      <div className="flex px-2 flex-wrap gap-5 justify-between mt-5">
        <div className="w-32">
          <TomSelect
            name="systemLogs"
            onChange={changeSystemLogStatus}
            value={filterSystemLogs}
          >
            {filterList.map((list, idx) => (
              <option value={list.value} key={idx}>
                {list.label}
              </option>
            ))}
          </TomSelect>
        </div>
      </div>

      <div className="mt-3">
        {/* BEGIN: Data List */}
        {systemLogsState.loading ? (
          <div role="status" className="flex justify-center mt-10">
            <svg
              aria-hidden="true"
              className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-cyan-600"
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
                          icon={sortOrder === "asc" ? "ArrowDown" : "ArrowUp"}
                          className={`w-4 h-4 transform transition ease-in duration-500`}
                        ></Lucide>
                      </span>
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Module
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Status Code
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Response Type
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Log Date
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Message
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Action
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {systemLogsState.systemLogs.length !== 0 &&
                    displayedSystemLogs.map((systemLog: any) => (
                      <Table.Tr key={systemLog.id} className="intro-x">
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          <span>{systemLog.id}</span>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md capitalize last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          <div className="">
                            {systemLog?.module ? systemLog.module : "N/A"}
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          <div>
                            {systemLog?.status_code
                              ? systemLog.status_code
                              : "N/A"}
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          <div
                            className={clsx({
                              "flex items-center": true,
                              "text-success":
                                systemLog.res_type === SUCCESS_TEXT,
                              "text-danger": systemLog.res_type === ERROR_TEXT,
                            })}
                          >
                            {systemLog?.res_type ? systemLog.res_type : "N/A"}
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          <div className="flex items-center">
                            {systemLog?.created_at
                              ? moment(systemLog.created_at).format(
                                  "MM/DD/YYYY hh:mm a"
                                )
                              : "N/A"}
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                          <div>
                            {systemLog?.description
                              ? systemLog.description
                              : "N/A"}
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          <div className="flex items-center gap-3">
                            <span
                              className="flex items-center cursor-pointer"
                              onClick={() => openSystemLogModal(systemLog.id)}
                            >
                              <Lucide
                                icon="Eye"
                                className="w-[1.15rem] h-[1.15rem] text-blue-600"
                              />
                            </span>
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                </Table.Tbody>
              </Table>
            </div>
            {systemLogsState.systemLogs.length === 0 && (
              <h1
                className={`text-center mt-10 text-2xl font-medium ${
                  systemLogsState.loading ? "text-inherit" : "text-[#8b8a8a]"
                }`}
              >
                No data to display...
              </h1>
            )}
            {/* END: Data List */}
            {/* BEGIN: Pagination */}
            {systemLogsState.systemLogs.length > 0 && (
              <div className="flex flex-wrap items-center justify-between col-span-12 mt-5 gap-5 intro-y sm:flex-row mb-10">
                <div className="w-full sm:w-auto flex flex-wrap gap-2 sm:gap-5 sm:mr-auto">
                  <Button
                    variant={darkMode ? "outline-secondary" : "soft-secondary"}
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
                            darkMode ? "outline-secondary" : "soft-secondary"
                          }
                          className={`${
                            currentPageNumber === currentPage
                              ? "!box font-medium dark:bg-darkmode-400"
                              : ""
                          } px-[0.9rem]`}
                          onClick={() => handlePageChange(currentPageNumber)}
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
                    variant={darkMode ? "outline-secondary" : "soft-secondary"}
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <Lucide icon="ChevronsRight" className="w-4 h-4" />
                  </Button>
                </div>
                <h1>
                  Total Records -{" "}
                  <span className="font-semibold">
                    {systemLogsState.totalRecords}
                  </span>
                </h1>
                <FormSelect
                  className="w-20 !box"
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

      <Dialog
        open={systemLogModal}
        onClose={() => setSystemLogModal(false)}
        maxWidth="sm"
        fullWidth
      >
        {systemLogData !== null ? (
          <DialogContent className="dark:bg-darkmode-600 dark:text-white">
            <div className="px-3 pt-3 text-center flex justify-between">
              <div className="text-2xl">System Log Details</div>
              <Lucide
                icon="X"
                className="cursor-pointer hover:text-white hover:bg-slate-500 hover:rounded-full -mt-3 p-1 w-[1.8rem] h-[1.8rem]"
                onClick={() => setSystemLogModal(false)}
              />
            </div>
            <div className="h-5 border-b-2 dark:border-slate-200"></div>
            <div className="mt-4 px-3 overflow-y-auto max-h-[350px]">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-2">
                  <strong>Module</strong>
                </div>
                <div className="col-span-1">:</div>
                <div className="col-span-9 info uppercase">
                  {systemLogData.module}
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 mt-2">
                <div className="col-span-2">
                  <strong>Type</strong>
                </div>
                <div className="col-span-1">:</div>
                <div className="col-span-9 info uppercase">
                  {systemLogData.type}
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 mt-2">
                <div className="col-span-2">
                  <strong>Log Time</strong>
                </div>
                <div className="col-span-1">:</div>
                <div className="col-span-9 info">
                  {moment(systemLogData.created_at).format(
                    "MM/DD/YYYY hh:mm a"
                  )}
                </div>
              </div>
              <h5 className="mt-6 mb-2">Description:</h5>
              <div className="box dark:border-slate-200 dark:bg-white p-4 rounded-lg">
                <div className="overflow-y-auto">
                  <p className="whitespace-pre-wrap dark:text-gray-600">
                    {systemLogData?.description
                      ? systemLogData.description
                      : "--"}
                  </p>
                </div>
              </div>
              <h5 className="mt-4 mb-2">New Values:</h5>
              <div className="box dark:border-slate-200 dark:bg-white p-4 rounded-lg">
                <div className="overflow-y-auto">
                  <pre className="whitespace-pre-wrap dark:text-gray-600">
                    {systemLogData?.new_values
                      ? systemLogData.new_values
                      : "--"}
                  </pre>
                </div>
              </div>
              <h5 className="mt-4 mb-2">Old Values:</h5>
              <div className="box dark:border-slate-200 dark:bg-white p-4 rounded-lg">
                <div className="overflow-y-auto">
                  <pre className="whitespace-pre-wrap dark:text-gray-600">
                    {systemLogData?.old_values
                      ? systemLogData.old_values
                      : "--"}
                  </pre>
                </div>
              </div>
              <h5 className="mt-4 mb-2">Response Body:</h5>
              <div className="box dark:border-slate-200 dark:bg-white p-4 rounded-lg">
                <div className="overflow-y-auto">
                  <pre className="whitespace-pre-wrap dark:text-gray-600">
                    {systemLogData?.res_body ? systemLogData.res_body : "--"}
                  </pre>
                </div>
              </div>
            </div>
            <div className="px-5 mt-5 text-end">
              <Button
                variant="linkedin"
                type="button"
                onClick={() => {
                  setSystemLogModal(false);
                }}
                className="w-20"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        ) : (
          <DialogContent className="dark:bg-darkmode-600 dark:text-white">
            <Loader icon="puff" />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default SystemLogs;
