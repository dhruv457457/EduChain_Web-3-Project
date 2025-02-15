import React, { useState } from "react";
import UserBalance from "./UserBalance";
import RegisterName from "./RegisterName";
import UserTransactions from "./UserTransactions";

const UserDashboard = () => {
  const [registeredName, setRegisteredName] = useState(null);

  return (
    <div className="flex flex-col lg:flex-row items-center bg-customSemiPurple py-10 px-6 gap-6 min-h-screen justify-center">
      <div className="w-full max-w-sm">
        <UserBalance registeredName={registeredName} />
      </div>
      <div className="w-full max-w-sm">
        <RegisterName setGlobalRegisteredName={setRegisteredName} />
      </div>
      <div className="w-full max-w-md">
        <UserTransactions />
      </div>
    </div>
  );
};

export default UserDashboard;
