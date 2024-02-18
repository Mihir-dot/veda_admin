import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "../../base-components/Headless";
import { FormCheck, FormLabel } from "../../base-components/Form";
import Table from "../../base-components/Table";
import Button from "../../base-components/Button";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import {
  fetchAllPermissions,
  fetchSingleModulePermission,
  getPermissionsData,
  getSomePermissionsData,
  updatePermission,
} from "../../stores/managePermission";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";
interface PermissionProps {
  permissionModal: boolean;
  setPermissionModal: (permission: boolean) => void;
  selectedRoleId: number;
}

const PermissionsModal: React.FC<PermissionProps> = ({
  permissionModal,
  setPermissionModal,
  selectedRoleId,
}) => {
  const [selectAllCheckboxes, setSelectAllCheckboxes] =
    useState<boolean>(false);
  const [permissionCheckboxes, setPermissionCheckboxes] = useState<{
    [moduleId: string]: {
      [permissionType: string]: boolean;
    };
  }>({});
  const [transformedObj, setTransformedObj] = useState<{
    [type: string]: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const permissionButtonRef = useRef(null);
  const dispatch = useAppDispatch();
  const permissionsArr: any = useAppSelector(getPermissionsData);
  const somePermissionArr: any = useAppSelector(getSomePermissionsData);

  useEffect(() => {
    if (permissionModal) {
      dispatch(fetchAllPermissions());
      dispatch(fetchSingleModulePermission(selectedRoleId));
    }
  }, [permissionModal]);

  useEffect(() => {
    if (somePermissionArr !== null) {
      // Prefill checkboxes based on perArr
      const prefillCheckboxes: {
        [moduleId: string]: {
          [permissionType: string]: boolean;
        };
      } = {};

      Object.keys(somePermissionArr).forEach((moduleKey) => {
        prefillCheckboxes[moduleKey] = {};

        Object.keys(somePermissionArr[moduleKey]).forEach((permissionType) => {
          prefillCheckboxes[moduleKey][permissionType] = true;
        });
      });

      setPermissionCheckboxes(prefillCheckboxes);

      // Check if all checkboxes are pre-filled
      const allCheckboxesPrefilled = Object.keys(permissionsArr).every(
        (moduleKey) =>
          Object.keys(permissionsArr[moduleKey]).every(
            (permissionType) => prefillCheckboxes[moduleKey]?.[permissionType]
          )
      );

      // Set the state of the "Select All" checkbox based on allCheckboxesPrefilled
      setSelectAllCheckboxes(allCheckboxesPrefilled);
    }
  }, [somePermissionArr]);

  const handleSelectAllCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target;

    const newPermissionCheckboxes: {
      [moduleId: string]: {
        [permissionType: string]: boolean;
      };
    } = {};

    for (const moduleKey of Object.keys(permissionsArr)) {
      newPermissionCheckboxes[moduleKey] = {};

      for (const permissionKey of Object.keys(permissionsArr[moduleKey])) {
        newPermissionCheckboxes[moduleKey][permissionKey] = checked;
      }
    }

    setSelectAllCheckboxes(checked);
    setPermissionCheckboxes(newPermissionCheckboxes);
    const transformedPermissionsObject = Object.keys(
      newPermissionCheckboxes
    ).reduce((result: any, module) => {
      const modulePermissions = newPermissionCheckboxes[module];
      Object.keys(modulePermissions).forEach((permType) => {
        if (modulePermissions[permType]) {
          result[permissionsArr[module][permType]] = true;
        }
      });
      return result;
    }, {});

    setTransformedObj(transformedPermissionsObject);
  };

  const handlePermissionCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    moduleId: string,
    permissionType: string
  ) => {
    const { checked } = event.target;

    const newPermissionCheckboxes = {
      ...permissionCheckboxes,
      [moduleId]: {
        ...permissionCheckboxes[moduleId],
        [permissionType]: checked,
      },
    };

    setPermissionCheckboxes(newPermissionCheckboxes);

    // Check if all checkboxes for the specific module are checked
    const allPermissionsChecked = Object.values(
      newPermissionCheckboxes[moduleId]
    ).every((value) => value);

    // If all permissions in the module are checked, set the "Select All" checkbox to checked
    // Otherwise, set it to unchecked
    setSelectAllCheckboxes(allPermissionsChecked ? selectAllCheckboxes : false);

    const transformedPermissionsObject = Object.keys(
      newPermissionCheckboxes
    ).reduce((result: any, module) => {
      const modulePermissions = newPermissionCheckboxes[module];
      Object.keys(modulePermissions).forEach((permType) => {
        if (modulePermissions[permType]) {
          result[permissionsArr[module][permType]] = true;
        }
      });
      return result;
    }, {});

    setTransformedObj(transformedPermissionsObject);
  };
  const updatePermissions = async () => {
    const payload: any = [];
    for (const outerKey in transformedObj) {
      payload.push(outerKey);
    }
    try {
      setIsLoading(true);
      const data = {
        role_id: selectedRoleId,
        permissions: payload,
      };
      const res = await dispatch(updatePermission(data));
      if (res.payload === undefined) {
        return toast.error("Something went wrong");
      }
      toast.success(res.payload.message || "Permission updated");
      setPermissionModal(false);
    } catch (error) {
      console.error("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={permissionModal}
        onClose={() => {
          setPermissionModal(false);
        }}
        size="lg"
        staticBackdrop
        initialFocus={permissionButtonRef}
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <div className="text-3xl mt-5">Permissions</div>
          </div>
          <div className="px-5">
            <FormLabel htmlFor="input-wizard-1">Select All</FormLabel>
            <FormCheck.Input
              className="border-slate-400 ml-3"
              type="checkbox"
              checked={selectAllCheckboxes}
              onChange={handleSelectAllCheckboxChange}
            />
          </div>
          <div className="col-span-12 overflow-auto intro-y lg:overflow-visible px-5">
            <Table className="border-spacing-y-[10px] border-separate">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    Module
                  </Table.Th>
                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    Permissions
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {permissionsArr !== null &&
                  Object.keys(permissionsArr).map((permission, index) => (
                    <Table.Tr key={index} className="intro-x">
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] capitalize">
                        {permission && permission.replace("_", " ")}
                      </Table.Td>
                      <Table.Td
                        className="first:rounded-l-md text-center last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                        key={index}
                      >
                        <div className="flex justify-between items-center">
                          {Object.keys(permissionsArr[permission]).map(
                            (permissionType) => (
                              <label
                                key={permissionType}
                                className="inline-flex items-center mb-1"
                              >
                                <span className="mr-2 capitalize">
                                  {permissionType}
                                </span>
                                <FormCheck.Input
                                  key={permissionType}
                                  className="border-slate-400"
                                  type="checkbox"
                                  checked={
                                    permissionCheckboxes[permission]?.[
                                      permissionType
                                    ] || false
                                  }
                                  onChange={(e) =>
                                    handlePermissionCheckboxChange(
                                      e,
                                      permission,
                                      permissionType
                                    )
                                  }
                                />
                              </label>
                            )
                          )}
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
              </Table.Tbody>
            </Table>
          </div>
          <div className="px-5 pb-8 mt-5 text-end">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => {
                setPermissionModal(false);
              }}
              className="w-24"
            >
              Cancel
            </Button>
            <Button
              variant="linkedin"
              type="button"
              className="ml-4"
              ref={permissionButtonRef}
              onClick={updatePermissions}
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
                "Update Permission"
              )}
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default PermissionsModal;
