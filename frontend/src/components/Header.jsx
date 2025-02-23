import React from "react";
import ParticleBackground from "./ParticleBackground";
import { Link } from "react-router-dom";

function Header({ scrollToFeatures }) {
  return (
    <div className="relative bg-customSemiPurple min-h-screen w-full flex flex-col items-center justify-center gap-6 px-4 md:px-8 lg:px-16">
      <ParticleBackground />
      {/* Heading */}
      <div className="flex flex-col items-center text-center text-shadow-custom relative z-10">
        <h1 className="text-customPurple text-5xl md:text-6xl lg:text-8xl font-bold">
          The Future of{" "}
        </h1>
        <h1 className="text-customBlue text-5xl md:text-6xl lg:text-7xl font-bold">
          Secure DEFI
        </h1>
        <p className="text-slate-400 font-semibold text-lg md:text-xl lg:text-xl w-full md:w-3/4 lg:w-1/2 py-4">
          Experience next-generation secure transfers, group payments, and smart
          savings features with unmatched security and seamless user experience.
        </p>
      </div>
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 md:gap-8 relative z-10">
        <button className="text-white bg-customPurple px-6 py-3 md:px-8 md:py-3 rounded-md font-semibold shadow-custom-purple">
          <Link to="/docs">View Docs</Link>
        </button>
        <button
          onClick={scrollToFeatures}
          className="text-customBlue bg-white px-6 py-3 md:px-8 md:py-3 rounded-md font-semibold border-b-4 border-customBlue shadow-custom-purple transition-all duration-300 ease-in-out hover:bg-customBlue hover:text-white hover:border-white"
        >
          Explore Features
        </button>
      </div>
    </div>
  );
}

export default Header;
