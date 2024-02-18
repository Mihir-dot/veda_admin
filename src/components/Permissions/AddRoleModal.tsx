import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Button from "../../base-components/Button";
import { Dialog } from "../../base-components/Headless";
import {
  FormInput,
  FormLabel,
  FormSwitch,
  FormTextarea,
} from "../../base-components/Form";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { addRole, fetchAllRoles } from "../../stores/manageRole";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";
import { toastMessage } from "../../stores/toastSlice";

interface AddRoleProps {
  addModal: boolean;
  setAddModal: (role: boolean) => void;
}

const initialState = {
  role_name: "",
  enable: true,
  role_description: "",
};

type TextInputState = {
  role_name: string;
  enable: boolean;
  role_description: string;
};

const AddRoleModal: React.FC<AddRoleProps> = ({ addModal, setAddModal }) => {
  const addRoleButtonRef = useRef(null);
  const [formData, setFormData] = useState<TextInputState>({
    ...initialState,
  });
  const toastMsg = useAppSelector(toastMessage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState({ role_name: "" });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (addModal && formErrors.role_name) {
      delete formErrors.role_name;
    }
  }, [addModal, formErrors.role_name]);

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

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setFormData((prevState) => ({ ...prevState, enable: checked }));
  };

  const handleCloseModal = () => {
    setAddModal(false);
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
      if (Object.keys(errors).length === 0) {
        setIsLoading(true);
        const payload = {
          ...formData,
          enable: formData.enable ? 1 : 0,
        };
        const res = await dispatch(addRole(payload));
        toast.success(res.payload.message || "Role created");
        await dispatch(fetchAllRoles());
        handleCloseModal();
      }
    } catch (error) {
      toast.error(toastMsg || "Something went wrong.");
      console.log("Error--", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={addModal}
        onClose={handleCloseModal}
        staticBackdrop
        initialFocus={addRoleButtonRef}
      >
        <Dialog.Panel>
          <div className="px-5 py-3 text-center">
            <div className="text-3xl mt-5">Add Role</div>
          </div>
          <form
            className="grid grid-cols-12 gap-4 mt-5 gap-y-5 px-5 pb-5"
            onSubmit={submitInfo}
          >
            <div className="col-span-12 intro-y sm:col-span-6">
              <FormLabel htmlFor="input-wizard-1">
                Role Name <span className="text-red-600 font-bold">*</span>
              </FormLabel>
              <FormInput
                id="input-wizard-1"
                type="text"
                name="role_name"
                className={clsx({
                  "border-danger": formErrors.role_name,
                })}
                onInput={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e, "role_name")
                }
                placeholder="Role Name"
                value={formData.role_name}
              />
              {formErrors.role_name && (
                <div className="mt-2 text-danger">
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
                  checked={formData.enable}
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
                ref={addRoleButtonRef}
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
                  "Add Role"
                )}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default AddRoleModal;
