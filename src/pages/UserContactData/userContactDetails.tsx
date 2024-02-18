import React, { useState, useEffect, useRef } from "react";
import Button from "../../base-components/Button";
import { toast } from "react-toastify";
import { Dialog } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import Tippy from "../../base-components/Tippy";
import axios from "axios";
import { FormTextarea } from "../../base-components/Form";

interface UserDetailsProps {
    addModal: boolean;
    setAddModal: (role: boolean) => void;
    userId: string | null
}

const initialState = {
    name: "",
    email: "",
    phone: "",
    subject:"",
    message : ""
};

type TextInputState = {
    name: string;
    email: string;
    phone:string;
    subject: string;
    message:string;
};

const UserContactDetails: React.FC<UserDetailsProps> = ({ addModal, setAddModal, userId }) => {
    const addRoleButtonRef = useRef(null);
    const [formData, setFormData] = useState<TextInputState>({
        ...initialState,
    });
    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // const fetchUserData = async () => {
    //     try {
    //         const response = await axios.post(`${API_PATH.GET_SINGLE_EXERCISE}`,
    //             {
    //                 id: userId,
    //             },
    //             {
    //                 headers: getAuthHeaders()
    //             }
    //         );
    //         if (response.data.statusCode === 200) {
    //             setUserData(response.data.data);
    //         } else {
    //             toast.error("Failed to fetch user data");
    //         }
    //         setIsLoading(false);
    //     } catch (error) {
    //         toast.error("An error occurred while fetching user data");
    //         setIsLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     if (userId) {
    //         fetchUserData()
    //     }
    // }, [userId]);

    const handleCloseModal = () => {
        setAddModal(false);
        setFormData(initialState);
    };

    return (
        <>
            <Dialog
                open={addModal}
                onClose={handleCloseModal}
                staticBackdrop
                initialFocus={addRoleButtonRef}
                size="lg"
            >
                <Dialog.Panel>
                    <div className="px-5 py-3 text-center">
                        <div className="text-xl mt-3">User Contact Details</div>
                    </div>
                    <div className="col-span-12 overflow-y-auto max-h-[350px] intro-y px-5 border">
                        <Table className="">
                            <Table.Tbody>
                                <Table.Tr>
                                    <Table.Th className="border-b-0 whitespace-nowrap">
                                        Name
                                    </Table.Th>
                                    <Table.Td className="border-b-0 whitespace-nowrap">
                                        {/* {userData && userData.name ? userData.name : "-"} */}
                                        Bhavisha
                                    </Table.Td>
                                </Table.Tr>
                               
                                <Table.Tr>
                                    <Table.Th className="border-b-0 whitespace-nowrap">
                                        Email
                                    </Table.Th>
                                    <Table.Td className="border-b-0 whitespace-nowrap">
                                        {/* {userData && userData.description ? (
                                            <FormTextarea
                                                value={userData.description}
                                                className="w-full border rounded-lg p-2 h-32 "
                                            />
                                        ) : "-"} */}
                                        bhavisha123@gmail.com
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th className="border-b-0 whitespace-nowrap">
                                        Phone Number
                                    </Table.Th>
                                    <Table.Td className="border-b-0 whitespace-nowrap">
                                      9898989889
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th className="border-b-0 whitespace-nowrap">
                                        Subject
                                    </Table.Th>
                                    <Table.Td className="border-b-0 whitespace-nowrap">
                                   Testing
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th className="border-b-0 whitespace-nowrap">
                                        Message
                                    </Table.Th>
                                    <Table.Td className="border-b-0 whitespace-nowrap">
                                     
                                            <FormTextarea
                                                value="Excellent Work"
                                                className="w-full border rounded-lg p-2 h-32 "
                                            />
                                      
                                    </Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                    </div>
                    <div className="flex items-center gap-3 justify-end mx-5 pb-3  mt-5">
                        <Button
                            variant="instagram"
                            type="button"
                            onClick={handleCloseModal}
                            className="-mt-2"
                        >
                            Cancel
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </>
    );
};

export default UserContactDetails;
