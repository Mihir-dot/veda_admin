import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import Table from "../../base-components/Table";
import Lucide from "../../base-components/Lucide";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { API_PATH } from "../api-services/apiPath"
import { API_PATH } from "../../api-services/apiPath.js";
import { formatCreatedAt, getAuthHeaders } from "../../utils/helper";
import TomSelect from "../../base-components/TomSelect";
import { FormInput, FormSelect, FormSwitch } from "../../base-components/Form";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const filterList = [
    { label: "Active", value: "active" },
    { label: "Deactive", value: "deactive" },
    { label: "All", value: "all" },
];
interface Support {
    id: string;
    name: string;
    title: string,
    active: boolean,
    description: string,
    created_at: string
}
const index: React.FC = () => {
    const [support, setSupport] = useState<Support[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(2);
    const [dataLimit, setdataLimit] = useState(10);
    const [status, setStatus] = useState("active");
    const [autoId, setAutoId] = useState(1);
    const startIndex = (currentPage - 1) * dataLimit + 1;
    const [formLoader, setFormLoader] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        getData();
    }, [currentPage, dataLimit, status, searchInput]);

    const getData = async () => {
        setFormLoader(true)
        try {
            const response = await axios.post(`http://64.227.172.121:6009/driver007/getAllCms`, {
                page: currentPage,
                limit: dataLimit,
                status: status !== "all" ? (status === "active" ? true : false) : null,
                search: searchInput
            }, {
                headers: getAuthHeaders()
            }
            )
            if (response.data.statusCode === 200) {
                console.log("response---", response)
                setSupport(response.data.data.cms);
                setFormLoader(false)
                setTotalPages(Math.ceil(response.data.data.totalRecords / dataLimit));
                if (currentPage === 1) {
                    setAutoId((currentPage - 1) * dataLimit + 1);
                }
            } else {
                setFormLoader(false)
                setSupport([]);
            }
        } catch (error) {
            console.log("error", error);
        }
    }
    const handleSelectChange = (selectedOption: string) => {
        setStatus(selectedOption);
        setCurrentPage(1);
    };
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchInput(newSearchTerm);
        setCurrentPage(1);
    }
    const clearSearchInput = () => {
        setSearchInput("");
    };
    const handleDataLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(e.target.value, 10);
        setdataLimit(newLimit);
        setCurrentPage(1);
    };
    const updateExercise = (id: string) => {
        console.log("id----", id)
        localStorage.setItem("supports", id);
        navigate("/cms-management/add-cms");
    };
    const activateDeactivate = (event: React.ChangeEvent<HTMLInputElement>, dataId: string) => {
        const status = event.target.checked;
        Swal.fire({
            title: `${status ? "Activate" : "Deactivate"} CMS?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: `Yes, ${status ? "Activate" : "Deactivate"} it!`,
            customClass: {
                icon: 'custom-warning-icon',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post(`http://64.227.172.121:6009/driver007/activeInactiveCms`, {
                        id: dataId,
                        status: status,
                    }, {
                        headers: getAuthHeaders()
                    })
                    .then((res) => {
                        Swal.fire({
                            icon: 'success',
                            title: res.data.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        getData();

                    })
                    .catch((e) => {
                        toast.error("Something Went Wrong");
                    });
            }
        });
    };
    const deleteCms = (dataId: string) => {
        Swal.fire({
            title: "Delete CMS ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, Delete it!",
            customClass: {
                icon: 'custom-warning-icon',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post(`http://64.227.172.121:6009/driver007/deleteCms`, {
                        id: dataId,
                    }, {
                        headers: getAuthHeaders()
                    })
                    .then((res) => {
                        Swal.fire({
                            icon: 'success',
                            title: res.data.message,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        getData();
                    })
                    .catch((e) => {
                        toast.error("Something Went Wrong");
                    });
            }
        });
    };

    function openPlainTextTab(plainText: any) {
        const newTab = window.open();
        newTab.document.open();
        newTab.document.write('<pre>' + plainText + '</pre>');
        newTab.document.close();
    }
    const viewHtmlContent = (htmlContent: any) => {
        openPlainTextTab(htmlContent);
    };

    return (
        <>
            <div>
                {/* <PageHeader HeaderText="Support" to="/user" /> */}
                <div className="flex px-2 flex-wrap gap-5 justify-between mt-5">
                    <div className="w-32">
                        <TomSelect
                            name="accountsStatus"
                            onChange={handleSelectChange}
                            value={status}
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
                                placeholder="Search by Name..."
                                value={searchInput}
                                onChange={handleSearchInputChange}
                            />
                            {searchInput ? null : ( // Only display the search icon when there's no text
                                <Lucide
                                    icon="Search"
                                    className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                                />
                            )}
                            {searchInput && ( // Display the cross icon when there's text
                                <span
                                    className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3 cursor-pointer"
                                    onClick={clearSearchInput}
                                >
                                    &#x2715; {/* Cross icon (×) */}
                                </span>
                            )}
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        className="mb-2 mr-2 sm:text-sm text-xs"
                        onClick={() => {

                            navigate("/cms-management/add-cms")
                        }}


                    >
                        <Lucide icon="PlusCircle" className="mr-2 w-5" /> Add CMS
                    </Button>
                </div>
                {/* {formLoader ? <LoadingSpinner /> : ( */}
                {(
                    <div className="mt-3">
                        <>
                            <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
                                <Table className="border-spacing-y-[10px] border-separate -mt-2">
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th className="border-b-0 whitespace-nowrap">
                                                #
                                            </Table.Th>
                                            <Table.Th className="border-b-0 whitespace-nowrap">
                                                Name
                                            </Table.Th>
                                            <Table.Th className="border-b-0 whitespace-nowrap">
                                                Title
                                            </Table.Th>
                                            <Table.Th className="border-b-0 whitespace-nowrap">
                                                Created At
                                            </Table.Th>
                                            <Table.Th className="border-b-0 whitespace-nowrap">
                                                Status
                                            </Table.Th>
                                            <Table.Th className="border-b-0 whitespace-nowrap">Action</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    {support?.map((data, idx) => (
                                        <Table.Tbody>
                                            <Table.Tr className="intro-x">
                                                <Table.Td className="font-bold first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                    {startIndex + idx}
                                                </Table.Td>
                                                <Table.Td className="font-bold first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                    {data.name}
                                                </Table.Td>
                                                <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                    {data.title}
                                                </Table.Td>
                                                <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                    {formatCreatedAt(data.created_at)}
                                                </Table.Td>
                                                <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                                                    <div className="flex items-center">
                                                        <FormSwitch>
                                                            <FormSwitch.Input
                                                                id={`${data.id}`}
                                                                type="checkbox"
                                                                checked={data.active}
                                                                onChange={(e) =>
                                                                    activateDeactivate(e, data.id)
                                                                }

                                                                style={{
                                                                    width: '37px',
                                                                    height: '22px',
                                                                }}
                                                            />

                                                        </FormSwitch>
                                                    </div>
                                                </Table.Td>
                                                <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex items-center cursor-pointer">
                                                            <Lucide icon="Eye" className="w-4 h-4 text-green-600" onClick={() => viewHtmlContent(data.description)} />
                                                        </span>
                                                        <span className="flex items-center cursor-pointer">
                                                            <Lucide icon="Edit" className="w-4 h-4 text-blue-500" onClick={() => updateExercise(data.id)} />
                                                        </span>
                                                        <span className="flex items-center cursor-pointer">
                                                            <Lucide icon="Trash2" className="w-4 h-4 text-red-500" onClick={() => deleteCms(data.id)} />
                                                        </span>
                                                    </div>
                                                </Table.Td>

                                            </Table.Tr>

                                        </Table.Tbody>
                                    ))}
                                </Table>
                            </div>
                        </>
                        {support.length === 0 && (
                            <h1
                                className={`text-center mt-10 text-2xl font-medium text-[#8b8a8a]
                  }`}
                            >
                                No data to display...
                            </h1>
                        )}

                        <div className="flex flex-wrap items-center justify-between col-span-12 mt-5 gap-5 intro-y sm:flex-row mb-10">
                            {/* Pagination buttons */}
                            <div className="flex flex-wrap gap-2 sm:gap-5 sm:mr-auto ml-9">
                                <Button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                                </Button>

                                {currentPage > 1 && (
                                    <Button onClick={() => setCurrentPage(currentPage - 1)}>
                                        <Lucide icon="ChevronLeft" className="w-4 h-4" />
                                    </Button>
                                )}

                                {Array.from({ length: totalPages }).map((_, index) => {
                                    const currentPageNumber = index + 1;

                                    const shouldDisplay =
                                        currentPageNumber <= 2 ||
                                        currentPageNumber > totalPages - 2 ||
                                        (currentPageNumber >= currentPage - 1 &&
                                            currentPageNumber <= currentPage + 1);

                                    if (shouldDisplay) {
                                        return (
                                            <Button
                                                key={index}
                                                onClick={() => setCurrentPage(currentPageNumber)}
                                                className={`${currentPageNumber === currentPage
                                                    ? "!box font-medium dark:bg-darkmode-400"
                                                    : ""
                                                    } px-[0.9rem]`}
                                            >
                                                {currentPageNumber}
                                            </Button>
                                        );
                                    }

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

                                    return null;
                                })}

                                {currentPage < totalPages && (
                                    <Button onClick={() => setCurrentPage(currentPage + 1)}>
                                        <Lucide icon="ChevronRight" className="w-4 h-4" />
                                    </Button>
                                )}

                                <Button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    <Lucide icon="ChevronsRight" className="w-4 h-4" />
                                </Button>
                            </div>
                            <h1>
                                Total Records -{" "}
                                <span className="font-semibold">{support.length}</span>

                            </h1>
                            <FormSelect
                                className="w-20 !box mr-10"
                                value={dataLimit}
                                onChange={handleDataLimitChange}
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </FormSelect>
                        </div>

                    </div>
                )}
            </div>
        </>
    );
};

export default index;
