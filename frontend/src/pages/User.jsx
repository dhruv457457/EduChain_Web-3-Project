import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import UserDashboard from "../components/UserModule/UserDashboard";
import Loader from "../components/Global/Loader"; 

const User = () => {
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

   
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      {isLoading ? <Loader /> : <UserDashboard />}
    </>
  );
};

export default User;