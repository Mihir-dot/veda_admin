import React from "react";
import PageHeader from "../../components/PageHeader";
import ProfileForm from "../../components/Profile/ProfileForm";

const Profile: React.FC = () => {
  return (
    <div>
      <PageHeader HeaderText="Profile" to="/profile" />
      <div className="flex items-center mt-5">
        <h2 className="mr-auto text-lg font-medium intro-y">Manage Profile</h2>
      </div>

      <div className="py-5 mt-5 intro-y box">
        <div className="px-5 sm:px-20">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
};

export default Profile;
