import React from "react";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import UserDashboard from "../components/UserDashboard";

const User = () => {
  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={5000} />
      <UserDashboard />
    </>
  );
};

export default User;
