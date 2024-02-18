import React, { useRef, useEffect, useState, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { addUserType, fetchUserTypeList } from "../../stores/usertype";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { toastMessage } from "../../stores/toastSlice";
import { Dialog } from "../../base-components/Headless";
import { FormInput, FormLabel, FormSwitch } from "../../base-components/Form";
import clsx from "clsx";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";

interface AddModalProps {
  addModal: boolean;
  setAddModal: (role: boolean) => void;
}

const initialState = {
  type: "",
  enable: true,
};

type TextInputState = {
  type: string;
  enable: boolean;
};

const AddUserTypeModal: React.FC<AddModalProps> = ({
  addModal,
  setAddModal,
}) => {
  const addRoleButtonRef = useRef(null);
  const [formData, setFormData] = useState<TextInputState>({
    ...initialState,
  });
  const toastMsg = useAppSelector(toastMessage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState({ type: "" });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (addModal && formErrors.type) {
      delete formErrors.type;
    }
  }, [addModal, formErrors.type]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof TextInputState
  ) => {
    const { value } = event.target;
    const newFormErrors = {
      ...formErrors,
      [fieldName]: value.trim().length === 0 ? "User Type is required" : "",
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
    const errors: { type: string } = { type: "" };
    if (!formData.type) {
      errors.type = "User Type is required";
    } else if (formData.type.trim().length === 0) {
      errors.type = "User Type cannot be whitespace only";
    }
    if (errors.type !== "") {
      setFormErrors(errors);
      return;
    }
    try {
      setIsLoading(true);
      const payload = {
        ...formData,
        enable: formData.enable ? 1 : 0,
      };
      const res = await dispatch(addUserType(payload));
      toast.success(res.payload.message || "User type created succesfully");
      await dispatch(fetchUserTypeList());
      handleCloseModal();
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
            <div className="text-3xl mt-5">Add User Type</div>
          </div>
          <form
            className="grid grid-cols-12 gap-4 mt-5 gap-y-5 px-5 pb-5"
            onSubmit={submitInfo}
          >
            <div className="col-span-12 intro-y sm:col-span-6">
              <FormLabel htmlFor="input-wizard-1">
                User Type <span className="text-red-600 font-bold">*</span>
              </FormLabel>
              <FormInput
                id="input-wizard-1"
                type="text"
                name="type"
                className={clsx({
                  "border-danger": formErrors.type,
                })}
                onInput={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e, "type")
                }
                placeholder="User Type"
                value={formData.type}
              />
              {formErrors.type && (
                <div className="mt-2 text-danger">
                  {typeof formErrors.type === "string" && formErrors.type}
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
                disabled={formErrors.type ? true : false}
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
                  "Add User Type"
                )}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default AddUserTypeModal;
