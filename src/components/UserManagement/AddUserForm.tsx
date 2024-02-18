import React, { useState, ChangeEvent, useEffect } from "react";
import { FormInput, FormLabel } from "../../base-components/Form";
import { Autocomplete, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { selectDarkMode } from "../../stores/darkModeSlice";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import {
  fetchAccountsDropsown,
  fetchAllCountries,
  fetchAllStates,
  fetchCompanyDropdown,
  getAccountDropdownData,
  getCompanyDropdownData,
  getCountriesData,
  getStatesData,
} from "../../stores/commonList";
import {
  addUser,
  editUser,
  fetchSingleUser,
  getUsersData,
} from "../../stores/user";
import { toastMessage } from "../../stores/toastSlice";
import { validateUserInfo } from "../../utils/validations";
import { fetchAllRoles, getRolesData } from "../../stores/manageRole";
import { toast } from "react-toastify";
import LoadingIcon from "../../base-components/LoadingIcon";
import timeZoneData from "../../utils/timezoneData";
import { fetchUserTypeList, getUserTypeData } from "../../stores/usertype";

interface ListOptions {
  name: string;
  id: number;
}

interface RoleOptions {
  role_name: string;
  id: number;
}

interface UserOptions {
  id: number;
  type: string;
}

interface TimeZoneOptions {
  text: string;
}

const initialState = {
  name: "",
  building_name: "",
  street_address: "",
  country: "",
  state: "",
  city: "",
  email: "",
  password: "",
  // confirmPassword: "",
  pincode: "",
  contact_no: "",
  userType: "",
  companySelect: "",
  accountsSelect: "",
  role: "",
  time_zone: "",
};

type SelectState = {
  country: string;
  state: string;
  userType: string | number;
  companySelect: string;
  accountsSelect: string;
  role: string;
  time_zone: string;
};

type TextInputState = {
  name: string;
  building_name: string;
  street_address: string;
  pincode: string;
  contact_no: string;
  email: string;
  password: string;
  city: string;
  // confirmPassword: string;
};

type ErrorState = {
  name: string;
  building_name: string;
  email: string;
  password: string;
  city: string;
  pincode: string;
  contact_no: string;
  // confirmPassword: string;
};

type FormState = SelectState & TextInputState;

const timeZoneOptions = [
  { value: "1", label: "Kolkata" },
  { value: "2", label: "New York" },
  { value: "3", label: "Paris" },
];

const AddUserForm: React.FC = () => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
  });
  const [isCountrySelected, setIsCountrySelected] = useState<boolean>(false);
  const countryOptions: any = useAppSelector(getCountriesData);
  const stateOptions: any = useAppSelector(getStatesData);
  const companyDropdownOptions: any = useAppSelector(getCompanyDropdownData);
  const accountDropdownOptions: any = useAppSelector(getAccountDropdownData);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState<ErrorState>({});
  const { user }: Object = useAppSelector(getUsersData);
  const { roles } = useAppSelector(getRolesData);
  const userDropdownData: [] = useAppSelector(getUserTypeData);
  const toastMsg = useAppSelector(toastMessage);
  const [isUserTypeSelected, setIsUserTypeSelected] = useState<boolean>(false);
  const darkMode = useAppSelector(selectDarkMode);
  const navigate = useNavigate();
  const isUserAdded = localStorage.getItem("newlyAddedUser");
  const [selectErrors, setSelectErrors] = useState<{ [key: string]: string }>({
    country: "",
    state: "",
    userType: "",
    companySelect: "",
    accountsSelect: "",
    role: "",
    time_zone: "",
  });

  const enabledRoles = roles?.filter((role: any) => role.enable === 1);
  const userDropdownOptions: [] = userDropdownData?.filter(
    (user: any) => user.enable === 1
  );

  useEffect(() => {
    dispatch(fetchAllCountries());
    dispatch(fetchUserTypeList());
    dispatch(fetchAllRoles());
    if (isUserAdded) {
      dispatch(fetchSingleUser(isUserAdded));
    }
  }, []);

  useEffect(() => {
    if (initFormData.country !== undefined) {
      if (initFormData.country !== "") {
        dispatch(fetchAllStates(initFormData.country));
      }
    }
  }, [initFormData.country]);

  useEffect(() => {
    setIsFormValid(Object.keys(formErrors).length === 0);
  }, [formErrors]);

  useEffect(() => {
    if (initFormData.userType !== undefined) {
      if (initFormData.userType !== "") {
        if (initFormData.userType === 3) {
          dispatch(fetchAccountsDropsown());
        } else if (initFormData.userType === 1) {
          dispatch(fetchCompanyDropdown());
        }
      }
    }
  }, [initFormData.userType]);

  useEffect(() => {
    if (user !== null && isUserAdded) {
      setIsUserTypeSelected(true);
      setIsCountrySelected(true);
      setInitFormData((prev) => ({
        ...prev,
        name: user.name || "",
        building_name: user.building_name || "",
        street_address: user.street_address || "",
        email: user.email || "",
        country: user.country,
        userType: user.user_type_id,
        accountsSelect: user.account_id !== null ? user.account_id : "",
        companySelect: user.company_id !== null ? user.company_id : "",
        role: user.role_id ? user.role_id : "",
        time_zone: user.time_zone ? user.time_zone : "",
        city: user.city || "",
        state: user.state,
        pincode: user.zipcode || "",
        contact_no: user.contact_no || "",
      }));
    }
  }, [user, isUserAdded]);

  const { control } = useForm({
    mode: "onChange",
    defaultValues: initFormData,
  });

  const handleChange = (key: string, value: string) => {
    const formData = new FormData(document.forms.userForm);
    formData.set(key, value);
    let errors = validateUserInfo(formData);
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
    if (fieldName === "country") {
      setInitFormData((prevState) => ({
        ...prevState,
        state: "",
      }));
      if (!selectedValue) {
        setInitFormData((prevState) => ({
          ...prevState,
          state: "",
        }));
        setSelectErrors((prevErrors) => ({
          ...prevErrors,
          country: "Country is required",
        }));
      } else {
        setSelectErrors((prevErrors) => ({ ...prevErrors, country: "" }));
      }
    }
    if (fieldName === "state") {
      if (!selectedValue) {
        setSelectErrors((prevErrors) => ({
          ...prevErrors,
          state: "State is required",
        }));
      } else {
        setSelectErrors((prevErrors) => ({ ...prevErrors, state: "" }));
      }
    }
    if (fieldName === "userType") {
      setInitFormData((prev) => ({
        ...prev,
        companySelect: "",
        accountsSelect: "",
        role: "",
      }));
      if (!selectedValue) {
        setSelectErrors((prevErrors) => ({
          ...prevErrors,
          userType: "Please select User.",
        }));
      } else {
        setSelectErrors((prevErrors) => ({
          ...prevErrors,
          userType: "",
        }));
      }
      // Clear accountSelect error when userType changes
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        accountsSelect: "",
      }));
      // Clear companySelect error when userType changes
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        companySelect: "",
      }));
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        role: "",
      }));
    }
    if (fieldName === "role") {
      if (!selectedValue) {
        setSelectErrors((prevErrors) => ({
          ...prevErrors,
          role: "Please select Role.",
        }));
      } else {
        setSelectErrors((prevErrors) => ({
          ...prevErrors,
          role: "",
        }));
      }
    }
    if (fieldName === "accountsSelect") {
      if (!selectedValue) {
        setSelectErrors((prevErrors) => ({
          ...prevErrors,
          accountsSelect: "Please select Account.",
        }));
      } else {
        setSelectErrors((prevErrors) => ({
          ...prevErrors,
          accountsSelect: "",
        }));
      }
    }
    if (fieldName === "companySelect") {
      if (!selectedValue) {
        setSelectErrors((prevErrors) => ({
          ...prevErrors,
          companySelect: "Please select Company.",
        }));
      } else {
        setSelectErrors((prevErrors) => ({
          ...prevErrors,
          companySelect: "",
        }));
      }
    }
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
  };

  const submitUserInfo = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const errors = validateUserInfo(formData);
    if (isUserAdded) {
      delete errors.password;
    } else {
      setFormErrors(errors);
    }
    if (!initFormData.country) {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        country: "Country is required",
      }));
    }
    if (!initFormData.state) {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        state: "State is required",
      }));
    }
    if (!initFormData.userType) {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        userType: "Please select any User",
      }));
    }
    if (!initFormData.time_zone) {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        time_zone: "Time Zone is required",
      }));
    }
    if (!initFormData.role) {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        role: "Role is required",
      }));
    }
    if (initFormData.userType === 1 && !initFormData.companySelect) {
      initFormData.accountsSelect = "";
      setSelectErrors((prev) => ({
        ...prev,
        accountsSelect: "",
        companySelect: "Company is required",
      }));
    }
    if (initFormData.userType === 3 && !initFormData.accountsSelect) {
      initFormData.companySelect = "";
      setSelectErrors((prev) => ({
        ...prev,
        companySelect: "",
        accountsSelect: "Account is required",
      }));
    }
    const selectFieldErrorsExist =
      selectErrors.userType ||
      selectErrors.country ||
      selectErrors.role ||
      selectErrors.accountsSelect ||
      selectErrors.companySelect ||
      selectErrors.time_zone ||
      selectErrors.state;
    if (!initFormData.state || !initFormData.role) {
      return toast.error("Please fill all the required fields.");
    }
    if (selectFieldErrorsExist || Object.keys(errors).length > 0) {
      return;
    } else {
      const payload = {
        name: initFormData.name,
        email: initFormData.email,
        country: initFormData.country,
        building_name: initFormData.building_name,
        street_address: initFormData.street_address,
        state: initFormData.state,
        city: initFormData.city,
        zipcode: initFormData.pincode,
        contact_no: initFormData.contact_no,
        user_type_id: initFormData.userType,
        account_id: initFormData.accountsSelect
          ? initFormData.accountsSelect
          : null,
        role_id: initFormData.role,
        company_id: initFormData.companySelect
          ? initFormData.companySelect
          : null,
        time_zone: initFormData.time_zone,
        password: initFormData.password,
      };
      if (isUserAdded) {
        delete payload.password;
        try {
          setIsLoading(true);
          const res = await dispatch(editUser({ ...payload, id: isUserAdded }));
          if (res.payload === undefined)
            return toast.error(toastMsg || "Something went wrong.");
          toast.success(res.payload.message || "User Updated Successfully.");
          localStorage.removeItem("newlyAddedUser");
          navigate("/user");
        } catch (error) {
          console.log("Err--", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        try {
          setIsLoading(true);
          const res = await dispatch(addUser(payload));
          if (res.payload === undefined)
            return toast.error(toastMsg || "Something went wrong.");
          toast.success(res.payload.message || "User Added Successfully.");
          navigate("/user");
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
      onSubmit={submitUserInfo}
      name="userForm"
    >
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
          value={initFormData.name}
        />
        {formErrors.name && (
          <div className="mt-2 text-danger">
            {typeof formErrors.name === "string" && formErrors.name}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-2">
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
              (option: ListOptions) => option.id === initFormData.country
            );
            const defaultValue =
              (selectedState === undefined ? selectedCountry : selectedState) ||
              null;
            return (
              <>
                <Autocomplete
                  disablePortal
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
                    "border-danger": selectErrors.country,
                  })}
                  size="small"
                  id="combo-box-demo"
                  value={defaultValue}
                  options={countryOptions?.map((data: ListOptions) => ({
                    value: data.id,
                    label: data.name,
                  }))}
                  getOptionLabel={(option) => option.label ?? option.name}
                  onChange={(_, newVal) => {
                    onChange(newVal?.value || "");
                    handleSelectChange(newVal?.value || "", "country");
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
          Email Address <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-3"
          type="email"
          name="email"
          className={clsx({
            "border-danger": formErrors.email,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "email")
          }
          placeholder="Enter Email Address"
          value={initFormData.email}
        />
        {formErrors.email && (
          <div className="mt-2 text-danger">
            {typeof formErrors.email === "string" && formErrors.email}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-12">
          Building Name / Address 1{" "}
          <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-12"
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
        <FormLabel htmlFor="input-wizard-13">
          Street Address / Address 2
        </FormLabel>
        <FormInput
          id="input-wizard-13"
          type="text"
          name="street_address"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "street_address")
          }
          placeholder="Street Address"
          value={initFormData.street_address ? initFormData.street_address : ""}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-11">
          Suburb / City <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-11"
          type="text"
          name="city"
          className={clsx({
            "border-danger": formErrors.city,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "city")
          }
          placeholder="Enter City"
          value={initFormData.city}
        />
        {formErrors.city && (
          <div className="mt-2 text-danger">
            {typeof formErrors.city === "string" && formErrors.city}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6">
        <FormLabel htmlFor="input-wizard-8">
          State <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="state"
          control={control}
          render={({ field: { onChange } }) => {
            const selectedOneState = stateOptions?.find(
              (option: ListOptions) => option.id === initFormData.state
            );
            const defaultValue = !isCountrySelected
              ? null
              : selectedOneState || null;
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
                  id="combo-box-demo-4"
                  value={!isCountrySelected ? null : defaultValue}
                  options={stateOptions?.map((data: ListOptions) => ({
                    value: data.id,
                    label: data.name,
                  }))}
                  getOptionLabel={(option) => option.label ?? option.name}
                  onChange={(_, newVal) => {
                    onChange(newVal?.value || "");
                    handleSelectChange(newVal?.value, "state");
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
      <div className={`intro-y col-span-12 sm:col-span-6`}>
        <FormLabel htmlFor="input-wizard-4">
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
                    "border-danger": selectErrors.time_zone,
                  })}
                  id="combo-box-demo-5"
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
      {!isUserAdded && (
        <div className="col-span-12 intro-y md:col-span-4">
          <FormLabel htmlFor="input-wizard-5">
            Password <span className="text-red-600 font-bold">*</span>
          </FormLabel>
          <FormInput
            id="input-wizard-5"
            type="password"
            name="password"
            className={clsx({
              "border-danger": formErrors.password,
            })}
            onInput={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "password")
            }
            placeholder="Enter Password"
            value={initFormData.password}
          />
          {formErrors.password && (
            <div className="mt-2 text-danger">
              {typeof formErrors.password === "string" && formErrors.password}
            </div>
          )}
        </div>
      )}
      {/* <div className="col-span-12 intro-y">
        <FormLabel htmlFor="input-wizard-5">
          Confirm Password <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-5"
          type="password"
          name="confirmPassword"
          className={clsx({
            "border-danger": formErrors.confirmPassword,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "confirmPassword")
          }
          disabled={initFormData.password === ""}
          placeholder="ReEnter Password"
          value={initFormData.password ? initFormData.confirmPassword : ""}
        />
        {formErrors.confirmPassword && (
          <div className="mt-2 text-danger">
            {typeof formErrors.confirmPassword === "string" &&
              formErrors.confirmPassword}
          </div>
        )}
      </div> */}
      <div
        className={`col-span-12 intro-y ${
          isUserAdded ? "md:col-span-6" : "md:col-span-4"
        }`}
      >
        <FormLabel htmlFor="input-wizard-14">
          Postcode <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-14"
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
      <div
        className={`col-span-12 intro-y ${
          isUserAdded ? "md:col-span-6" : "md:col-span-4"
        }`}
      >
        <FormLabel htmlFor="input-wizard-15">
          Contact No <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-15"
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
      <div className="col-span-12 intro-y md:col-span-6">
        <FormLabel htmlFor="input-wizard-6">
          User Type <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="userType"
          control={control}
          render={({ field: { onChange, value } }) => {
            const selectedState: any = userDropdownOptions?.find(
              (option: UserOptions) => option.id === value
            );
            const selectedUser = userDropdownOptions?.find(
              (option: UserOptions) => option.id === initFormData.userType
            );
            const defaultValue =
              (selectedState === undefined ? selectedUser : selectedState) ||
              null;
            return (
              <>
                <Autocomplete
                  disablePortal
                  className={clsx({
                    "border-danger": selectErrors.userType,
                  })}
                  size="small"
                  id="combo-box-demo-1"
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
                  options={userDropdownOptions?.map((data: UserOptions) => ({
                    value: data.id,
                    label: data.type.toLocaleUpperCase(),
                  }))}
                  getOptionLabel={(option) =>
                    option.label ?? option.type?.toLocaleUpperCase()
                  }
                  onChange={(_, newVal) => {
                    onChange(newVal?.value || "");
                    handleSelectChange(newVal?.value || "", "userType");
                    if (newVal?.value && newVal?.value !== "") {
                      setIsUserTypeSelected(true);
                      if (newVal.value === "accountsAdmin") {
                        handleSelectChange("", "companySelect");
                      } else if (newVal.value === "companyAdmin") {
                        handleSelectChange("", "accountsSelect");
                      }
                    } else {
                      setIsUserTypeSelected(false);
                    }
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.value === (value.id ? value.id : null)
                  }
                  disabled={isUserAdded ? true : false}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="User Type"
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
                {selectErrors.userType && (
                  <div className="mt-2 text-danger">
                    {typeof selectErrors.userType === "string" &&
                      selectErrors.userType}
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
      {isUserTypeSelected && initFormData.userType === 3 && (
        <div className="col-span-12 intro-y md:col-span-6">
          <FormLabel htmlFor="input-wizard-7">
            Accounts Select <span className="text-red-600 font-bold">*</span>
          </FormLabel>
          <Controller
            name="accountsSelect"
            control={control}
            render={({ field: { onChange } }) => {
              const selectedAccount = accountDropdownOptions?.find(
                (option: ListOptions) =>
                  option.id === initFormData.accountsSelect
              );
              const defaultValue = !isUserTypeSelected
                ? null
                : selectedAccount || null;
              return (
                <>
                  <Autocomplete
                    disablePortal
                    className={clsx({
                      "border-danger": selectErrors.accountsSelect,
                    })}
                    size="small"
                    id="combo-box-demo-2"
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
                    value={!isUserTypeSelected ? null : defaultValue}
                    options={accountDropdownOptions?.map(
                      (data: ListOptions) => ({
                        value: data.id,
                        label: data.name,
                      })
                    )}
                    getOptionLabel={(option) => option.label ?? option.name}
                    onChange={(_, newVal) => {
                      onChange(newVal?.value || "");
                      handleSelectChange(newVal?.value || "", "accountsSelect");
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.value === (value.id ? value.id : null)
                    }
                    disabled={isUserAdded ? true : false}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Accounts"
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
                  {selectErrors.accountsSelect && (
                    <div className="mt-2 text-danger">
                      {typeof selectErrors.accountsSelect === "string" &&
                        selectErrors.accountsSelect}
                    </div>
                  )}
                </>
              );
            }}
          />
        </div>
      )}
      {isUserTypeSelected && initFormData.userType === 1 && (
        <div className="col-span-12 intro-y md:col-span-6">
          <FormLabel htmlFor="input-wizard-8">
            Company Select <span className="text-red-600 font-bold">*</span>
          </FormLabel>
          <Controller
            name="companySelect"
            control={control}
            render={({ field: { onChange } }) => {
              const selectedCompany = companyDropdownOptions?.find(
                (option: ListOptions) =>
                  option.id === initFormData.companySelect
              );
              const defaultValue = !isUserTypeSelected
                ? null
                : selectedCompany || null;
              return (
                <>
                  <Autocomplete
                    disablePortal
                    className={clsx({
                      "border-danger": selectErrors.companySelect,
                    })}
                    size="small"
                    id="combo-box-demo-2"
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
                    value={!isUserTypeSelected ? null : defaultValue}
                    options={companyDropdownOptions?.map(
                      (data: ListOptions) => ({
                        value: data.id,
                        label: data.name,
                      })
                    )}
                    getOptionLabel={(option) => option.label ?? option.name}
                    onChange={(_, newVal) => {
                      onChange(newVal?.value || "");
                      handleSelectChange(newVal?.value || "", "companySelect");
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.value === (value.id ? value.id : null)
                    }
                    disabled={isUserAdded ? true : false}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Company"
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
                  {selectErrors.companySelect && (
                    <div className="mt-2 text-danger">
                      {typeof selectErrors.companySelect === "string" &&
                        selectErrors.companySelect}
                    </div>
                  )}
                </>
              );
            }}
          />
        </div>
      )}
      <div className="col-span-12 intro-y">
        <FormLabel htmlFor="input-wizard-9">
          Role Select <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="role"
          control={control}
          render={({ field: { onChange } }) => {
            const selectedRole = enabledRoles?.find(
              (option: RoleOptions) => option.id === initFormData.role
            );
            const defaultValue = !isUserTypeSelected
              ? null
              : selectedRole || null;
            return (
              <>
                <Autocomplete
                  disablePortal
                  className={clsx({
                    "border-danger": selectErrors.role,
                  })}
                  size="small"
                  id="combo-box-demo-3"
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
                  value={!isUserTypeSelected ? null : defaultValue}
                  options={enabledRoles?.map((data: RoleOptions) => ({
                    value: data.id,
                    label: data.role_name.toLocaleUpperCase(),
                  }))}
                  getOptionLabel={(option) =>
                    option.label ?? option.role_name?.toLocaleUpperCase()
                  }
                  onChange={(_, newVal) => {
                    onChange(newVal?.value || "");
                    handleSelectChange(newVal?.value, "role");
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.value === (value.id ? value.id : null)
                  }
                  disabled={!!isUserAdded || !isUserTypeSelected}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Role"
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
                {selectErrors.role && (
                  <div className="mt-2 text-danger">
                    {typeof selectErrors.role === "string" && selectErrors.role}
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
      <div className="flex items-center col-span-12 mt-5 intro-y">
        <Button
          variant="primary"
          className=""
          type="submit"
          disabled={
            selectErrors.country ||
            selectErrors.role ||
            selectErrors.userType ||
            selectErrors.companySelect ||
            selectErrors.accountsSelect ||
            selectErrors.state
          }
        >
          {isLoading ? (
            <>
              {isUserAdded ? "Update User" : "Save User"}
              <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>{isUserAdded ? "Update User" : "Save User"}</>
          )}
        </Button>
        {isUserAdded && (
          <Button
            variant="instagram"
            className="ml-2"
            type="button"
            onClick={() => {
              localStorage.removeItem("newlyAddedUser");
              navigate("/user");
            }}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default AddUserForm;
