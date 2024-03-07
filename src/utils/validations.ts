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


export const validateReview = (formData: any) => {
  let errors: any = {};
  const name = formData.get("name");
  const post=formData.get("post");
  const rating = formData.get("rating");
  const text = formData.get("text");

  if (!name) {
    errors.name = "Name is required";
  } else if (name.trim().length === 0) {
    errors.name = "Name cannot be whitespace only";
  }
  if (!post) {
    errors.post = "Post is required";
  } else if (post.trim().length === 0) {
    errors.post = "Post cannot be whitespace only";
  }

  if (!rating) {
    errors.rating = "Rating is required";
  } else if (rating.trim().length === 0) {
    errors.rating = "Rating cannot be whitespace only";
  }
  if (!text) {
    errors.text = "Review Text is required";
  } else if (text.trim().length === 0) {
    errors.text = "Review Text cannot be whitespace only";
  }
  return errors;
};
