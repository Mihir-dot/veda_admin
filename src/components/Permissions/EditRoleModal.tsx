import React, { ChangeEvent, useEffect, useState } from "react";
import Button from "../../base-components/Button";
import { Dialog } from "../../base-components/Headless";
import {
  FormInput,
  FormLabel,
  FormSwitch,
  FormTextarea,
} from "../../base-components/Form";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import {
  fetchAllRoles,
  fetchSingleRole,
  getRolesData,
  updateSingleRole,
} from "../../stores/manageRole";
import Loader from "../Loader";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";

interface EditRoleProps {
  editModal: boolean;
  setEditModal: (role: boolean) => void;
  editModalId: number;
}

const initialState = {
  role_name: "",
  role_description: "",
};

type TextInputState = {
  role_name: string;
  role_description: string;
};

const EditRoleModal: React.FC<EditRoleProps> = ({
  editModal,
  setEditModal,
  editModalId,
}) => {
  const [formData, setFormData] = useState<TextInputState>({
    ...initialState,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [switchvalue, setSwitchValue] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState({ role_name: "" });
  const dispatch = useAppDispatch();
  const { role }: any = useAppSelector(getRolesData);

  useEffect(() => {
    if (editModal) {
      dispatch(fetchSingleRole(editModalId));
      if (formErrors.role_name) {
        delete formErrors.role_name;
      }
    }
  }, [editModal]);

  useEffect(() => {
    if (role !== null) {
      setFormData((prev) => ({
        ...prev,
        role_name: role?.role_name || "",
        role_description: role?.role_description || "",
      }));
      setSwitchValue(role?.enable === 0 ? false : true);
    }
  }, [role]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof TextInputState
  ) => {
    const { value } = event.target;
    const newFormErrors = {
      ...formErrors,
      [fieldName]: value.trim().length === 0 ? "Role Name is required" : "",
    };

    setFormErrors(newFormErrors);
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value.trimStart(),
    }));
  };

  const handleSwitchChange = () => {
    setSwitchValue(!switchvalue);
  };

  const handleCloseModal = () => {
    setEditModal(false);
    setFormData(initialState);
  };

  const submitInfo = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: { role_name: string } = {};
    if (!formData.role_name) {
      errors.role_name = "Role Name is required";
    } else if (formData.role_name.trim().length === 0) {
      errors.role_name = "Role Name cannot be whitespace only";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      if (formData.role_name !== "") {
        const payload = {
          ...formData,
          enable: switchvalue === true ? 1 : 0,
          id: editModalId,
        };
        setIsLoading(true);
        const res = await dispatch(updateSingleRole(payload));
        if (res.payload === undefined) {
          return toast.error("Something went wrong.");
        }
        toast.success(res.payload.message || "Role updated");
        await dispatch(fetchAllRoles());
        handleCloseModal();
      }
    } catch (error) {
      console.log("Er--", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={editModal} onClose={handleCloseModal} staticBackdrop>
        <Dialog.Panel>
          <div className="px-5 py-3 text-center">
            <div className="text-3xl mt-5">Edit Role</div>
          </div>
          {role !== null ? (
            <form
              className="grid grid-cols-12 gap-4 mt-5 gap-y-5 px-5 pb-5"
              onSubmit={submitInfo}
            >
              <div className="col-span-12 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">Role Name</FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="role_name"
                  value={formData.role_name}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "role_name")
                  }
                  required
                  disabled
                  placeholder="Role Name"
                />
                {formErrors.role_name && (
                  <div className="mt-2 text-danger w-52">
                    {typeof formErrors.role_name === "string" &&
                      formErrors.role_name}
                  </div>
                )}
              </div>
              <div className="flex items-center ml-7 gap-5 mt-7">
                <FormLabel htmlFor="input-wizard-2" className="mt-2">
                  Enable
                </FormLabel>
                <FormSwitch>
                  <FormSwitch.Input
                    id="checkbox-switch-1"
                    type="checkbox"
                    checked={switchvalue}
                    onChange={handleSwitchChange}
                  />
                </FormSwitch>
              </div>
              <div className="col-span-12 intro-y">
                <FormLabel htmlFor="input-wizard-3">Role Description</FormLabel>
                <FormTextarea
                  id="input-wizard-3"
                  name="role_description"
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "role_description")
                  }
                  placeholder="Enter Description For Role"
                  value={formData.role_description}
                />
              </div>
              <div className="flex items-center gap-3 justify-end col-span-12 mt-5">
                <Button
                  variant="instagram"
                  type="button"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={formErrors.role_name ? true : false}
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
                    "Update Role"
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <Loader icon="puff" />
          )}
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default EditRoleModal;
