import React from "react";
// import bitcoinIcon from "../assets/bitcoin.png";

function Header() {
  return (
    <div className="relative bg-customSemiPurple min-h-screen w-full flex flex-col items-center justify-center gap-6 px-4 md:px-8 lg:px-16">
      {/* Background Elements */}
      <img
      src="/path-to-icons/blockchain.svg"
      alt="Bitcoin Icon"
      className="absolute bottom-12 right-8 opacity-20 w-16 h-16 md:w-24 md:h-24 animate-float"
      />
      <img
        src="/path-to-icons/blockchain.svg"
        alt="Blockchain Icon"
        className="absolute bottom-12 right-8 opacity-20 w-16 h-16 md:w-24 md:h-24 animate-float"
      />
      <img
        src="/path-to-icons/web3.svg"
        alt="Web3 Icon"
        className="absolute top-1/4 left-1/3 opacity-10 w-24 h-24 md:w-40 md:h-40"
      />
      <img
        src="/path-to-icons/network.svg"
        alt="Network Icon"
        className="absolute bottom-6 left-1/4 opacity-10 w-20 h-20 md:w-32 md:h-32"
      />

      {/* Web3 Button */}
      <div className="text-customPurple bg-customDarkpurple px-6 py-2 md:px-8 md:py-3 rounded-xl font-bold border-2 border-customPurple shadow-custom-purple">
        <button>Powered by Web3 Tech</button>
      </div>

      {/* Heading */}
      <div className="flex flex-col items-center text-center text-shadow-custom">
        <h1 className="text-customPurple text-5xl md:text-6xl lg:text-8xl font-bold">
          The Future of{" "}
        </h1>
        <h1 className="text-customBlue text-5xl md:text-6xl lg:text-7xl font-bold">
          Secure DEFI
        </h1>
        <p className="text-slate-400 font-semibold text-lg md:text-xl lg:text-xl w-full md:w-3/4 lg:w-1/2 py-4">
          Experience next-generation secure transfers, group payments, and smart savings 
          features with unmatched security and seamless user experience.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 md:gap-8">
        <button className="text-white bg-customPurple px-6 py-3 md:px-8 md:py-3 rounded-md font-semibold shadow-custom-purple">
          Launch App
        </button>
        <button className="text-customBlue bg-white px-6 py-3 md:px-8 md:py-3 rounded-md font-semibold border-b-4 border-customBlue shadow-custom-purple">
          Explore Features
        </button>
      </div>
    </div>
  );
}

export default Header;
