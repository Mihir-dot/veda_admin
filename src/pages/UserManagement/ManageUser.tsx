import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import AddUserForm from "../../components/UserManagement/AddUserForm";
import { checkPermission } from "../../utils/checkPermissions";
import { useNavigate } from "react-router-dom";

const ManageUser: React.FC = () => {
  const userId = localStorage.getItem("newlyAddedUser");
  const [hasAddPermission, setHasAddPermission] = useState<boolean>(false);
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPermission = async () => {
      const doesHaveAddPermission = await checkPermission(
        "user_management",
        "add"
      );
      const doesHaveEditPermission = await checkPermission(
        "user_management",
        "edit"
      );
      setHasAddPermission(doesHaveAddPermission);
      setHasEditPermission(doesHaveEditPermission);
      if (!doesHaveAddPermission && !doesHaveEditPermission) {
        navigate("/unauthorized");
      }
    };
    fetchPermission();
  }, []);

  return (
    <>
      {(hasAddPermission || hasEditPermission) && (
        <div>
          <PageHeader
            HeaderText="User"
            Breadcrumb={[
              {
                name: `${userId ? "User Update" : "User Add"}`,
                navigate: "#",
              },
            ]}
            to="/user"
          />
          <div className="flex items-center mt-5">
            <h2 className="mr-auto text-lg font-medium intro-y">
              {userId ? "Update User" : "Add User"}
            </h2>
          </div>

          <div className="py-5 mt-5 intro-y box">
            <div className="px-5 sm:px-20">
              <AddUserForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageUser;
