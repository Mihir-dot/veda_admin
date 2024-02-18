import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import Table from "../../base-components/Table";
import Lucide from "../../base-components/Lucide";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatCreatedAt, getAuthHeaders } from "../../utils/helper";
import TomSelect from "../../base-components/TomSelect";
import { FormInput, FormSelect, FormSwitch } from "../../base-components/Form";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import AddContact from "../../components/Contact/addContactData";
import EditContact from "../../components/Contact/editContactData";
import UserContactDetails from "./userContactDetails";

const index: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [dataLimit, setdataLimit] = useState(10);
  const [status, setStatus] = useState("active");
  const [autoId, setAutoId] = useState(1);
  const startIndex = (currentPage - 1) * dataLimit + 1;
  const [formLoader, setFormLoader] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const openUserDetails = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };
  return (
    <>
      <div>
        <PageHeader HeaderText="User Contact List" to="/user-contact" />
      
        {/* {formLoader ? <LoadingSpinner /> : ( */}
        {
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
                        Email
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Phone No
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Created At
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Action
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr className="intro-x">
                      <Table.Td className="font-bold first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        1
                      </Table.Td>
                      <Table.Td className="font-bold first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                       Bhavisha
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        bhavisha123@gmail.com
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                       989898989
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                       2024-02-15
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center cursor-pointer"  onClick={() => openUserDetails()}>
                          <Lucide icon="Eye" className="w-4 h-4 text-green-600" />
                          </span>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </div>
            </>
             {/* Next page link */}
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
        }
    
        <UserContactDetails addModal={isModalOpen} setAddModal={setIsModalOpen} userId={selectedUserId} />
      </div>
    </>
  );
};

export default index;
