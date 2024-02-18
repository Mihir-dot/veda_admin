import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { FormInput, FormLabel } from "../../base-components/Form";
import Button from "../../base-components/Button";
import PageHeader from "../../components/PageHeader";
import { ClassicEditor } from "../../base-components/Ckeditor";
import { validateForm } from "../../utils/validations";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuthHeaders } from "../../utils/helper";
import LoadingIcon from "../../base-components/LoadingIcon";

type InitialState = {
    name: string;
    title: string;
    description: string;
    meta_tags: string;
    meta_desctiption: string;
};

const initialState: InitialState = {
    name: "",
    title: "",
    description: "",
    meta_tags: "",
    meta_desctiption: "",
};

type TextInputState = {
    name: string;
    title: string;
    description: string;
    meta_tags: string;
    meta_desctiption: string;
};
type FormState = TextInputState;
type ErrorState = {
    name: string;
    title: string;
    description: string;
};

const AddDetails: React.FC = () => {
    const [initFormData, setInitFormData] = useState<FormState>({
        ...initialState,
    });
    console.log("initFomr---", initFormData)

    const [formErrors, setFormErrors] = useState<ErrorState>({
        name: "",
        title: "",
        description: "",
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isDetailsAdded = localStorage.getItem("supports");
    const [htmlContent, setHtmlContent] = useState<string>("");
    const id = localStorage.getItem("supports");

    const navigate = useNavigate()

    const handleEditorChange = (e: any) => {
        setInitFormData((prevData) => ({
            ...prevData,
            description: e,
        }));
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            description: e.trim() === "" ? "Description is required" : "",
        }));
    };

    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const { value } = e.target;
        setInitFormData({
            ...initFormData,
            [fieldName]: value,
        });

        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: value.trim() === "" ? `${fieldName} is required` : "",
        }));
    };

    // const handleChange = (key: string, value: string) => {
    //     const form = document.forms.namedItem('detailForm') as HTMLFormElement;
    //     if (form) {
    //         const formData = new FormData(form);
    //         formData.set(key, value);

    //         let errors = validateForm(formData);
    //         setFormErrors(errors);
    //         setIsFormValid(Object.keys(errors).length === 0);
    //     } else {
    //         console.error("Form not found");
    //     }
    // };

    // const handleInputChange = (
    //     e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    //     fieldName: keyof TextInputState
    // ) => {
    //     const value = e.target.value;
    //     setInitFormData((prevState) => ({ ...prevState, [fieldName]: value }));
    //     handleChange(fieldName, value);
    // };

    function parseHTML(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        return doc.documentElement.textContent;
    }
    if (isDetailsAdded) {
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await axios.post("http://64.227.172.121:6009/driver007/getCmsById", { id: isDetailsAdded }, { headers: getAuthHeaders() });
                    const responseData = response.data.data;
                    const initialData = {
                        name: responseData.name,
                        title: responseData.title,
                        description: responseData.description,
                        meta_tags: responseData.meta_tags,
                        meta_desctiption: responseData.meta_description, // Make sure to use the correct key
                    };

                    // Update the state with the new object
                    setInitFormData(initialData);


                    setIsFormValid(true);
                } catch (error) {
                    console.error('Error fetching exercise data:', error);
                }
            };

            fetchData();
        }, [isDetailsAdded]);
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const errors = validateForm(formData);
        setFormErrors(errors);
        const descriptionError = initFormData.description.trim() === "" ? "Description is required" : "";

        // If there is an error, update the formErrors state and prevent submission
        if (descriptionError) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                description: descriptionError,
            }));
            return;
        }
        if (Object.keys(errors).length !== 0) {
            setFormErrors(errors);
            return;
        } else {
            try {
                const description = parseHTML(initFormData.description);
                if (id) {
                    const EditPayload = {
                        id: id,
                        name: initFormData.name,
                        title: initFormData.title,
                        description: initFormData.description,
                        meta_tags: initFormData.meta_tags,
                        meta_desctiption: initFormData.meta_desctiption,
                    };
                    console.log("payload--", EditPayload)
                    setIsLoading(true);
                    const response = await axios.post("http://64.227.172.121:6009/driver007/editCms", EditPayload, { headers: getAuthHeaders() });
                    if (response.data.statusCode === 200) {
                        console.log(response.data.message);
                        setIsLoading(false);
                        navigate("/cms-management");
                    } else {
                        console.error("API request failed:", response.data);
                        setIsLoading(false);

                    }
                } else {

                    const payload = {
                        name: initFormData.name,
                        title: initFormData.title,
                        description: description,
                        meta_tagss: initFormData.meta_tags,
                        meta_desctiption: initFormData.meta_desctiption,
                    };
                    setIsLoading(true);
                    const response = await axios.post("http://64.227.172.121:6009/driver007/addCms", payload, { headers: getAuthHeaders() });

                    if (response.data.statusCode === 200) {
                        console.log(response.data.message);
                        setIsLoading(false);
                        navigate("/cms-management");
                    } else {
                        console.error("API request failed:", response.data);
                        setIsLoading(false);

                    }
                }

            } catch (error) {
                console.error("API request error:", error);
            }
        }

    };


    return (
        <>
            <div>

                <PageHeader
                    HeaderText="CMS List"
                    Breadcrumb={[
                        {
                            name: `${isDetailsAdded ? "Update CMS" : "Add CMS"}`,
                            navigate: "#",
                        },
                    ]}
                    to="/cms-management"
                />
                <div className="flex items-center mt-5">
                    <h2 className="mr-auto text-lg font-medium intro-y">{isDetailsAdded ? "Update CMS" : "Add CMS"}
                    </h2>
                </div>
                <div className="py-5 mt-5 intro-y box">
                    <div className="px-5 sm:px-20">
                        <form
                            className="grid grid-cols-12 gap-4 mt-5 gap-y-5"
                            name="detailForm"
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                        >
                            <div className="col-span-12 intro-y sm:col-span-6">
                                <FormLabel htmlFor="input-wizard-1">
                                    Name <span className="text-red-600 font-bold">*</span>
                                </FormLabel>
                                <FormInput
                                    id="input-wizard-1"
                                    type="text"
                                    name="name"
                                    onInput={(e: ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange(e, "name")
                                    }
                                    value={initFormData.name}
                                />
                                {formErrors.name && (
                                    <div className="mt-2 text-danger">
                                        {typeof formErrors.name === "string" && formErrors.name}
                                    </div>
                                )}
                            </div>
                            <div className="col-span-12 intro-y sm:col-span-6">
                                <FormLabel htmlFor="input-wizard-1">
                                    Page Title <span className="text-red-600 font-bold">*</span>
                                </FormLabel>
                                <FormInput
                                    id="input-wizard-1"
                                    type="text"
                                    name="title"
                                    onInput={(e: ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange(e, "title")
                                    }
                                    value={initFormData.title}
                                />
                                {formErrors.title && (
                                    <div className="mt-2 text-danger">
                                        {typeof formErrors.title === "string" && formErrors.title}
                                    </div>
                                )}
                            </div>
                            <div className="col-span-12 intro-y sm:col-span-12 ">
                                <FormLabel htmlFor="input-wizard-1">
                                    Page Descritption <span className="text-red-600 font-bold">*</span>
                                </FormLabel>
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {/* <Editor
                                        value={initFormData.description}
                                        onChange={handleEditorChange}
                                    /> */}

                                    <ClassicEditor
                                        id="input-wizard-1"
                                        value={initFormData.description}
                                        onChange={handleEditorChange}
                                    />

                                </div>
                                {formErrors.description && (
                                    <div className="mt-2 text-danger">
                                        {typeof formErrors.description === "string" && formErrors.description}
                                    </div>
                                )}
                            </div>
                            <div className="col-span-12 intro-y sm:col-span-6">
                                <FormLabel htmlFor="input-wizard-1">
                                    Meta Tags
                                </FormLabel>
                                <FormInput
                                    id="input-wizard-1"
                                    type="text"
                                    name="meta_tags"
                                    onInput={(e: ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange(e, "meta_tags")
                                    }
                                    value={initFormData.meta_tags}
                                />
                            </div>
                            <div className="col-span-12 intro-y sm:col-span-6">
                                <FormLabel htmlFor="input-wizard-1">
                                    Meta Description
                                </FormLabel>
                                <FormInput
                                    id="input-wizard-1"
                                    type="text"
                                    name="meta_desctiption"
                                    onInput={(e: ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange(e, "meta_desctiption")
                                    }
                                    value={initFormData.meta_desctiption}
                                />
                            </div>
                            {/* <div className="flex items-center col-span-12 mt-5 intro-y">
                                <Button
                                    variant="primary"
                                    className=""
                                    type="submit"
                                >
                                    Add Details

                                </Button>
                                <Button
                                    variant="instagram"
                                    className="ml-2"
                                    type="button"
                                    onClick={() => navigate("/cms-management")}
                                >
                                    Cancel
                                </Button>
                            </div> */}

                            <div className="flex items-center col-span-12 mt-5 intro-y">
                                <Button
                                    variant="primary"
                                    className=""
                                    type="submit"
                                >

                                    {isLoading ? (
                                        <>
                                            {isDetailsAdded ? "Update CMS" : "Add CMS"}
                                            {isDetailsAdded ? localStorage.removeItem("supports") : ""}
                                            <LoadingIcon
                                                icon="oval"
                                                color="white"
                                                className="w-4 h-4 ml-2"
                                            />
                                        </>
                                    ) : (
                                        <> {isDetailsAdded ? "Update CMS" : "Add CMS"}
                                        </>
                                    )}

                                </Button>
                                <Button
                                    variant="instagram"
                                    className="ml-2"
                                    type="button"
                                    onClick={() => {
                                        localStorage.removeItem("supports");
                                        navigate("/cms-management");
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddDetails;
