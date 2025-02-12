// User.js (Main Page)
import React from "react";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import UserDashboard from "../components/UserDashboard";
import ParticleBackground from "../components/ParticleBackground";

const User = () => {
  return (
    <>
      <ParticleBackground />
      <Navbar />
      <ToastContainer position="top-right" autoClose={5000} />
      <UserDashboard />
    </>
  );
};

export default User;
