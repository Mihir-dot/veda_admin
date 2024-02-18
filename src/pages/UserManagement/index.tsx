import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import PageHeader from "../../components/PageHeader";
import TomSelect from "../../base-components/TomSelect";
import { FormInput, FormSelect, FormSwitch } from "../../base-components/Form";
import Table from "../../base-components/Table";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { selectDarkMode } from "../../stores/darkModeSlice";
import { deleteUser, fetchAllUsersData, getUsersData } from "../../stores/user";
import { toast } from "react-toastify";
import { Dialog } from "../../base-components/Headless";
import LoadingIcon from "../../base-components/LoadingIcon";
import { checkPermission } from "../../utils/checkPermissions";
import moment from "moment";

const filterList = [
  { label: "Active", value: "active" },
  { label: "Deactive", value: "deactive" },
  { label: "All", value: "all" },
];

const index: React.FC = () => {
  const userState: any = useAppSelector(getUsersData);
  const itemsPerPageOptions: number[] = [10, 20, 50, 100];
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [limit, setLimit] = useState<number>(userState.limit);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [status, setStatus] = useState<boolean>(true);
  const [filterUser, setFilterUser] = useState<string>("active");
  const [hasViewPermission, setHasViewPermission] = useState<boolean>(false);
  const [hasAddPermission, setHasAddPermission] = useState<boolean>(false);
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(false);
  const [hasDeletePermission, setHasDeletePermission] =
    useState<boolean>(false);

  const totalPages: number = Math.ceil(
    userState.totalRecords / userState.limit
  );
  let startIndex: number = (currentPage - 1) * itemsPerPage;
  let endIndex: number = Math.min(
    startIndex + itemsPerPage,
    userState.users.length
  );

  const navigate = useNavigate();
  const darkMode = useAppSelector(selectDarkMode);
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState<string>("");
  const deleteButtonRef = useRef(null);

  if (endIndex - startIndex < itemsPerPage) {
    startIndex = Math.max(0, userState.users.length - itemsPerPage);
    endIndex = userState.users.length;
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedItems = [...userState.users].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  const displayedUser = sortedItems.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchUsers = async () => {
      const doesHaveViewPermission = await checkPermission(
        "user_management",
        "view"
      );
      const doesHaveAddPermission = await checkPermission(
        "user_management",
        "add"
      );
      const doesHaveDeletePermission = await checkPermission(
        "user_management",
        "delete"
      );
      const doesHaveEditPermission = await checkPermission(
        "user_management",
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
          fetchAllUsersData({
            limit,
            page: currentPage,
            searchText,
            enable: 1,
          })
        );
        console.log("data--", data);
      }
    };
    fetchUsers();
  }, [searchText]);

  const changeUserStatus = async (selectedValue: string) => {
    setFilterUser(selectedValue);
    const newLimit = itemsPerPage;
    setItemsPerPage(10);
    setLimit(newLimit);
    if (selectedValue === "active") {
      await dispatch(
        fetchAllUsersData({
          limit: 10,
          page: 1,
          searchText,
          enable: 1,
        })
      );
    } else if (selectedValue === "deactive") {
      await dispatch(
        fetchAllUsersData({
          limit: 10,
          page: 1,
          searchText,
          enable: 0,
        })
      );
    } else {
      await dispatch(fetchAllUsersData({ limit: 10, page: 1, searchText }));
    }
    setCurrentPage(1);
  };

  const changeStatus = () => {
    setStatus(!status);
    console.log(status);
  };

  const handlePageChange = async (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      if (filterUser === "all") {
        await dispatch(
          fetchAllUsersData({
            limit,
            page: pageNumber,
            searchText,
          })
        );
      } else if (filterUser === "active") {
        await dispatch(
          fetchAllUsersData({
            limit,
            page: pageNumber,
            searchText,
            enable: 1,
          })
        );
      } else {
        await dispatch(
          fetchAllUsersData({
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
    if (filterUser === "all") {
      await dispatch(
        fetchAllUsersData({
          limit: newItemsPerPage,
          page: 1,
          searchText,
        })
      );
    } else if (filterUser === "active") {
      await dispatch(
        fetchAllUsersData({
          limit: newItemsPerPage,
          page: 1,
          searchText,
          enable: 1,
        })
      );
    } else {
      await dispatch(
        fetchAllUsersData({
          limit: newItemsPerPage,
          page: 1,
          searchText,
          enable: 0,
        })
      );
    }
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const openDeleteUserModal = (id: number) => {
    setSelectedUserId(id);
    setDeleteUserModal(true);
  };

  const deleteSelectedUser = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(deleteUser(selectedUserId));
      if (res.payload.type === "Success") {
        toast.success(res.payload.message || "User deleted successfully.");
        dispatch(fetchAllUsersData({ limit, page: currentPage, searchText }));
        setDeleteUserModal(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log("Err-", error);
    } finally {
      setFilterUser("active");
      setIsLoading(false);
    }
  };

  const updateUser = (id: number) => {
    localStorage.setItem("newlyAddedUser", String(id));
    navigate("/user/manage-user");
  };
  return (
    <>
      {hasViewPermission && (
        <div>
          <PageHeader HeaderText="User" to="/user" />
          <div className="flex px-2 flex-wrap gap-5 justify-between mt-5">
            <div className="w-32">
              <TomSelect
                name="userStatus"
                onChange={changeUserStatus}
                value={filterUser}
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
                  placeholder="Search by username or company name or account name..."
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
                className="mb-2 mr-2 sm:text-sm text-xs"
                onClick={() => navigate("/user/manage-user")}
              >
                <Lucide icon="PlusCircle" className="mr-2 w-5" /> Add New User
              </Button>
            )}
          </div>

          <div className="mt-3">
            {/* BEGIN: Data List */}
            {/* BEGIN: Data List */}
            {userState.loading ? (
              <div role="status" className="flex justify-center mt-10">
                <svg
                  aria-hidden="true"
                  className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-orange-600"
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
                          Name
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Company Name
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Account Name
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Last Login
                        </Table.Th>
                        {/* <Table.Th className="border-b-0 whitespace-nowrap">
                          Status
                        </Table.Th> */}
                        {(hasEditPermission || hasDeletePermission) && (
                          <Table.Th className="border-b-0 whitespace-nowrap">
                            Action
                          </Table.Th>
                        )}
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {displayedUser.map((user: any) => (
                        <Table.Tr key={user.id} className="intro-x">
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <span>{user.id}</span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            {user.name ? user.name : "N/A"}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            {user.company_detail === null
                              ? "N/A"
                              : user.company_detail?.name}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            {user.account_detail === null
                              ? "N/A"
                              : user.account_detail?.name}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <div className="flex items-center">
                              {user?.last_login
                                ? moment(user.last_login).format(
                                    "MM/DD/YYYY hh:mm a"
                                  )
                                : "N/A"}
                            </div>
                          </Table.Td>
                          {/* <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <div className="flex items-center">
                              <FormSwitch>
                                <FormSwitch.Input
                                  id="checkbox-switch-7"
                                  type="checkbox"
                                  onChange={changeStatus}
                                  checked={user.enable === 1 ? true : false}
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
                                    onClick={() => updateUser(user.id)}
                                  >
                                    <Lucide
                                      icon="Edit"
                                      className="w-[1.15rem] h-[1.15rem] text-blue-600"
                                    />
                                  </span>
                                )}

                                {hasDeletePermission && (
                                  <span
                                    className="flex items-center cursor-pointer"
                                    onClick={() => openDeleteUserModal(user.id)}
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
                {userState.users.length === 0 && (
                  <h1
                    className={`text-center mt-10 text-2xl font-medium ${
                      userState.loading ? "text-inherit" : "text-[#8b8a8a]"
                    }`}
                  >
                    No data to display...
                  </h1>
                )}
                {/* END: Data List */}
                {/* BEGIN: Pagination */}
                {userState.users.length > 0 && (
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
            open={deleteUserModal}
            onClose={() => {
              setDeleteUserModal(false);
            }}
            initialFocus={deleteButtonRef}
          >
            <Dialog.Panel>
              <div className="p-5 text-center">
                <div className="mt-5 text-xl">
                  Are you sure to delete this user?
                </div>
              </div>
              <div className="px-5 pb-8 text-center flex justify-end gap-5">
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => {
                    setDeleteUserModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  type="button"
                  ref={deleteButtonRef}
                  onClick={deleteSelectedUser}
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
                    "Delete User"
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
};

export default index;
