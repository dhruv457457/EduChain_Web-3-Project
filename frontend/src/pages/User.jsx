import React from "react";
import { ToastContainer } from "react-toastify";
import UserDashboard from "../components/UserModule/UserDashboard";

const User = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <UserDashboard />
    </>
  );
};

export default User;