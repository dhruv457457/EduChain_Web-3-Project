import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function Navbar() {
  return (
    <>
     <nav className="bg-gray-800 p-4 text-white flex justify-around">
        <Link to="/" className="hover:text-blue-300">
          Home
        </Link>
        <Link to="/about" className="hover:text-green-300">
          About
        </Link>
        <Link to="/contact" className="hover:text-yellow-300">
          Contact
        </Link>
      </nav>
   
    </>
  );
}

export default Navbar;
