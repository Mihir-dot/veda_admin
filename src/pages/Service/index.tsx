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
import {getImageSource} from "../../api-services/apiPath"

const index: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [dataLimit, setdataLimit] = useState(10);
  const [autoId, setAutoId] = useState(1);
  const startIndex = (currentPage - 1) * dataLimit + 1;
  const [service, setService] = useState<any[]>([]);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/get/allservices",
        { headers: getAuthHeaders() }
      );
      if (response.data) {
        setService(response.data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (serviceId: string,) => {
    localStorage.setItem('newServiceAdded',serviceId);
    navigate('/service/manage-service');
  };

  return (
    <>
      <div>
        <PageHeader HeaderText="Service List" to="/service" />
        <div className="flex px-2 flex-wrap gap-5 justify-between mt-5">
          <Button
            variant="primary"
            className="mb-2 ml-auto sm:text-sm text-xs"
            onClick={() => navigate("/service/manage-service")}
          >
            <Lucide icon="PlusCircle" className="mr-2 w-5" /> Add Service
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
                        Banner
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Image
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Name
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Title
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Sub Title
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Action
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {service.map((service, index) => (
                      <Table.Tr key={service._id}>
                        <Table.Td>{startIndex + index}</Table.Td>
                        <Table.Td>
                          <img
                            src={getImageSource(service.bannerLocation)}
                            alt="Banner"
                            className="w-10 h-10"
                          />
                        </Table.Td>
                        <Table.Td>
                          <img
                            src={getImageSource(service.imageLocation)}
                            alt="image"
                            className="w-10 h-10"
                          />
                        </Table.Td>
                        <Table.Td>{service.name}</Table.Td>
                        <Table.Td>{service.titleOne}</Table.Td>
                        <Table.Td>{service.titleTwo}</Table.Td>
                        <Table.Td>
                          <span>
                            <Lucide
                              icon="Edit"
                              className="w-4 h-4 text-blue-500 cursor-pointer"
                              onClick={() => handleEditClick(service._id)}
                            />
                          </span>
                          <span>
                          <Lucide
                            icon="Delete"
                            className="w-4 h-4 text-red-500 cursor-pointer"
                            // onClick={() => deleteContact(contact._id)}

                          />
                          </span>
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
