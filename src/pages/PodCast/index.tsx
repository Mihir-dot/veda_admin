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

const index: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [dataLimit, setdataLimit] = useState(10);
  const [autoId, setAutoId] = useState(1);
  const startIndex = (currentPage - 1) * dataLimit + 1;
  const [podcast, setPodcast] = useState<any[]>([]);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_PATH.GET_PODCAST_DATA}`, {
        headers: getAuthHeaders(),
      });
      if (response.data) {
        setPodcast(response.data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (podcastId: string) => {
    localStorage.setItem("newPodcastAdded", podcastId);
    navigate("/podcast/manage-podcast");
  };

  const deleteContact = async (id: string) => {
    try {
      await axios.delete(`${API_PATH.DELETE_PODCAST_DETAILS}/${id}`);
      toast.success("Podcast Data deleted successfully!");
      // Refresh the contact list after deleting
      fetchData();
    } catch (error) {
      console.error("Error deleting podcast:", error);
      toast.error("Failed to delete podcast. Please try again later.");
    }
  };
  return (
    <>
      <div>
        <PageHeader HeaderText="Podcast Page" to="/podcast" />
        <div className="flex px-2 flex-wrap gap-5 justify-between mt-5">
          <Button
            variant="primary"
            className="mb-2 ml-auto sm:text-sm text-xs"
            onClick={() => navigate("/podcast/manage-podcast")}
          >
            <Lucide icon="PlusCircle" className="mr-2 w-5" /> Add Podcast
            Details
          </Button>
        </div>
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
                        Image
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Name
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
                    {podcast.map((podcast, index) => (
                      <Table.Tr key={podcast._id}>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          {startIndex + index}
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          <img
                            src={getImageSource(podcast.pictureLocation)}
                            alt="Banner"
                            className="w-15 h-14"
                          />
                        </Table.Td>

                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          {podcast.name}
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          <a
                            href={podcast.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600"
                          >
                            {podcast.link}
                          </a>
                        </Table.Td>

                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          <div className="flex items-center gap-5">
                            <span
                              className="flex items-center cursor-pointer"
                              onClick={() => handleEditClick(podcast._id)}
                            >
                              <Lucide
                                icon="Edit"
                                className="w-5 h-5 text-blue-600"
                              />
                            </span>
                            <span>
                              <Lucide
                                icon="Trash2"
                                className="w-4 h-4 text-red-500 cursor-pointer"
                                onClick={() => deleteContact(podcast._id)}
                              />
                            </span>
                          </div>
                        </Table.Td>
                      </Table.Tr>
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
      </div>
    </>
  );
};

export default index;
