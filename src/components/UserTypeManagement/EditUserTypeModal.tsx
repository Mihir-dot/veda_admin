import React, { useState, useEffect, ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import {
  editUserType,
  fetchSingleUserType,
  fetchUserTypeList,
  getSingleUserType,
} from "../../stores/usertype";
import { toast } from "react-toastify";
import { Dialog } from "../../base-components/Headless";
import { FormInput, FormLabel, FormSwitch } from "../../base-components/Form";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import Loader from "../Loader";

interface EditModalProps {
  editModal: boolean;
  setEditModal: (usertype: boolean) => void;
  editModalId: number;
}

const initialState = {
  type: "",
};

type TextInputState = {
  type: string;
};

const EditUserTypeModal: React.FC<EditModalProps> = ({
  editModal,
  setEditModal,
  editModalId,
}) => {
  const [formData, setFormData] = useState<TextInputState>({
    ...initialState,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [switchvalue, setSwitchValue] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState({ type: "" });
  const dispatch = useAppDispatch();
  const usertype: any = useAppSelector(getSingleUserType);

  useEffect(() => {
    if (editModal) {
      dispatch(fetchSingleUserType(editModalId));
      if (formErrors.type) {
        delete formErrors.type;
      }
    }
  }, [editModal]);

  useEffect(() => {
    if (usertype !== null) {
      setFormData((prev) => ({
        ...prev,
        type: usertype?.type || "",
      }));
      setSwitchValue(usertype?.enable === 0 ? false : true);
    }
  }, [usertype]);

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

  const handleSwitchChange = () => {
    setSwitchValue(!switchvalue);
  };

  const handleCloseModal = () => {
    setEditModal(false);
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
      if (formData.type !== "") {
        const payload = {
          ...formData,
          enable: switchvalue === true ? 1 : 0,
          id: editModalId,
        };
        setIsLoading(true);
        const res = await dispatch(editUserType(payload));
        if (res.payload === undefined) {
          return toast.error("Something went wrong.");
        }
        toast.success(res.payload.message || "User type list get succesfully");
        await dispatch(fetchUserTypeList());
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
            <div className="text-3xl mt-5">Edit User Type</div>
          </div>
          {usertype !== null ? (
            <form
              className="grid grid-cols-12 gap-4 mt-5 gap-y-5 px-5 pb-5"
              onSubmit={submitInfo}
            >
              <div className="col-span-12 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">User Type</FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="type"
                  value={formData.type}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "type")
                  }
                  required
                  disabled
                  placeholder="User Type"
                />
                {formErrors.type && (
                  <div className="mt-2 text-danger w-52">
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
                    checked={switchvalue}
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
                    "Update User Type"
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

export default EditUserTypeModal;
