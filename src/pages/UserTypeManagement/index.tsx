import React, { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import Table from "../../base-components/Table";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { fetchUserTypeList, getUserTypeData } from "../../stores/usertype";
import clsx from "clsx";
import AddUserTypeModal from "../../components/UserTypeManagement/AddUserTypeModal";
import EditUserTypeModal from "../../components/UserTypeManagement/EditUserTypeModal";

const index: React.FC = () => {
  const [addModal, setAddModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [selectedEditUserId, setSelectedEditUserId] = useState<number | null>(
    null
  );
  const dispatch = useAppDispatch();
  const usertypeList: [] = useAppSelector(getUserTypeData);

  useEffect(() => {
    dispatch(fetchUserTypeList());
  }, []);

  const openEditModal = (id: number) => {
    setSelectedEditUserId(id);
    setEditModal(true);
  };

  return (
    <div>
      <PageHeader HeaderText="Usertype" to="/usertype" />
      <div className="flex gap-5 mt-5 justify-end px-2">
        <Button
          variant="primary"
          className="py-[0.35rem] sm:text-sm text-xs"
          onClick={() => setAddModal(true)}
        >
          <Lucide icon="PlusCircle" className="mr-2 w-5" /> Add Usertype
        </Button>
      </div>

      <div className="mt-3">
        {/* BEGIN: Data List */}
        <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
          <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="border-b-0 whitespace-nowrap">#</Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Type
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Status
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Action
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {usertypeList?.map((usertype: any) => (
                <Table.Tr key={usertype.id} className="intro-x">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {usertype.id}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md uppercase last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {usertype?.type ? usertype.type : "N/A"}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div
                      className={clsx({
                        "flex items-center": true,
                        "text-success": usertype.enable === 1,
                        "text-danger": usertype.enable === 0,
                      })}
                    >
                      <Lucide
                        icon={usertype.enable === 1 ? "CheckSquare" : "XSquare"}
                        className="w-4 h-4 mr-2"
                      />
                      {usertype.enable === 1 ? "Active" : "Inactive"}
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <div className="flex items-center gap-5">
                      <span
                        className="flex items-center cursor-pointer"
                        onClick={() => openEditModal(usertype.id)}
                      >
                        <Lucide icon="Edit" className="w-4 h-4 text-blue-600" />
                      </span>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </div>

      <AddUserTypeModal addModal={addModal} setAddModal={setAddModal} />
      <EditUserTypeModal
        editModal={editModal}
        setEditModal={setEditModal}
        editModalId={selectedEditUserId}
      />
    </div>
  );
};

export default index;
