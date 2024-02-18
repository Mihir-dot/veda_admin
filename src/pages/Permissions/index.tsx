import React, { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import Table from "../../base-components/Table";
import Lucide from "../../base-components/Lucide";
import clsx from "clsx";
import Button from "../../base-components/Button";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { fetchAllRoles, getRolesData } from "../../stores/manageRole";
import PermissionsModal from "../../components/Permissions/PermissionsModal";
import AddRoleModal from "../../components/Permissions/AddRoleModal";
import EditRoleModal from "../../components/Permissions/EditRoleModal";
import Tippy from "../../base-components/Tippy";
import { SUPER_ADMIN } from "../../utils/constants";

const index: React.FC = () => {
  const [permissionModal, setPermissionModal] = useState<boolean>(false);
  const [addModal, setAddModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedEditRoleId, setSelectedEditRoleId] = useState<number | null>(
    null
  );
  const dispatch = useAppDispatch();
  const { roles }: any = useAppSelector(getRolesData);

  const filterRoles: [] = roles?.filter(
    (role: any) => role.role_name !== SUPER_ADMIN
  );

  const openPermissionModal = (id: number) => {
    setSelectedRoleId(id);
    setPermissionModal(true);
  };

  const openEditModal = (id: number) => {
    setSelectedEditRoleId(id);
    setEditModal(true);
  };

  useEffect(() => {
    dispatch(fetchAllRoles());
  }, []);

  return (
    <div>
      <PageHeader HeaderText="Permissions" to="/permissions" />

      <div className="flex gap-5 mt-5 justify-end px-2">
        <Button
          variant="primary"
          className="py-[0.35rem] sm:text-sm text-xs"
          onClick={() => setAddModal(true)}
        >
          <Lucide icon="PlusCircle" className="mr-2 w-5" /> Add Role
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
                  Role Name
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
              {filterRoles?.map((role: any) => (
                <Table.Tr key={role.id} className="intro-x">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {role.id}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md uppercase last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <Tippy
                      as="div"
                      className="flex items-center cursor-pointer"
                      content={
                        role.role_description || role.role_name?.toUpperCase()
                      }
                    >
                      <p className="cursor-pointer">{role.role_name}</p>
                    </Tippy>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div
                      className={clsx({
                        "flex items-center": true,
                        "text-success": role.enable === 1,
                        "text-danger": role.enable === 0,
                      })}
                    >
                      <Lucide
                        icon={role.enable === 1 ? "CheckSquare" : "XSquare"}
                        className="w-4 h-4 mr-2"
                      />
                      {role.enable === 1 ? "Active" : "Inactive"}
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <div className="flex items-center gap-5">
                      <span
                        className="flex items-center cursor-pointer"
                        onClick={() => openPermissionModal(role.id)}
                      >
                        <Lucide icon="Eye" className="w-5 h-5 text-blue-600" />
                      </span>

                      <span
                        className="flex items-center cursor-pointer"
                        onClick={() => openEditModal(role.id)}
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

      <PermissionsModal
        permissionModal={permissionModal}
        setPermissionModal={setPermissionModal}
        selectedRoleId={selectedRoleId}
      />
      <AddRoleModal addModal={addModal} setAddModal={setAddModal} />
      <EditRoleModal
        editModal={editModal}
        setEditModal={setEditModal}
        editModalId={selectedEditRoleId}
      />
    </div>
  );
};

export default index;
