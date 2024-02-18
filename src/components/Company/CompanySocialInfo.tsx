import React, { ChangeEvent, useEffect, useState } from "react";
import Button from "../../base-components/Button";
import { FormInput, FormLabel } from "../../base-components/Form";
import { useNavigate } from "react-router-dom";
import {
  editCompany,
  fetchSingleCompany,
  getCompaniesData,
} from "../../stores/company";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toastMessage } from "../../stores/toastSlice";
import { toast } from "react-toastify";

interface StepTwoProps {
  setPage?: (page: string) => void;
  nextPage: (page: string) => void;
}

const initialState = {
  facebookUrl: "",
  twitterUrl: "",
  googleUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  snapchatUrl: "",
  tiktokUrl: "",
  footerCopyright: "",
  domain: "",
};

type TextInputState = {
  facebookUrl: string;
  twitterUrl: string;
  googleUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  snapchatUrl: string;
  tiktokUrl: string;
  footerCopyright: string;
  domain: string;
};

const CompanySocialInfo: React.FC<StepTwoProps> = ({ nextPage, setPage }) => {
  const [formData, setFormData] = useState<TextInputState>({
    ...initialState,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedBgImage, setSelectedBgImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingExit, setIsLoadingExit] = useState<boolean>(false);
  const isCompanyAdded = localStorage.getItem("newlyAddedCompany");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { company }: Object = useAppSelector(getCompaniesData);
  const toastMsg = useAppSelector(toastMessage);

  useEffect(() => {
    if (isCompanyAdded) {
      dispatch(fetchSingleCompany(isCompanyAdded));
    }
  }, [isCompanyAdded]);

  useEffect(() => {
    if (company !== null && isCompanyAdded) {
      setFormData((prev) => ({
        ...prev,
        facebookUrl: company.facebook || "",
        twitterUrl: company.twitter || "",
        googleUrl: company.google_plus || "",
        instagramUrl: company.instagram || "",
        youtubeUrl: company.youtube || "",
        snapchatUrl: company.snapchat || "",
        tiktokUrl: company.tiktok || "",
        footerCopyright: company.copy_right_text || "",
        domain: company.company_domain || "",
      }));
      setSelectedImage(company.logo || "");
      setSelectedBgImage(company.background_photo || "");
    }
  }, [company, isCompanyAdded]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof TextInputState
  ) => {
    const { value } = event.target;
    setFormData((prevState) => ({ ...prevState, [fieldName]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleBgImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedBgImage(file);
    }
  };

  const submitCompanySocialInfo = async (
    e: React.ChangeEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const payload = {
      logo: selectedImage,
      bg_photo: selectedBgImage,
      facebook: formData.facebookUrl || "",
      twitter: formData.twitterUrl || "",
      google_plus: formData.googleUrl || "",
      instagram: formData.instagramUrl || "",
      youtube: formData.youtubeUrl || "",
      snapchat: formData.snapchatUrl || "",
      tiktok: formData.tiktokUrl || "",
      copy_right_text: formData.footerCopyright || "",
      company_domain: formData.domain || "",
      id: isCompanyAdded ? isCompanyAdded : "",
    };
    if (!payload.logo) {
      return toast.error("Logo is required.");
    }
    try {
      if (isCompanyAdded) {
        setIsLoading(true);
        const res = await dispatch(editCompany(payload));
        if (res.payload === undefined)
          return toast.error(toastMsg || "Something went wrong.");
        toast.success(res.payload.message || "Company edited successfully.");
        localStorage.removeItem("newlyAddedCompany");
        localStorage.removeItem("currentPage");
        navigate("/company");
      }
    } catch (error) {
      console.log("Error-", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAndExitCompany = async (
    e: React.ChangeEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const payload = {
      logo: selectedImage,
      bg_photo: selectedBgImage,
      facebook: formData.facebookUrl || "",
      twitter: formData.twitterUrl || "",
      google_plus: formData.googleUrl || "",
      instagram: formData.instagramUrl || "",
      youtube: formData.youtubeUrl || "",
      snapchat: formData.snapchatUrl || "",
      tiktok: formData.tiktokUrl || "",
      copy_right_text: formData.footerCopyright || "",
      company_domain: formData.domain || "",
      id: isCompanyAdded ? isCompanyAdded : "",
    };
    if (!payload.logo) {
      return toast.error("Logo is required.");
    }
    try {
      if (isCompanyAdded) {
        setIsLoadingExit(true);
        const res = await dispatch(editCompany(payload));
        if (res.payload === undefined)
          return toast.error(toastMsg || "Something went wrong.");
        toast.success(res.payload.message || "Company edited successfully.");
        localStorage.removeItem("newlyAddedCompany");
        localStorage.removeItem("currentPage");
        navigate("/company");
      }
    } catch (error) {
      console.log("Error-", error);
    } finally {
      setIsLoadingExit(false);
    }
  };

  return (
    <form
      className="grid grid-cols-12 gap-4 mt-5 gap-y-5"
      onSubmit={submitCompanySocialInfo}
    >
      <div className="col-span-12 intro-y sm:col-span-6 flex flex-col justify-center">
        <FormLabel htmlFor="input-wizard-1">
          Logo <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-1"
          className="py-[0.3rem] border border-slate-200 px-3"
          type="file"
          onChange={handleImageChange}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 flex flex-col justify-center">
        <FormLabel htmlFor="input-wizard-10">Background Image</FormLabel>
        <FormInput
          id="input-wizard-10"
          className="py-[0.3rem] border border-slate-200 px-3"
          type="file"
          onChange={handleBgImageChange}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-2">Facebook URL</FormLabel>
        <FormInput
          id="input-wizard-2"
          type="url"
          placeholder="Enter Facebook URL"
          name="facebookUrl"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "facebookUrl")
          }
          value={formData.facebookUrl}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-3">Twitter URL</FormLabel>
        <FormInput
          id="input-wizard-3"
          type="url"
          placeholder="Enter Twitter URL"
          name="twitterUrl"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "twitterUrl")
          }
          value={formData.twitterUrl}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-4">Google Plus URL</FormLabel>
        <FormInput
          id="input-wizard-4"
          type="url"
          placeholder="Enter Google Plus URL"
          name="googleUrl"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "googleUrl")
          }
          value={formData.googleUrl}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-5">Instagram URL</FormLabel>
        <FormInput
          id="input-wizard-5"
          type="url"
          placeholder="Enter Instagram URL"
          name="instagramUrl"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "instagramUrl")
          }
          value={formData.instagramUrl}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-6">Youtube URL</FormLabel>
        <FormInput
          id="input-wizard-6"
          type="url"
          placeholder="Enter Youtube URL"
          name="youtubeUrl"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "youtubeUrl")
          }
          value={formData.youtubeUrl}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-7">Snapchat URL</FormLabel>
        <FormInput
          id="input-wizard-7"
          type="url"
          placeholder="Enter Snapchat URL"
          name="snapchatUrl"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "snapchatUrl")
          }
          value={formData.snapchatUrl}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-8">Tiktok URL</FormLabel>
        <FormInput
          id="input-wizard-8"
          type="url"
          placeholder="Enter Tiktok URL"
          name="tiktokUrl"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "tiktokUrl")
          }
          value={formData.tiktokUrl}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-9">Footer Copyright</FormLabel>
        <FormInput
          id="input-wizard-9"
          type="text"
          placeholder="Enter Footer Copyright"
          name="footerCopyright"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "footerCopyright")
          }
          value={formData.footerCopyright}
        />
      </div>
      <div className="col-span-12 intro-y">
        <FormLabel htmlFor="input-wizard-12">Company Domain</FormLabel>
        <FormInput
          id="input-wizard-12"
          type="text"
          name="domain"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "domain")
          }
          placeholder="Enter Company Domain"
          value={formData.domain}
        />
      </div>
      <div className="flex items-center justify-center col-span-12 mt-5 intro-y sm:justify-end">
        <Button
          variant="secondary"
          className="w-24"
          onClick={() => setPage("1")}
          type="button"
        >
          Previous
        </Button>
        <Button
          variant="primary"
          className="ml-2"
          type="button"
          onClick={saveAndExitCompany}
          disabled={!selectedImage}
        >
          {isLoadingExit ? (
            <>
              Save & Exit
              <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />
            </>
          ) : (
            "Save & Exit"
          )}
        </Button>
        <Button
          variant="primary"
          className="ml-2"
          type="submit"
          disabled={!selectedImage}
        >
          {isLoading ? (
            <>
              Update Company
              <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />
            </>
          ) : (
            "Update Company"
          )}
        </Button>
      </div>
    </form>
  );
};

export default CompanySocialInfo;
