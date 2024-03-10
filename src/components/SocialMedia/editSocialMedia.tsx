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
  editingPlatform: string | null;
}

const initialState = {
  facebook: "",
  twitter: "",
  linkedin: "",
  instagram: "",
  youtube: "",
};

type TextInputState = {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  youtube: string;
};

const EditSocialMedia: React.FC<EditContactProps> = ({
  editModal,
  setEditModal,
  editModalId,
  refreshCategoryList,
  editingPlatform,
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
          `${API_PATH.GET_SOCIAL_MEDIA_DETAILS}/${id}`,
          { headers: getAuthHeaders() }
        );
        const socialMediaData = response.data;
        setFormData(socialMediaData);
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

  const handleCloseModal = () => {
    setEditModal(false);
    setFormData(initialState);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const payload = {
        facebook: formData.facebook || "",
        twitter: formData.twitter || "",
        linkedin: formData.linkedin || "",
        instagram: formData.instagram || "",
        youtube: formData.youtube || "",
      };

      const response = await axios.put(
        `${API_PATH.UPDATE_SOCIAL_MEDIA}`,
        payload,
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
            <div className="text-xl mt-5">Edit Social Media</div>
          </div>
          <form
            className="grid grid-cols-12 gap-4 mt-5 gap-y-5 px-5 pb-5"
            onSubmit={handleFormSubmit}
            encType="multipart/form-data"
          >
            {" "}
            {editingPlatform === "facebook" && (
              <div className="col-span-12 intro-y sm:col-span-12">
                <FormLabel htmlFor="input-wizard-1">
                  Facebook <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="facebook"
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "facebook")
                  }
                  placeholder="Enter Facebook Link"
                  value={formData.facebook}
                />
              </div>
            )}
            {editingPlatform === "twitter" && (
              <div className="col-span-12 intro-y sm:col-span-12">
                <FormLabel htmlFor="input-wizard-1">
                  Twitter <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="twitter"
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "twitter")
                  }
                  placeholder="Enter twitter Link"
                  value={formData.twitter}
                />
              </div>
            )}
            {editingPlatform === "linkedin" && (
              <div className="col-span-12 intro-y sm:col-span-12">
                <FormLabel htmlFor="input-wizard-1">
                  Linkedin <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="linkedin"
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "linkedin")
                  }
                  placeholder="Enter linkedin Link"
                  value={formData.linkedin}
                />
              </div>
            )}
            {editingPlatform === "instagram" && (
              <div className="col-span-12 intro-y sm:col-span-12">
                <FormLabel htmlFor="input-wizard-1">
                  Instagram <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="instagram"
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "instagram")
                  }
                  placeholder="Enter instagram Link"
                  value={formData.instagram}
                />
              </div>
            )}
            {editingPlatform === "youtube" && (
              <div className="col-span-12 intro-y sm:col-span-12">
                <FormLabel htmlFor="input-wizard-1">
                  Youtube <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="youtube"
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "youtube")
                  }
                  placeholder="Enter youtube Link"
                  value={formData.youtube}
                />
              </div>
            )}
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

export default EditSocialMedia;
