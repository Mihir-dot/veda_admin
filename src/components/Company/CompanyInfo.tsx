import React, { ChangeEvent, useState, useEffect } from "react";
import Button from "../../base-components/Button";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormTextarea,
} from "../../base-components/Form";
import clsx from "clsx";
import { Autocomplete, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { selectDarkMode } from "../../stores/darkModeSlice";
import { Controller, useForm } from "react-hook-form";
import {
  fetchAllCountries,
  fetchAllStates,
  fetchCurrency,
  getCountriesData,
  getCurrenciesData,
  getStatesData,
} from "../../stores/commonList";
import {
  addCompany,
  editCompany,
  fetchCompanyCode,
  fetchSingleCompany,
  getCompaniesData,
} from "../../stores/company";
import { validateCompanyInfo } from "../../utils/validations";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";
import { toastMessage } from "../../stores/toastSlice";
import timeZoneData from "../../utils/timezoneData";
interface ListOptions {
  name: string;
  id: number;
}

interface TimeZoneOptions {
  text: string;
}

interface CurrencyOptions {
  currency_code: string;
  id: number;
}

interface StepOneProps {
  nextPage: (page: string) => void;
  setPage: (page: string) => void;
}

const initialState = {
  is_root_company: false,
  name: "",
  description: "",
  building_name: "",
  street_address: "",
  city: "",
  state: "",
  country: "",
  zipcode: "",
  email: "",
  company_prefix: "",
  company_currency: "",
  time_zone: "",
  help_line_number: "",
  company_code: "",
};

type ErrorState = {
  name: string;
  building_name: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  help_line_number: string;
  email: string;
  company_prefix: string;
  company_currency: string;
  time_zone: string;
};

type SelectState = {
  country: string;
  state: string;
  company_currency: string;
  time_zone: string;
  is_root_company: boolean;
};

type TextInputState = {
  name: string;
  description: string;
  building_name: string;
  street_address: string;
  city: string;
  zipcode: string;
  help_line_number: string;
  email: string;
  company_prefix: string;
  company_code: string;
};

type FormState = SelectState & TextInputState;

const timeZoneOptions = [
  { value: "1", label: "Kolkata" },
  { value: "2", label: "New York" },
  { value: "3", label: "Paris" },
];

const CompanyInfo: React.FC<StepOneProps> = ({ nextPage, setPage }) => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
  });
  const [isCountrySelected, setIsCountrySelected] = useState<boolean>(false);
  const darkMode = useAppSelector(selectDarkMode);
  const dispatch = useAppDispatch();
  const countryOptions: any = useAppSelector(getCountriesData);
  const { companyCode }: string = useAppSelector(getCompaniesData);
  const { company }: Object = useAppSelector(getCompaniesData);
  const stateOptions: any = useAppSelector(getStatesData);
  const currencyOptions: any = useAppSelector(getCurrenciesData);
  const isCompanyAdded = localStorage.getItem("newlyAddedCompany");
  const [formErrors, setFormErrors] = useState<ErrorState>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [countrySelect, setCountrySelect] = useState<string>("");
  const [stateSelect, setStateSelect] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toastMsg = useAppSelector(toastMessage);
  const [selectErrors, setSelectErrors] = useState<{ [key: string]: string }>({
    country: "",
    state: "",
    time_zone: "",
    company_currency: "",
  });

  useEffect(() => {
    dispatch(fetchAllCountries());
    dispatch(fetchCurrency());
    if (!isCompanyAdded) {
      dispatch(fetchCompanyCode());
    }
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
    if (isCompanyAdded) {
      dispatch(fetchSingleCompany(isCompanyAdded));
    }
  }, []);

  useEffect(() => {
    if (company !== null && isCompanyAdded) {
      setIsCountrySelected(true);
      setInitFormData((prev) => ({
        ...prev,
        is_root_company: company.is_root_company,
        company_code: company.company_code,
        name: company.name,
        description: company.description,
        building_name: company.building_name,
        street_address: company.street_address,
        city: company.city,
        zipcode: company.zipcode,
        help_line_number: company.help_line_number,
        email: company.email,
        time_zone: company.time_zone,
        company_currency: company.company_currency,
        company_prefix: company.company_prefix,
      }));
      setCountrySelect(company.country);
      setStateSelect(company.state);
    }
  }, [company, isCompanyAdded]);

  const { control } = useForm({
    mode: "onChange",
    defaultValues: initFormData,
  });

  const handleChange = (key: string, value: string) => {
    const formData = new FormData(document.forms.myForm);
    formData.set(key, value);
    let errors = validateCompanyInfo(formData);
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

  const handleCountrySelect = (selectedValue: string) => {
    setCountrySelect(selectedValue);
    setStateSelect("");
    if (!selectedValue) {
      setInitFormData((prev) => ({ ...prev, city: "" }));
      setSelectErrors((prev) => ({ ...prev, country: "Country is required" }));
    } else {
      setSelectErrors((prev) => ({ ...prev, country: "" }));
    }
  };

  const handleStateSelect = (selectedValue: string) => {
    setStateSelect(selectedValue);
    if (!selectedValue) {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        state: "State is required",
      }));
    } else {
      setSelectErrors((prevErrors) => ({ ...prevErrors, state: "" }));
    }
  };

  const handleSelectChange = (
    selectedValue: string,
    fieldName: keyof SelectState
  ) => {
    setInitFormData((prevState) => ({
      ...prevState,
      [fieldName]: selectedValue,
    }));
    if (fieldName === "time_zone") {
      if (!selectedValue) {
        setSelectErrors((prevErrors) => ({
          ...prevErrors,
          time_zone: "Time Zone is required",
        }));
      } else {
        setSelectErrors((prevErrors) => ({ ...prevErrors, time_zone: "" }));
      }
    }
    if (fieldName === "company_currency") {
      if (!selectedValue) {
        setSelectErrors((prevErrors) => ({
          ...prevErrors,
          company_currency: "Currency is required",
        }));
      } else {
        setSelectErrors((prevErrors) => ({
          ...prevErrors,
          company_currency: "",
        }));
      }
    }
  };

  const handleSelectCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setInitFormData((prev) => ({
      ...prev,
      is_root_company: checked,
    }));
  };

  const submitCompanyInfo = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const errors = validateCompanyInfo(formData);
    setFormErrors(errors);
    if (!countrySelect) {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        country: "Country is required",
      }));
    }
    if (!stateSelect) {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        state: "State is required",
      }));
    }
    if (!initFormData.company_currency) {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        company_currency: "Currency is required",
      }));
    }
    if (!initFormData.time_zone) {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        time_zone: "Time Zone is required",
      }));
    }
    if (!stateSelect || !countrySelect) {
      return toast.error("Please fill all the required fields.");
    }
    if (
      Object.keys(errors).length === 0 &&
      !selectErrors.country &&
      !selectErrors.state &&
      !selectErrors.company_currency &&
      !selectErrors.time_zone
    ) {
      const payload = {
        ...initFormData,
        company_code: companyCode ? companyCode : initFormData.company_code,
        country: countrySelect,
        state: stateSelect,
      };
      if (isCompanyAdded) {
        try {
          setIsLoading(true);
          const res = await dispatch(
            editCompany({ ...payload, id: isCompanyAdded })
          );
          if (res.payload === undefined)
            return toast.error(toastMsg || "Something went wrong.");
          toast.success(res.payload.message || "Company edited successfully.");
          setPage("2");
        } catch (error) {
          console.log("Err--", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        try {
          setIsLoading(true);
          const res = await dispatch(addCompany(payload));
          if (res.payload === undefined)
            return toast.error(toastMsg || "Something went wrong.");
          toast.success(res.payload.message || "Company added successfully.");
          localStorage.setItem(
            "newlyAddedCompany",
            res.payload.data.last_insert_id
          );
          setPage("2");
        } catch (error) {
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
      onSubmit={submitCompanyInfo}
      name="myForm"
    >
      <div className="col-span-12">
        <FormCheck.Input
          className="border-slate-400"
          type="checkbox"
          checked={initFormData.is_root_company}
          onChange={handleSelectCheckbox}
        />
        <FormLabel htmlFor="input-wizard-1" className="ml-3">
          Mark As a Root
        </FormLabel>
      </div>
      <div className="col-span-12 intro-y">
        <FormLabel htmlFor="input-wizard-20">Company Code</FormLabel>
        <FormInput
          id="input-wizard-20"
          type="text"
          name="company_code"
          disabled
          placeholder="Company Code"
          defaultValue={companyCode || initFormData.company_code}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-1">
          Company Name <span className="text-red-600 font-bold">*</span>
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
          placeholder="Enter Company Name"
          value={initFormData.name ? initFormData.name : ""}
        />
        {formErrors.name && (
          <div className="mt-2 text-danger">
            {typeof formErrors.name === "string" && formErrors.name}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-2">Company Description</FormLabel>
        <FormTextarea
          id="input-wizard-2"
          name="description"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "description")
          }
          placeholder="Enter Company Description"
          value={initFormData.description}
        />
      </div>
      <div className="col-span-12 intro-y md:col-span-6">
        <FormLabel htmlFor="input-wizard-7">
          Country <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="country"
          control={control}
          render={({ field: { value } }) => {
            const selectedState: any = countryOptions?.find(
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
                    "!border-danger": formErrors.country,
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
                {selectErrors.country && (
                  <div className="mt-2 text-danger">
                    {typeof selectErrors.country === "string" &&
                      selectErrors.country}
                  </div>
                )}
              </>
            );
          }}
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
          name="city"
          className={clsx({
            "border-danger": formErrors.city,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "city")
          }
          disabled={countrySelect === undefined || countrySelect === ""}
          value={
            countrySelect === undefined || countrySelect === ""
              ? ""
              : initFormData.city
          }
        />
        {formErrors.city && (
          <div className="mt-2 text-danger">
            {typeof formErrors.city === "string" && formErrors.city}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y md:col-span-4">
        <FormLabel htmlFor="input-wizard-8">
          State <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="state"
          control={control}
          render={({ field: { value } }) => {
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
                  className={clsx({
                    "border-danger": formErrors.state,
                  })}
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
                {selectErrors.state && (
                  <div className="mt-2 text-danger">
                    {typeof selectErrors.state === "string" &&
                      selectErrors.state}
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
      <div className="col-span-12 intro-y md:col-span-4">
        <FormLabel htmlFor="input-wizard-8">
          Postcode <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-8"
          type="text"
          name="zipcode"
          className={clsx({
            "border-danger": formErrors.zipcode,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "zipcode")
          }
          placeholder="Enter Zipcode"
          value={initFormData.zipcode ? initFormData.zipcode : ""}
        />
        {formErrors.zipcode && (
          <div className="mt-2 text-danger">
            {typeof formErrors.zipcode === "string" && formErrors.zipcode}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y md:col-span-4">
        <FormLabel htmlFor="input-wizard-9">
          Contact No <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-9"
          type="text"
          name="help_line_number"
          className={clsx({
            "border-danger": formErrors.help_line_number,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "help_line_number")
          }
          placeholder="Enter Contact No."
          value={initFormData.help_line_number}
        />
        {formErrors.help_line_number && (
          <div className="mt-2 text-danger">
            {typeof formErrors.help_line_number === "string" &&
              formErrors.help_line_number}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-10">
          Email Address <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-10"
          type="email"
          name="email"
          className={clsx({
            "border-danger": formErrors.email,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "email")
          }
          placeholder="Enter Email Address"
          value={initFormData.email ? initFormData.email : ""}
        />
        {formErrors.email && (
          <div className="mt-2 text-danger">
            {typeof formErrors.email === "string" && formErrors.email}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-11">
          Timezone <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="time_zone"
          control={control}
          render={({ field: { onChange, value } }) => {
            const selectedState: any = timeZoneData.find(
              (option: TimeZoneOptions) => option.text === value
            );
            const selectedTimeZone = timeZoneData?.find(
              (option: TimeZoneOptions) =>
                option.text === initFormData.time_zone
            );
            const defaultValue =
              (selectedState === undefined
                ? selectedTimeZone
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
                  className={clsx({
                    "border-danger": formErrors.time_zone,
                  })}
                  id="combo-box-demo"
                  value={defaultValue}
                  options={timeZoneData?.map((data: TimeZoneOptions) => ({
                    value: data.text,
                    label: data.text,
                  }))}
                  getOptionLabel={(option) => option.label ?? option.text}
                  onChange={(_, newVal) => {
                    onChange(newVal?.value || "");
                    handleSelectChange(newVal?.value || "", "time_zone");
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.value === (value.text ? value.text : null)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Timezone"
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
                {selectErrors.time_zone && (
                  <div className="mt-2 text-danger">
                    {typeof selectErrors.time_zone === "string" &&
                      selectErrors.time_zone}
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-12">
          Currency <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="company_currency"
          control={control}
          render={({ field: { onChange, value } }) => {
            const selectedState: any = currencyOptions?.find(
              (option: CurrencyOptions) => option.currency_code === value
            );
            const selectedCurrency = currencyOptions?.find(
              (option: CurrencyOptions) =>
                option.currency_code === initFormData.company_currency
            );
            const defaultValue =
              (selectedState === undefined
                ? selectedCurrency
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
                  className={clsx({
                    "border-danger": formErrors.company_currency,
                  })}
                  value={defaultValue}
                  options={currencyOptions?.map((data: CurrencyOptions) => ({
                    value: data.currency_code,
                    label: data.currency_code,
                  }))}
                  getOptionLabel={(option) =>
                    option.label ?? option.currency_code
                  }
                  onChange={(_, newVal) => {
                    onChange(newVal?.value || "");
                    handleSelectChange(newVal?.value || "", "company_currency");
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.value ===
                    (value.currency_code ? value.currency_code : null)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Currency"
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
                {selectErrors.company_currency && (
                  <div className="mt-2 text-danger">
                    {typeof selectErrors.company_currency === "string" &&
                      selectErrors.company_currency}
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-9">
          Prefix <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-9"
          type="text"
          name="company_prefix"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "company_prefix")
          }
          className={clsx({
            "border-danger": formErrors.company_prefix,
          })}
          placeholder="Enter Prefix"
          value={initFormData.company_prefix}
        />
        {formErrors.company_prefix && (
          <div className="mt-2 text-danger">
            {typeof formErrors.company_prefix === "string" &&
              formErrors.company_prefix}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center col-span-12 mt-5 intro-y sm:justify-end">
        <Button
          variant="primary"
          className="w-24 ml-2"
          type="submit"
          disabled={
            selectErrors.country ||
            selectErrors.state ||
            selectErrors.company_currency ||
            selectErrors.time_zone
          }
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

export default CompanyInfo;
