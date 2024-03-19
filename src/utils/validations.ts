export const validateService = (formData: any) => {
  let errors: any = {};
  const name = formData.get("name");
  const shortName = formData.get("shortName");
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
  const post = formData.get("post");
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

export const validateAboutPage = (formData: any) => {
  let errors: any = {};
  const name = formData.get("name");
  const titleOne = formData.get("titleOne");
  const titleTwo = formData.get("titleTwo");
  const containtOne = formData.get("containtOne");
  const containtTwo = formData.get("containtTwo");
  const visionTitleOne = formData.get("visionTitleOne");
  const visionTitleTwo = formData.get("visionTitleTwo");

  const visionDesscriptionOne = formData.get("visionDesscriptionOne");

  const visionDesscriptionTwo = formData.get("visionDesscriptionTwo");

  if (!name) {
    errors.name = "Name is required";
  } else if (name.trim().length === 0) {
    errors.name = "Name cannot be whitespace only";
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
  if (!visionTitleOne) {
    errors.visionTitleOne = "Title is required";
  } else if (visionTitleOne.trim().length === 0) {
    errors.visionTitleOne = "Title cannot be whitespace only";
  }
  if (!visionTitleTwo) {
    errors.visionTitleTwo = "Title is required";
  } else if (visionTitleTwo.trim().length === 0) {
    errors.visionTitleTwo = "Title cannot be whitespace only";
  }
  if (!visionDesscriptionOne) {
    errors.visionDesscriptionOne = "Description is required";
  } else if (visionDesscriptionOne.trim().length === 0) {
    errors.visionDesscriptionOne = "Description cannot be whitespace only";
  }
  if (!visionDesscriptionTwo) {
    errors.visionDesscriptionTwo = "Description is required";
  } else if (visionDesscriptionTwo.trim().length === 0) {
    errors.visionDesscriptionTwo = "Description cannot be whitespace only";
  }
  return errors;
};

export const validateFAQ = (formData: any) => {
  let errors: any = {};
  const question = formData.get("question");
  const answer = formData.get("answer");
  if (!question) {
    errors.question = "Question is required";
  } else if (question.trim().length === 0) {
    errors.question = "Question cannot be whitespace only";
  }
  if (!answer) {
    errors.answer = "Answer is required";
  } else if (answer.trim().length === 0) {
    errors.answer = "Answer cannot be whitespace only";
  }
  return errors;
};

export const validatePodcast = (formData: any) => {
  let errors: any = {};
  const name = formData.get("name");
  const link = formData.get("link");
  if (!name) {
    errors.name = "name is required";
  } else if (name.trim().length === 0) {
    errors.name = "name cannot be whitespace only";
  }
  if (!link) {
    errors.link = "link is required";
  } else if (link.trim().length === 0) {
    errors.link = "link cannot be whitespace only";
  }
  return errors;
};