import React, { ChangeEvent, useEffect, useState } from "react";
import { FormInput, FormLabel } from "../../base-components/Form";
import Button from "../../base-components/Button";
import {
  editAccount,
  fetchSingleAccount,
  getAccountsData,
} from "../../stores/accounts";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { useNavigate } from "react-router-dom";
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
};

const AccountsSocialInfo: React.FC<StepTwoProps> = ({ nextPage, setPage }) => {
  const [formData, setFormData] = useState<TextInputState>({
    ...initialState,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const dispatch = useAppDispatch();
  const isAccountsAdded = localStorage.getItem("newlyAddedAccounts");
  const { account }: Object = useAppSelector(getAccountsData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingExit, setIsLoadingExit] = useState<boolean>(false);
  const navigate = useNavigate();
  const toastMsg = useAppSelector(toastMessage);

  useEffect(() => {
    if (isAccountsAdded) {
      dispatch(fetchSingleAccount(isAccountsAdded));
    }
  }, [isAccountsAdded]);

  useEffect(() => {
    if (account !== null && isAccountsAdded) {
      setFormData((prev) => ({
        ...prev,
        facebookUrl: account.facebook_url || "",
        twitterUrl: account.twitter_url || "",
        googleUrl: account.googleplus_url || "",
        instagramUrl: account.instagram_url || "",
        youtubeUrl: account.youtube_url || "",
        snapchatUrl: account.snapchat_url || "",
        tiktokUrl: account.tiktok_url || "",
        footerCopyright: account.footer_copyright || "",
      }));
      setSelectedImage(account.logo || "");
    }
  }, [account, isAccountsAdded]);

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

  const submitAccountsSocialInfo = async (
    e: React.ChangeEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const payload = {
      logo: selectedImage,
      facebook_url: formData.facebookUrl || "",
      twitter_url: formData.twitterUrl || "",
      googleplus_url: formData.googleUrl || "",
      instagram_url: formData.instagramUrl || "",
      youtube_url: formData.youtubeUrl || "",
      snapchat_url: formData.snapchatUrl || "",
      tiktok_url: formData.tiktokUrl || "",
      footer_copyright: formData.footerCopyright || "",
      id: isAccountsAdded ? parseInt(isAccountsAdded) : "",
      company_id: account.company_id,
    };
    try {
      if (isAccountsAdded) {
        setIsLoading(true);
        const res = await dispatch(editAccount(payload));
        if (res.payload === undefined)
          return toast.error(toastMsg || "Something went wrong.");
        toast.success(res.payload.message || "Account edited successfully.");
        localStorage.removeItem("newlyAddedAccounts");
        localStorage.removeItem("currentPage");
        navigate("/accounts");
      }
    } catch (error) {
      console.log("Error-", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAndExitAccounts = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      logo: selectedImage,
      facebook_url: formData.facebookUrl || "",
      twitter_url: formData.twitterUrl || "",
      googleplus_url: formData.googleUrl || "",
      instagram_url: formData.instagramUrl || "",
      youtube_url: formData.youtubeUrl || "",
      snapchat_url: formData.snapchatUrl || "",
      tiktok_url: formData.tiktokUrl || "",
      footer_copyright: formData.footerCopyright || "",
      id: isAccountsAdded ? parseInt(isAccountsAdded) : "",
      company_id: account.company_id,
    };
    try {
      if (isAccountsAdded) {
        setIsLoadingExit(true);
        const res = await dispatch(editAccount(payload));
        if (res.payload === undefined)
          return toast.error(toastMsg || "Something went wrong.");
        toast.success(res.payload.message || "Account edited successfully.");
        localStorage.removeItem("newlyAddedAccounts");
        localStorage.removeItem("currentPage");
        navigate("/accounts");
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
      onSubmit={submitAccountsSocialInfo}
    >
      <div className="col-span-12 intro-y sm:col-span-6 flex flex-col justify-center">
        <FormLabel htmlFor="input-wizard-1">Logo</FormLabel>
        <FormInput
          id="input-wizard-1"
          className="py-[0.3rem] border border-slate-200 px-3"
          type="file"
          onChange={handleImageChange}
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
      <div className="col-span-12 intro-y">
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
          onClick={saveAndExitAccounts}
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
        <Button variant="primary" className="ml-2" type="submit">
          {isLoading ? (
            <>
              Update Accounts
              <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />
            </>
          ) : (
            "Update Accounts"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AccountsSocialInfo;
