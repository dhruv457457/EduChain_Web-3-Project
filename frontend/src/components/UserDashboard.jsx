// UserDashboard.js
import React from "react";
import UserBalance from "./UserBalance";
import RegisterName from "./RegisterName";
import UserTransactions from "./UserTransactions";

const UserDashboard = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center bg-customSemiPurple py-20 px-4 justify-evenly h-screen">
      <UserBalance />
      <RegisterName />
      <UserTransactions />
    </div>
  );
};

export default UserDashboard;
