
import React from "react";
import { UserManagement } from "@/components/users/UserManagement";

const UserManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <UserManagement />
    </div>
  );
};

export default UserManagementPage;
