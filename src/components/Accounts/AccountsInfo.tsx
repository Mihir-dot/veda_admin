import React, { ChangeEvent, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { selectDarkMode } from "../../stores/darkModeSlice";
import { Controller, useForm } from "react-hook-form";
import { FormInput, FormLabel, FormTextarea } from "../../base-components/Form";
import clsx from "clsx";
import { Autocomplete, TextField } from "@mui/material";
import Button from "../../base-components/Button";
import {
  fetchAllCountries,
  fetchAllStates,
  fetchCompanyDropdown,
  getCompanyDropdownData,
  getCountriesData,
  getStatesData,
} from "../../stores/commonList";
import {
  addAccount,
  editAccount,
  fetchSingleAccount,
  getAccountsData,
} from "../../stores/accounts";
import { validateAccountsInfo } from "../../utils/validations";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";
import { toastMessage } from "../../stores/toastSlice";

interface StepOneProps {
  nextPage: (page: string) => void;
  setPage: (page: string) => void;
}
interface ListOptions {
  name: string;
  id: number;
}

const initialState = {
  name: "",
  description: "",
  building_name: "",
  street_address: "",
  suburb: "",
  state: "",
  country: "",
  pincode: "",
  contact_no: "",
  email: "",
  companySelectName: "",
  custom_domain_name: "",
  site_url: "",
  cost_center_name: "",
};

type SelectState = {
  country: string;
  state: string;
  companySelectName: string;
};

type TextInputState = {
  name: string;
  description: string;
  building_name: string;
  street_address: string;
  suburb: string;
  pincode: string;
  contact_no: string;
  email: string;
  custom_domain_name: string;
  site_url: string;
  cost_center_name: string;
};

type ErrorState = {
  name: string;
  building_name: string;
  suburb: string;
  state: string;
  country: string;
  companySelectName: string;
  contact_no: string;
  pincode: string;
};

type FormState = SelectState & TextInputState;

const AccountsInfo: React.FC<StepOneProps> = ({ nextPage, setPage }) => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
  });
  const [isCountrySelected, setIsCountrySelected] = useState<boolean>(false);
  const countryOptions: any = useAppSelector(getCountriesData);
  const stateOptions: any = useAppSelector(getStatesData);
  const companyDropdownOptions: any = useAppSelector(getCompanyDropdownData);
  const [isStateSelected, setIsStateSelected] = useState<boolean>(false);
  const [countrySelect, setCountrySelect] = useState<string>("");
  const [stateSelect, setStateSelect] = useState<string>("");
  const [companySelect, setCompanySelect] = useState<string>("");
  const darkMode = useAppSelector(selectDarkMode);
  const isAccountsAdded = localStorage.getItem("newlyAddedAccounts");
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState<ErrorState>({});
  const { account }: Object = useAppSelector(getAccountsData);
  const [countryError, setCountryError] = useState<string>("");
  const [stateError, setStateError] = useState<string>("");
  const [companyError, setCompanyError] = useState<string>("");
  const toastMsg = useAppSelector(toastMessage);

  useEffect(() => {
    dispatch(fetchAllCountries());
    dispatch(fetchCompanyDropdown());
  }, []);

  useEffect(() => {
    setIsFormValid(Object.keys(formErrors).length === 0);
  }, [formErrors]);

  useEffect(() => {
    if (countrySelect !== undefined) {
      if (countrySelect !== "") {
        dispatch(fetchAllStates(countrySelect));
      }
    }
  }, [countrySelect]);

  useEffect(() => {
    if (isAccountsAdded) {
      dispatch(fetchSingleAccount(isAccountsAdded));
    }
  }, []);

  useEffect(() => {
    if (account !== null && isAccountsAdded) {
      setIsCountrySelected(true);
      setInitFormData((prev) => ({
        ...prev,
        name: account.name || "",
        description: account.description || "",
        building_name: account.building_name || "",
        street_address: account.street_address || "",
        suburb: account.suburb || "",
        pincode: account.pincode || "",
        contact_no: account.contact_no || "",
        email: account.email || "",
        custom_domain_name: account.custom_domain_name || "",
        site_url: account.site_url || "",
        cost_center_name: account.cost_center_name || "",
      }));
      setCountrySelect(account.country);
      setStateSelect(account.state);
      setCompanySelect(account.company_id);
    }
  }, [account, isAccountsAdded]);

  const handleCountrySelect = (selectedValue: string) => {
    setCountrySelect(selectedValue);
    setStateSelect("");
    // setStateError(null);

    if (selectedValue === undefined || selectedValue === "") {
      setStateSelect("");
      setInitFormData((prev) => ({ ...prev, suburb: "" }));
      setCountryError("Country is required");
    } else {
      setCountryError("");
    }
  };

  const handleStateSelect = (selectedValue: string) => {
    setStateSelect(selectedValue);
    if (selectedValue === undefined || selectedValue === "") {
      setStateError("State is required");
    } else {
      setStateError("");
    }
  };

  const handleCompanySelect = (selectedValue: string) => {
    setCompanySelect(selectedValue);
    if (selectedValue === undefined || selectedValue === "") {
      setCompanyError("Please select a company");
    } else {
      setCompanyError("");
    }
  };

  const { control } = useForm({
    mode: "onChange",
    defaultValues: initFormData,
  });

  const handleChange = (key: string, value: string) => {
    const formData = new FormData(document.forms.accountsInfo);
    formData.set(key, value);
    let errors = validateAccountsInfo(formData);
    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof TextInputState
  ) => {
    const { value } = event.target;
    setInitFormData((prevState) => ({ ...prevState, [fieldName]: value }));
    handleChange(fieldName, value);
  };

  const handleSelectChange = (
    selectedValue: string,
    fieldName: keyof SelectState
  ) => {
    setInitFormData((prevState) => ({
      ...prevState,
      [fieldName]: selectedValue,
    }));
  };

  const submitAccountsInfo = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const errors = validateAccountsInfo(formData);
    setFormErrors(errors);
    if (!countrySelect) {
      setCountryError("Country is required");
    }
    if (!stateSelect) {
      setStateError("State is required");
    }
    if (!companySelect) {
      setCompanyError("Please select a company.");
    }
    if (!stateSelect || !countrySelect || !companySelect) {
      return toast.error("Please fill all the required fields.");
    }
    if (Object.keys(errors).length === 0) {
      const payload = {
        ...initFormData,
        country: countrySelect,
        state: stateSelect,
        company_id: companySelect,
      };
      if (isAccountsAdded) {
        try {
          setIsLoading(true);
          const res = await dispatch(
            editAccount({ ...payload, id: isAccountsAdded })
          );
          if (res.payload === undefined)
            return toast.error(toastMsg || "Something went wrong.");
          toast.success(res.payload.message || "Account edited successfully.");
          setPage("2");
        } catch (error) {
          toast.error("Something went wrong");
          console.log("Err--", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        try {
          setIsLoading(true);
          const res = await dispatch(addAccount(payload));
          if (res.payload === undefined)
            return toast.error(toastMsg || "Something went wrong");
          localStorage.setItem(
            "newlyAddedAccounts",
            res.payload.data.last_insert_id
          );
          toast.success(res.payload.message || "Account added successfully.");
          setPage("2");
        } catch (error) {
          toast.error("Something went wrong");
          console.log("Err-", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <form
      className="grid grid-cols-12 gap-4 mt-5 gap-y-5"
      onSubmit={submitAccountsInfo}
      name="accountsInfo"
    >
      <div className="col-span-12 intro-y md:col-span-6">
        <FormLabel htmlFor="input-wizard-8">
          Select Company <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="companySelectName"
          control={control}
          render={({ field: { onChange, value } }) => {
            const selectedState: any = companyDropdownOptions?.find(
              (option: ListOptions) => option.id === value
            );
            const selectedCompany = companyDropdownOptions?.find(
              (option: ListOptions) => option.id === companySelect
            );
            const defaultValue =
              (selectedState === undefined ? selectedCompany : selectedState) ||
              null;
            return (
              <>
                <Autocomplete
                  disablePortal
                  size="small"
                  componentsProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "flip",
                          enabled: false,
                        },
                      ],
                    },
                  }}
                  id="combo-box-demo"
                  value={defaultValue}
                  options={companyDropdownOptions?.map((data: ListOptions) => ({
                    value: data.id,
                    label: data.name,
                  }))}
                  getOptionLabel={(option) => option.label ?? option.name}
                  onChange={(_, newVal) => {
                    handleCompanySelect(newVal?.value);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.value === (value.id ? value.id : null)
                  }
                  disabled={isAccountsAdded ? true : false}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Company"
                      className={clsx(
                        "transition duration-200 custom-select ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80"
                      )}
                      InputLabelProps={{
                        style: {
                          fontSize: 12,
                          color: `${darkMode ? "inherit" : ""}`,
                          paddingTop: 3,
                        },
                      }}
                    />
                  )}
                />
                {companyError && (
                  <div className="mt-2 text-danger">
                    {typeof companyError === "string" && companyError}
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
      <div className="col-span-12 intro-y md:col-span-6">
        <FormLabel htmlFor="input-wizard-7">
          Country <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="country"
          control={control}
          render={({ field: { onChange, value } }) => {
            const selectedState: any = countryOptions.find(
              (option: ListOptions) => option.id === value
            );
            const selectedCountry = countryOptions?.find(
              (option: ListOptions) => option.id === countrySelect
            );
            const defaultValue =
              (selectedState === undefined ? selectedCountry : selectedState) ||
              null;
            return (
              <>
                <Autocomplete
                  disablePortal
                  className={clsx({
                    "border-danger": countryError,
                  })}
                  size="small"
                  id="combo-box-demo"
                  componentsProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "flip",
                          enabled: false,
                        },
                      ],
                    },
                  }}
                  value={defaultValue}
                  options={countryOptions?.map((data: ListOptions) => ({
                    value: data.id,
                    label: data.name,
                  }))}
                  getOptionLabel={(option) => option.label ?? option.name}
                  onChange={(_, newVal) => {
                    handleCountrySelect(newVal?.value);
                    if (newVal?.value && newVal?.value !== "") {
                      setIsCountrySelected(true);
                    } else {
                      setIsCountrySelected(false);
                    }
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.value === (value.id ? value.id : null)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
                      className={clsx(
                        "disabled:bg-slate-100 custom-select dark:!border-blac disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent",
                        "[&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent",
                        "transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80"
                      )}
                      InputLabelProps={{
                        style: {
                          fontSize: 12,
                          color: `${darkMode ? "inherit" : ""}`,
                          paddingTop: 3,
                        },
                      }}
                    />
                  )}
                />
                {countryError && (
                  <div className="mt-2 text-danger">
                    {typeof countryError === "string" && countryError}
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-1">
          Name <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-1"
          type="text"
          name="name"
          className={clsx({
            "border-danger": formErrors.name,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "name")
          }
          placeholder="Enter Name"
          value={initFormData.name ? initFormData.name : ""}
        />
        {formErrors.name && (
          <div className="mt-2 text-danger">
            {typeof formErrors.name === "string" && formErrors.name}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-2">Accounts Description</FormLabel>
        <FormTextarea
          id="input-wizard-2"
          name="description"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "description")
          }
          placeholder="Enter Accounts Description"
          value={initFormData.description}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-3">
          Building Name / Address 1{" "}
          <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-3"
          type="text"
          name="building_name"
          className={clsx({
            "border-danger": formErrors.building_name,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "building_name")
          }
          placeholder="Building Name"
          value={initFormData.building_name ? initFormData.building_name : ""}
        />
        {formErrors.building_name && (
          <div className="mt-2 text-danger">
            {typeof formErrors.building_name === "string" &&
              formErrors.building_name}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-4">
          Street Address / Address 2
        </FormLabel>
        <FormInput
          id="input-wizard-4"
          type="text"
          name="street_address"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "street_address")
          }
          placeholder="Street Address"
          value={initFormData.street_address ? initFormData.street_address : ""}
        />
      </div>
      <div className="col-span-12 intro-y md:col-span-6">
        <FormLabel htmlFor="input-wizard-5">
          Suburb / City <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-5"
          type="text"
          placeholder="Enter City"
          name="suburb"
          className={clsx({
            "border-danger": formErrors.suburb,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "suburb")
          }
          disabled={countrySelect === undefined || countrySelect === ""}
          value={
            countrySelect === undefined || countrySelect === ""
              ? ""
              : initFormData.suburb
          }
        />
        {formErrors.suburb && (
          <div className="mt-2 text-danger">
            {typeof formErrors.suburb === "string" && formErrors.suburb}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y md:col-span-6">
        <FormLabel htmlFor="input-wizard-8">
          State <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="state"
          control={control}
          render={({ field: { onChange, value } }) => {
            const selectedState: any = stateOptions.find(
              (option: ListOptions) => option.id === value
            );
            const selectedOneState = stateOptions?.find(
              (option: ListOptions) => option.id === stateSelect
            );
            const defaultValue = !isCountrySelected
              ? null
              : (selectedState === undefined
                  ? selectedOneState
                  : selectedState) || null;
            return (
              <>
                <Autocomplete
                  disablePortal
                  size="small"
                  componentsProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "flip",
                          enabled: false,
                        },
                      ],
                    },
                  }}
                  id="combo-box-demo"
                  value={!isCountrySelected ? null : defaultValue}
                  options={stateOptions?.map((data: ListOptions) => ({
                    value: data.id,
                    label: data.name,
                  }))}
                  getOptionLabel={(option) => option.label ?? option.name}
                  onChange={(_, newVal) => {
                    handleStateSelect(newVal?.value);
                    setFormErrors({ ...formErrors, state: "" });
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.value === (value.id ? value.id : null)
                  }
                  disabled={!isCountrySelected}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State"
                      className={clsx(
                        "transition duration-200 custom-select ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80"
                      )}
                      InputLabelProps={{
                        style: {
                          fontSize: 12,
                          color: `${darkMode ? "inherit" : ""}`,
                          paddingTop: 3,
                        },
                      }}
                    />
                  )}
                />
                {stateError && (
                  <div className="mt-2 text-danger">
                    {typeof stateError === "string" && stateError}
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
      <div className="col-span-12 intro-y md:col-span-6">
        <FormLabel htmlFor="input-wizard-8">
          Postcode <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-8"
          type="text"
          name="pincode"
          className={clsx({
            "border-danger": formErrors.pincode,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "pincode")
          }
          placeholder="Enter Pincode"
          value={initFormData.pincode}
        />
        {formErrors.pincode && (
          <div className="mt-2 text-danger">
            {typeof formErrors.pincode === "string" && formErrors.pincode}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y md:col-span-6">
        <FormLabel htmlFor="input-wizard-10">
          Contact No <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-10"
          type="text"
          name="contact_no"
          className={clsx({
            "border-danger": formErrors.contact_no,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "contact_no")
          }
          placeholder="Enter Contact No."
          value={initFormData.contact_no}
        />
        {formErrors.contact_no && (
          <div className="mt-2 text-danger">
            {typeof formErrors.contact_no === "string" && formErrors.contact_no}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-11">Email Address</FormLabel>
        <FormInput
          id="input-wizard-11"
          type="email"
          name="email"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "email")
          }
          placeholder="Enter Email Address"
          value={initFormData.email}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-12">Custom Domain Name</FormLabel>
        <FormInput
          id="input-wizard-12"
          type="text"
          name="custom_domain_name"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "custom_domain_name")
          }
          placeholder="Enter Custom Domain Name."
          value={initFormData.custom_domain_name}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-13">Site URL</FormLabel>
        <FormInput
          id="input-wizard-13"
          type="text"
          name="site_url"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "site_url")
          }
          placeholder="Enter Site URL"
          value={initFormData.site_url}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-14">Cost Center Name</FormLabel>
        <FormInput
          id="input-wizard-14"
          type="text"
          name="cost_center_name"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "cost_center_name")
          }
          placeholder="Enter Cost Center Name"
          value={initFormData.cost_center_name}
        />
      </div>
      <div className="flex items-center justify-center col-span-12 mt-5 intro-y sm:justify-end">
        <Button
          variant="primary"
          className="w-24 ml-2"
          type="submit"
          disabled={countryError || stateError || companyError}
        >
          {isLoading ? (
            <>
              Next
              <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />
            </>
          ) : (
            "Next"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AccountsInfo;
