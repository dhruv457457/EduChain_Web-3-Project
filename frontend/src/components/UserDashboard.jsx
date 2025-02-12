// UserDashboard.js
import React from "react";
import UserBalance from "./UserBalance";
import RegisterName from "./RegisterName";

const UserDashboard = () => {
  return (
    <div className="flex items-center bg-customSemiPurple py-20 px-4 justify-evenly h-screen">
      <UserBalance />
      <RegisterName />
    </div>
  );
};

export default UserDashboard;
