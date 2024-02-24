import React, { useState, ChangeEvent, useEffect } from "react";
import { FormInput, FormLabel, FormTextarea } from "../../base-components/Form";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useAppDispatch } from "../../stores/hooks";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingIcon from "../../base-components/LoadingIcon"
import { reach } from "yup";
import { validateService} from "../../utils/validations";
import { getAuthHeaders } from "../../utils/helper";


const initialState = {
    _id: "",
    name: "",
    titleOne:"",
    containtOne:"",
    titleTwo:"",
    containtTwo:"",
    banner: null,
    image: null,
};

type TextInputState = {
    _id: string;
    name: string;
    titleOne:string,
    containtOne:string,
    titleTwo:string,
    containtTwo:string,
    banner: File | null,
    image: File | null;
};

type ErrorState = {
    name: string;
    titleOne:string,
    containtOne:string,
    titleTwo:string,
    containtTwo:string,
};
type ImageState = {

    image: File | null;
    banner: File | null;

};

type FormState = TextInputState;

const AddSevice: React.FC = () => {
    const [initFormData, setInitFormData] = useState<FormState>({
        ...initialState,
    });
    console.log("data---",initFormData)
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const isServiceAdded = localStorage.getItem("newServiceAdded");

    const [formErrors, setFormErrors] = useState<ErrorState>({
        name: "",
        titleOne:"",
        containtOne:"",
        titleTwo:"",
        containtTwo:"",
    });
    const [imageError, setImageError] = useState({
        image: "",
        banner: ""
    });

    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (isExerciseAdded) {
    //             try {
    //                 const response = await dispatch(fetchSingleExercises())
    //                 const exerciseData = response.payload.data;

    //                 setInitFormData(exerciseData);

    //                 setIsFormValid(true);
    //             } catch (error) {
    //                 console.error('Error fetching exercise data:', error);
    //             }
    //         }
    //     };

    //     fetchData();
    // }, [dispatch, isExerciseAdded]);

    const handleChange = (key: string, value: string) => {
        const form = document.forms.namedItem('serviceForm') as HTMLFormElement;
        if (form) {
            const formData = new FormData(form);
            formData.set(key, value);

            let errors = validateService(formData);
            setFormErrors(errors);
            setIsFormValid(Object.keys(errors).length === 0);
        } else {
            console.error("Form not found");
        }
    };


    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
        fieldName: keyof TextInputState
    ) => {
        const value = e.target.value;
        setInitFormData((prevState) => ({ ...prevState, [fieldName]: value }));
        handleChange(fieldName, value);
    };
    
    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>,
        fieldName: "image" | "banner"
    ) => {
        const file = event.target.files?.[0];

        const checkFile = (
            allowedImageExtensions: string[],
            allowedBannerExtensions: string[],
            fileType: string
        ) => {
            const fileExtension = (file?.name.split(".").pop() || "").toLowerCase();
            let allowedExtensions: string[];
        
            if (fileType === "image") {
                allowedExtensions = allowedImageExtensions;
            } else if (fileType === "banner") {
                allowedExtensions = allowedBannerExtensions;
            } else {
                allowedExtensions = []; // Handle other file types here if needed
            }
        
            if (file && allowedExtensions.includes(fileExtension)) {
                setInitFormData((prevState) => ({
                    ...prevState,
                    [fieldName]: file,
                }));
                setImageError((prev) => ({
                    ...prev,
                    [fieldName]: "",
                }));
            } else {
                setImageError((prev) => ({
                    ...prev,
                    [fieldName]: `Please select a ${fileType} file with ${allowedExtensions.join(', ')} extension`,
                }));
                setInitFormData((prev) => ({
                    ...prev,
                    [fieldName]: null,
                }));
            }
        };
        
        if (fieldName === "image") {
            checkFile(["jpg", "jpeg", "png"], [], "image");
        } else if (fieldName === "banner") {
            checkFile([], ["jpg", "jpeg", "png"], "banner");
        } else {
            // Handle other file types if needed
            checkFile([], [], "other");
        }
        
    };
    
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set("id", initFormData._id);
        formData.set("name", initFormData.name);
        formData.set("titleOne", initFormData.titleOne);
        formData.set("containtOne", initFormData.containtOne);
        formData.set("titleTwo", initFormData.titleTwo);
        formData.set("containtTwo", initFormData.containtTwo);
        formData.set("image", initFormData.image as File);
        formData.set("banner", initFormData.banner as File);
        const imageErrors = {
            image: "",
            banner: ""
        }
        if (!initFormData.image) {
            imageErrors.image = "Please attach an image file"
        }
        if (!initFormData.banner) {
            imageErrors.banner = "Please attach a banner file"
        }
        const errors = validateService(formData);
        if (imageErrors.image || imageErrors.banner || Object.keys(errors).length !== 0) {
            setFormErrors(errors);
            setImageError(imageErrors);
            return;
        } else {
            setIsLoading(true);
            const response = await axios.post(
                'http://localhost:5000/api/create/services',
                formData,
                {
                  headers: getAuthHeaders(),
                }
              );
              console.log("response--",response)
              if (response.data) {
                toast.success(response.data.message);
                navigate('/service');
              }
    };
}
   
    return (
        <>
            <div>
                <PageHeader
                    HeaderText="Service"
                    Breadcrumb={[
                        {
                            name: `${isServiceAdded ? "Service Update" : "Service Add"}`,
                            navigate: "#",
                        },
                    ]}
                    to="/service"
                />
                <div className="flex items-center mt-5">
                    <h2 className="mr-auto text-lg font-medium intro-y">
                        {isServiceAdded ? "Update Service" : "Add Service"}
                    </h2>
                </div>
                <div className="py-5 mt-5 intro-y box">
                    <div className="px-5 sm:px-20">
                        <form
                            className="grid grid-cols-12 gap-4 mt-5 gap-y-5"
                            name="serviceForm"
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                        >
                            <div className="col-span-12 intro-y sm:col-span-12">
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

                            <div className="col-span-6 intro-y sm:col-span-6">
                                <FormLabel htmlFor="input-wizard-1">
                                    Main Title <span className="text-red-600 font-bold">*</span>
                                </FormLabel>
                                <FormInput
                                    id="input-wizard-1"
                                    type="text"
                                    name="titleOne"
                                    className={clsx({
                                        "border-danger": formErrors.titleOne,
                                    })}
                                    onInput={(e: ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange(e, "titleOne")
                                    }
                                    placeholder="Enter Main Title"
                                    value={initFormData.titleOne}
                                />
                                {formErrors.titleOne && (
                                    <div className="mt-2 text-danger">
                                        {typeof formErrors.titleOne === "string" && formErrors.titleOne}
                                    </div>
                                )}
                            </div>

                            <div className="col-span-6 intro-y sm:col-span-6">
                                <FormLabel htmlFor="input-wizard-1">
                                    Main Description <span className="text-red-600 font-bold">*</span>
                                </FormLabel>
                                <FormTextarea
                                    id="input-wizard-1"
                                    name="containtOne"
                                    className={clsx({
                                        "border-danger": formErrors.containtOne,
                                    })}
                                    onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                        handleInputChange(e, "containtOne")
                                    }
                                    placeholder="Enter Main Content"
                                    value={initFormData.containtOne}
                                />
                                {formErrors.containtOne && (
                                    <div className="mt-2 text-danger">
                                        {typeof formErrors.containtOne === "string" && formErrors.containtOne}
                                    </div>
                                )}
                            </div>
                            <div className="col-span-6 intro-y sm:col-span-6">
                                <FormLabel htmlFor="input-wizard-1">
                                    Sub Title <span className="text-red-600 font-bold">*</span>
                                </FormLabel>
                                <FormInput
                                    id="input-wizard-1"
                                    type="text"
                                    name="titleTwo"
                                    className={clsx({
                                        "border-danger": formErrors.titleTwo,
                                    })}
                                    onInput={(e: ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange(e, "titleTwo")
                                    }
                                    placeholder="Enter Sub Title"
                                    value={initFormData.titleTwo}
                                />
                                {formErrors.titleTwo && (
                                    <div className="mt-2 text-danger">
                                        {typeof formErrors.titleTwo === "string" && formErrors.titleTwo}
                                    </div>
                                )}
                            </div>

                            <div className="col-span-6 intro-y sm:col-span-6">
                                <FormLabel htmlFor="input-wizard-1">
                                    Sub Description <span className="text-red-600 font-bold">*</span>
                                </FormLabel>
                                <FormTextarea
                                    id="input-wizard-1"
                                    name="containtTwo"
                                    className={clsx({
                                        "border-danger": formErrors.containtTwo,
                                    })}
                                    onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                        handleInputChange(e, "containtTwo")
                                    }
                                    placeholder="Enter Sub Content"
                                    value={initFormData.containtTwo}
                                />
                                {formErrors.containtTwo && (
                                    <div className="mt-2 text-danger">
                                        {typeof formErrors.containtTwo === "string" && formErrors.containtTwo}
                                    </div>
                                )}
                            </div>
                            <div className="col-span-6 intro-y sm:col-span-6">
                                <FormLabel htmlFor="input-wizard-1">
                                    Banner Image<span className="text-red-600 font-bold">*</span>
                                </FormLabel>
                                <FormInput
                                    id="input-wizard-1"
                                    type="file"
                                    name="banner"
                                    onChange={(e) => handleFileChange(e, "banner")}
                                    className="border border-gray-200 p-1 bg-white"
                                />
                                {imageError.banner && (
                                    <div className="mt-2 text-danger">
                                        {typeof imageError.banner === "string" && imageError.banner}
                                    </div>
                                )}
                            </div>
                            <div className="col-span-6 intro-y sm:col-span-6">
                                <FormLabel htmlFor="input-wizard-1">
                                     Image<span className="text-red-600 font-bold">*</span>
                                </FormLabel>
                                <FormInput
                                    id="input-wizard-1"
                                    type="file"
                                    name="image"
                                    onChange={(e) => handleFileChange(e, "image")}
                                    className="border border-gray-200 p-1 bg-white"
                                />
                                {imageError.image && (
                                    <div className="mt-2 text-danger">
                                        {typeof imageError.image === "string" && imageError.image}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center col-span-12 mt-5 intro-y">
                                <Button
                                    variant="primary"
                                    className=""
                                    type="submit"
                                    // disabled={imageError.image || imageError.video ? true : false}
                                >

                                    {isLoading ? (
                                        <>
                                            {isServiceAdded ? "Update Service" : "Add Service"}
                                            <LoadingIcon
                                                icon="oval"
                                                color="white"
                                                className="w-4 h-4 ml-2"
                                            />
                                        </>
                                    ) : (
                                        <> {isServiceAdded ? "Update Service" : "Add Service"}
                                        </>
                                    )}

                                </Button>
                                    <Button
                                        variant="instagram"
                                        className="ml-2"
                                        type="button"
                                        onClick={() => {
                                            localStorage.removeItem("newExerciseAdded");
                                            navigate("/exercise");
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

export default AddSevice;
