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
import { getImageSource, API_PATH } from "../../api-services/apiPath";
import EditSocialMedia from "../../components/SocialMedia/editSocialMedia";

const index: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [dataLimit, setdataLimit] = useState(10);
  const [autoId, setAutoId] = useState(1);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [selectedEditId, setSelectedEditId] = useState<string | null>(null);
  const startIndex = (currentPage - 1) * dataLimit + 1;
  const [socialMedia, setSocialMedia] = useState<any[]>([]);
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  console.log("platform--", editingPlatform);

  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_PATH.GET_SOCIAL_MEDIA}`, {
        headers: getAuthHeaders(),
      });
      if (response.data) {
        setSocialMedia(response.data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const deleteContact = async (id: string) => {
    try {
      await axios.delete(`${API_PATH.DELETE_SERVICE}/${id}`);
      toast.success("socialMedia deleted successfully!");
      // Refresh the contact list after deleting
      fetchData();
    } catch (error) {
      console.error("Error deleting socialMedia:", error);
      toast.error("Failed to delete socialMedia. Please try again later.");
    }
  };
  const refreshCategoryList = () => {
    fetchData();
  };

  const openEditModal = (id: string, platform: string) => {
    setSelectedEditId(id);
    setEditModal(true);
    setEditingPlatform(platform);
  };

  return (
    <>
      <div>
        <PageHeader HeaderText="Social Media List" to="/social-media" />

        {/* {formLoader ? <LoadingSpinner /> : ( */}
        {
          <div className="mt-3">
            <>
              <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
                <Table className="border-spacing-y-[10px] border-separate -mt-2">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Image
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Title
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Link
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Action
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {socialMedia.map((socialMedia, index) => (
                      <>
                        <Table.Tr key={socialMedia._id}>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <Lucide
                              icon="Facebook"
                              className="w-9 h-9 text-white bg-blue-900 rounded-full ml-5"
                              style={{ padding: "5px" }}
                            />
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400 font-semibold">
                            Facebook
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <a
                              href={socialMedia.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600"
                            >
                              {socialMedia.facebook}
                            </a>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <span
                              className="flex items-center cursor-pointer"
                              onClick={() =>
                                openEditModal(socialMedia._id, "facebook")
                              }
                            >
                              <Lucide
                                icon="Edit"
                                className="w-5 h-5 text-blue-600"
                              />
                            </span>
                          </Table.Td>
                        </Table.Tr>
                        <Table.Tr key={socialMedia._id}>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400 ">
                            <Lucide
                              icon="Twitter"
                              className="w-9 h-9 text-white bg-blue-400 rounded-full ml-5"
                              style={{ padding: "5px" }}
                            />
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400 font-semibold">
                            Twitter
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <a
                              href={socialMedia.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600"
                            >
                              {socialMedia.twitter}
                            </a>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <span
                              className="flex items-center cursor-pointer"
                              onClick={() =>
                                openEditModal(socialMedia._id, "twitter")
                              }
                            >
                              <Lucide
                                icon="Edit"
                                className="w-5 h-5 text-blue-600"
                              />
                            </span>
                          </Table.Td>
                        </Table.Tr>
                        <Table.Tr key={socialMedia._id}>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <Lucide
                              icon="Linkedin"
                              className="w-9 h-9 text-white bg-blue-600 rounded ml-5"
                              style={{ padding: "5px" }}
                            />
                          </Table.Td>

                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400 font-semibold">
                            Linkedin
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <a
                              href={socialMedia.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600"
                            >
                              {socialMedia.linkedin}
                            </a>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <span
                              className="flex items-center cursor-pointer"
                              onClick={() =>
                                openEditModal(socialMedia._id, "linkedin")
                              }
                            >
                              <Lucide
                                icon="Edit"
                                className="w-5 h-5 text-blue-600"
                              />
                            </span>
                          </Table.Td>
                        </Table.Tr>
                        <Table.Tr key={socialMedia._id}>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <Lucide
                              icon="Instagram"
                              className="w-9 h-9 text-white rounded ml-5"
                              style={{
                                padding: "5px",
                                background:
                                  "linear-gradient(115deg, rgb(249, 206, 52), rgb(238, 42, 123), rgb(98, 40, 215)) ",
                              }}
                            />
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400 font-semibold">
                            Instagram
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <a
                              href={socialMedia.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600"
                            >
                              {socialMedia.instagram}
                            </a>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <span
                              className="flex items-center cursor-pointer"
                              onClick={() =>
                                openEditModal(socialMedia._id, "instagram")
                              }
                            >
                              <Lucide
                                icon="Edit"
                                className="w-5 h-5 text-blue-600"
                              />
                            </span>
                          </Table.Td>
                        </Table.Tr>
                        <Table.Tr key={socialMedia._id}>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <Lucide
                              icon="Youtube"
                              className="w-9 h-9 text-white  rounded-full ml-5"
                              style={{ padding: "5px", background: "red" }}
                            />
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400 font-semibold">
                            Youtube
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <a
                              href={socialMedia.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600"
                            >
                              {socialMedia.youtube}
                            </a>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <span
                              className="flex items-center cursor-pointer"
                              onClick={() =>
                                openEditModal(socialMedia._id, "youtube")
                              }
                            >
                              <Lucide
                                icon="Edit"
                                className="w-5 h-5 text-blue-600"
                              />
                            </span>
                          </Table.Td>
                        </Table.Tr>
                      </>
                    ))}
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
        <EditSocialMedia
          editModal={editModal}
          setEditModal={setEditModal}
          editModalId={selectedEditId}
          refreshCategoryList={refreshCategoryList}
          editingPlatform={editingPlatform}
        />
      </div>
    </>
  );
};

export default index;
