import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { FormInput, FormLabel, FormSwitch } from "../../base-components/Form";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";
import { toastMessage } from "../../stores/toastSlice";
import { Dialog } from "../../base-components/Headless";
import axios from "axios";
import {API_PATH} from "../../api-services/apiPath"


interface AddContactProps {
  addModal: boolean;
  setAddModal: (role: boolean) => void;
  refreshCategoryList: () => void;
}

const initialState = {
  image:null,
  email: "",
  location: "",
  phone: "",
};

type TextInputState = {
  image: File | null
  email: string;
  location: string;
  phone: string;
};

const AddContact: React.FC<AddContactProps> = ({
  addModal,
  setAddModal,
  refreshCategoryList,
}) => {
  const addRoleButtonRef = useRef(null);
  const [formData, setFormData] = useState<TextInputState>({
    ...initialState,
  });
  console.log("formData-----",formData)
  const toastMsg = useAppSelector(toastMessage);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof TextInputState
  ) => {
    const { value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value.trimStart(),
    }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prevData) => ({
        ...prevData,
        image: file,
    }));
};

const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  setIsLoading(true);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found in localStorage");
    }

    const formDataToSend = new FormData();
    formDataToSend.append("image", formData.image);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);

    await axios.post(`${API_PATH.ADD_CONTACT}`, formDataToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Make sure to set the correct content type
      },
    });

    toast.success("Contact added successfully!");
    refreshCategoryList();
    handleCloseModal();
  } catch (error) {
    console.error("Error adding contact:", error);
    toast.error("Failed to add contact. Please try again later.");
  } finally {
    setIsLoading(false);
  }
};

  const handleCloseModal = () => {
    setAddModal(false);
    setFormData(initialState);
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
            <div className="text-xl mt-5">Add Contact Data</div>
          </div>
          <form
  className="grid grid-cols-12 gap-4 mt-5 gap-y-5 px-5 pb-5"
  encType="multipart/form-data"
  onSubmit={handleSubmit}
>

              <div className="col-span-12 intro-y sm:col-span-12">
                            <FormLabel htmlFor="input-wizard-1">
                                Contact Banner Image
                            </FormLabel>
                            <FormInput
                                id="input-wizard-1"
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                                className="border border-gray-200 p-1"
                            />
                        </div>
            <div className="col-span-6 intro-y sm:col-span-6">
              <FormLabel htmlFor="input-wizard-1">
                Email <span className="text-red-600 font-bold">*</span>
              </FormLabel>
              <FormInput
                id="input-wizard-1"
                type="text"
                name="email"
                onInput={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e, "email")
                }
                placeholder="Enter Email"
                value={formData.email}
              />
            </div>

            <div className="col-span-6 intro-y sm:col-span-6">
              <FormLabel htmlFor="input-wizard-1">
                Phone No <span className="text-red-600 font-bold">*</span>
              </FormLabel>
              <FormInput
                id="input-wizard-1"
                type="text"
                name="phone"
                onInput={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e, "phone")
                }
                placeholder="Enter Contact Number"
                value={formData.phone}
              />
            </div>
            <div className="col-span-12 intro-y sm:col-span-12">
              <FormLabel htmlFor="input-wizard-1">
                Location <span className="text-red-600 font-bold">*</span>
              </FormLabel>
              <FormInput
                id="input-wizard-1"
                type="text"
                name="location"
                onInput={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e, "location")
                }
                placeholder="Enter Location"
                value={formData.location}
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
              <Button variant="primary" type="submit" ref={addRoleButtonRef}>
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
                  "Add Contact Data"
                )}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default AddContact;
