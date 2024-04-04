import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import Table from "../../base-components/Table";
import Lucide from "../../base-components/Lucide";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import AddContact from "../../components/Contact/addContactData";
import EditContact from "../../components/Contact/editContactData";
import { API_PATH, getImageSource } from "../../api-services/apiPath";
import { getAuthHeaders } from "../../utils/helper";
import { LoadingSpinner } from "../../helper";

const Index: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [addModal, setAddModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [selectedEditId, setSelectedEditId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [dataLimit, setdataLimit] = useState(10);
  const startIndex = (currentPage - 1) * dataLimit + 1;
  const [autoId, setAutoId] = useState(1);
  const [formLoader, setFormLoader] = useState(false);

  const openEditModal = (id: string) => {
    setSelectedEditId(id);
    setEditModal(true);
  };
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setFormLoader(true);

    try {
      const response = await axios.get(`${API_PATH.GET_CONTACTS}`, {
        headers: getAuthHeaders(),
      });
      const resposneData = response.data;
      setContacts(resposneData);
      setFormLoader(false);
      return;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setFormLoader(false);

      throw error;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await axios.delete(`${API_PATH.DELETE_CONTACT_DETAILS}/${id}`, {
        headers: getAuthHeaders(),
      });
      toast.success("Contact deleted successfully!");
      // Refresh the contact list after deleting
      fetchContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact. Please try again later.");
    }
  };
  const refreshCategoryList = () => {
    fetchContacts();
  };

  return (
    <>
      <div>
        <PageHeader HeaderText="Contact List" to="/contact" />
        {/* <div className="flex px-2 flex-wrap gap-5 justify-between mt-5">
          <Button
            variant="primary"
            className="mb-2 ml-auto sm:text-sm text-xs"
            onClick={() => setAddModal(true)}
          >
            <Lucide icon="PlusCircle" className="mr-2 w-5" /> Add Contact Data
          </Button>
        </div> */}
        {formLoader ? (
          <LoadingSpinner />
        ) : (
          <div className="mt-14">
            <>
              <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
                <Table className="border-spacing-y-[10px] border-separate -mt-2">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        #
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Banner Image
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Location
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Email
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Phone No
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Action
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {contacts.map((contact, index) => (
                      <Table.Tr key={contact._id}>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          {startIndex + index}
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          <img
                            src={getImageSource(contact.path)}
                            alt="Banner"
                            className="w-15 h-14"
                          />
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          {contact.location}
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          {contact.email}
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          {contact.phone}
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          <div className="flex items-center gap-5">
                            <span
                              className="flex items-center cursor-pointer"
                              onClick={() => openEditModal(contact._id)}
                            >
                              <Lucide
                                icon="Edit"
                                className="w-5 h-5 text-blue-600"
                              />
                            </span>
                            {/* <span>
                              <Lucide
                                icon="Trash2"
                                className="w-4 h-4 text-red-500 cursor-pointer"
                                onClick={() => deleteContact(contact._id)}
                              />
                            </span> */}
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </>
          </div>
        )}
        <AddContact
          addModal={addModal}
          setAddModal={setAddModal}
          refreshCategoryList={refreshCategoryList}
        />
        <EditContact
          editModal={editModal}
          setEditModal={setEditModal}
          editModalId={selectedEditId}
          refreshCategoryList={refreshCategoryList}
        />
      </div>
    </>
  );
};

export default Index;
