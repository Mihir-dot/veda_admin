export const validateService = (formData: any) => {
  let errors: any = {};
  const name = formData.get("name");
  const shortName=formData.get("shortName");
  const titleOne = formData.get("titleOne");
  const containtOne = formData.get("containtOne");
  const titleTwo = formData.get("titleTwo");
  const containtTwo = formData.get("containtTwo");

  if (!name) {
    errors.name = "Name is required";
  } else if (name.trim().length === 0) {
    errors.name = "Name cannot be whitespace only";
  }
  if (!shortName) {
    errors.shortName = "short Name is required";
  } else if (shortName.trim().length === 0) {
    errors.shortName = "Short Name cannot be whitespace only";
  }

  if (!titleOne) {
    errors.titleOne = "Main Title is required";
  } else if (titleOne.trim().length === 0) {
    errors.titleOne = "Main Title cannot be whitespace only";
  }
  if (!containtOne) {
    errors.containtOne = "Main Content is required";
  } else if (containtOne.trim().length === 0) {
    errors.containtOne = "Main Content cannot be whitespace only";
  }
  if (!titleTwo) {
    errors.titleTwo = "Sub Title is required";
  } else if (titleTwo.trim().length === 0) {
    errors.titleTwo = "Sub Title cannot be whitespace only";
  }
  if (!containtTwo) {
    errors.containtTwo = "Sub Content is required";
  } else if (containtTwo.trim().length === 0) {
    errors.containtTwo = "Sub Content cannot be whitespace only";
  }
  return errors;
};
