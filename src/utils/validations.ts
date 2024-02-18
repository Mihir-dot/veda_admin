export const validateCompanyInfo = (formData: any) => {
  let errors: any = {};
  const name = formData.get("name");
  const building_name = formData.get("building_name");
  const city = formData.get("city");
  const email = formData.get("email");
  const zipcode = formData.get("zipcode");
  const company_prefix = formData.get("company_prefix");
  const help_line_number = formData.get("help_line_number");

  if (!name) {
    errors.name = "Name is required";
  } else if (name.trim().length === 0) {
    errors.name = "Name cannot be whitespace only";
  }

  if (!building_name) {
    errors.building_name = "Building Name is required";
  } else if (building_name.trim().length === 0) {
    errors.building_name = "Building Name cannot be whitespace only";
  }

  if (!city) {
    errors.city = "City is required";
  } else if (city.trim().length === 0) {
    errors.city = "City cannot be whitespace only";
  }

  if (!zipcode) {
    errors.zipcode = "Zipcode is required";
  } else if (zipcode.trim().length === 0) {
    errors.zipcode = "Zipcode cannot be whitespace only";
  }

  if (!help_line_number) {
    errors.help_line_number = "Contact Number is required";
  } else if (help_line_number.trim().length === 0) {
    errors.help_line_number = "Contact Number cannot be whitespace only";
  } else if (
    !/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i.test(
      help_line_number
    )
  ) {
    errors.help_line_number = "Contact Number is not valid";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (email.trim().length === 0) {
    errors.email = "Email can not be whitespace only";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    errors.email = "Email is not valid";
  }

  if (!company_prefix) {
    errors.company_prefix = "Prefix Name is required";
  } else if (company_prefix.trim().length === 0) {
    errors.company_prefix = "Prefix Name cannot be whitespace only";
  } else if (company_prefix.length < 3 || company_prefix.length > 5) {
    errors.company_prefix = "Prefix Name must be between 3 to 5 characters";
  } else if (!/^[a-zA-Z\s]+$/.test(company_prefix)) {
    errors.company_prefix =
      "Prefix Name can only contain alphabetic characters";
  }

  return errors;
};

export const validateAccountsInfo = (formData: any) => {
  let errors: any = {};
  const name = formData.get("name");
  const building_name = formData.get("building_name");
  const suburb = formData.get("suburb");
  const pincode = formData.get("pincode");
  const contact_no = formData.get("contact_no");

  if (!name) {
    errors.name = "Name is required";
  } else if (name.trim().length === 0) {
    errors.name = "Name cannot be whitespace only";
  }

  if (!building_name) {
    errors.building_name = "Building Name is required";
  } else if (building_name.trim().length === 0) {
    errors.building_name = "Building Name cannot be whitespace only";
  }

  if (!suburb) {
    errors.suburb = "City is required";
  } else if (suburb.trim().length === 0) {
    errors.suburb = "City cannot be whitespace only";
  }

  if (!pincode) {
    errors.pincode = "Pincode is required";
  } else if (pincode.trim().length === 0) {
    errors.pincode = "Pincode cannot be whitespace only";
  }

  if (!contact_no) {
    errors.contact_no = "Contact Number is required";
  } else if (contact_no.trim().length === 0) {
    errors.contact_no = "Contact Number cannot be whitespace only";
  } else if (
    !/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i.test(
      contact_no
    )
  ) {
    errors.contact_no = "Contact Number is not valid";
  }

  return errors;
};

export const validateUserInfo = (formData: any) => {
  let errors: any = {};
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const city = formData.get("city");
  const building_name = formData.get("building_name");
  const pincode = formData.get("pincode");
  const contact_no = formData.get("contact_no");
  // const confirmPassword = formData.get("confirmPassword");

  if (!name) {
    errors.name = "Name is required";
  } else if (name.trim().length === 0) {
    errors.name = "Name cannot be whitespace only";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (email.trim().length === 0) {
    errors.email = "Email Name cannot be whitespace only";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    errors.email = "Email is not valid";
  }

  if (!building_name) {
    errors.building_name = "Building Name is required";
  } else if (building_name.trim().length === 0) {
    errors.building_name = "Building Name cannot be whitespace only";
  }

  if (!pincode) {
    errors.pincode = "Pincode is required";
  } else if (pincode.trim().length === 0) {
    errors.pincode = "Pincode cannot be whitespace only";
  }

  if (!contact_no) {
    errors.contact_no = "Contact Number is required";
  } else if (contact_no.trim().length === 0) {
    errors.contact_no = "Contact Number cannot be whitespace only";
  } else if (
    !/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/i.test(
      contact_no
    )
  ) {
    errors.contact_no = "Contact Number is not valid";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.trim().length === 0) {
    errors.password = "Password cannot be whitespace only";
  }

  if (!city) {
    errors.city = "City is required";
  } else if (city.trim().length === 0) {
    errors.city = "City cannot be whitespace only";
  }

  // if (!confirmPassword) {
  //   errors.confirmPassword = "Confirm Password is required";
  // } else if (confirmPassword.trim().length === 0) {
  //   errors.confirmPassword = "Confirm Password cannot be whitespace only";
  // } else if (password !== confirmPassword) {
  //   errors.confirmPassword = "Passwords do not match";
  // }

  return errors;
};
export const validateForm = (formData: any) => {
  let errors: any = {};
  const name = formData.get("name");
  const title = formData.get("title");
  // const description = formData.get("description");

  if (!name) {
    errors.name = "Name is required";
  } else if (name.trim().length === 0) {
    errors.name = "Name cannot be whitespace only";
  }
  if (!title) {
    errors.title = "Title is required";
  } else if (title.trim().length === 0) {
    errors.title = "Title cannot be whitespace only";
  }
  // if (!description) {
  //   errors.description = "Description is required";
  // } else if (description.trim().length === 0) {
  //   errors.description = "Description cannot be whitespace only";
  // }

  return errors;
};
