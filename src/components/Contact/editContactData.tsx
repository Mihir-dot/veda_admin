import React, { ChangeEvent, useEffect, useState } from "react";
import Button from "../../base-components/Button";
import { Dialog } from "../../base-components/Headless";
import { FormInput, FormLabel } from "../../base-components/Form";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import Loader from "../Loader";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";
import clsx from "clsx";
import axios from "axios";
import { API_PATH } from "../../api-services/apiPath";
import { getAuthHeaders } from "../../utils/helper";

interface EditContactProps {
  editModal: boolean;
  setEditModal: (role: boolean) => void;
  editModalId: string | null;
  refreshCategoryList: () => void;
}

const initialState = {
  image: null,
  email: "",
  location: "",
  phone: "",
};

type TextInputState = {
  image: File | null;
  email: string;
  location: string;
  phone: string;
};

const EditContact: React.FC<EditContactProps> = ({
  editModal,
  setEditModal,
  editModalId,
  refreshCategoryList,
}) => {
  const [formData, setFormData] = useState<TextInputState>({
    ...initialState,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState({ name: "" });
  const id = editModalId || "";

  useEffect(() => {
    getContactDetails();
  }, [editModal]);
  const getContactDetails = async () => {
    try {
      if (editModalId) {
        const response = await axios.get(
          `${API_PATH.GET_CONTACT_DETAILS}/${id}`,
          { headers: getAuthHeaders() }
        );
        const contactdata = response.data;
        setFormData(contactdata);
      }
    } catch (error) {
      console.log("error----", error);
    }
  };

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
  const handleCloseModal = () => {
    setEditModal(false);
    setFormData(initialState);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      formDataToSend.append("location", formData.location);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);

      const response = await axios.put(
        `${API_PATH.EDIT_CONTACT}/${id}`,
         formDataToSend ,
        {
          headers: getAuthHeaders(),
        }
      );
      if (response.data) {
        toast.success("Edit Contact successfully.");
        handleCloseModal();
        refreshCategoryList();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Dialog open={editModal} onClose={handleCloseModal} staticBackdrop>
        <Dialog.Panel>
          <div className="px-5 py-3 text-center">
            <div className="text-xl mt-5">Edit Contact Data</div>
          </div>
          <form
            className="grid grid-cols-12 gap-4 mt-5 gap-y-5 px-5 pb-5"
            onSubmit={handleFormSubmit}
            encType="multipart/form-data"
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
              <Button
                variant="primary"
                type="submit"
                disabled={formErrors.name || isLoading ? true : false}
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
                  "Update Category"
                )}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default EditContact;
