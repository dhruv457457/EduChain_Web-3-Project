import React from "react";
import bitcoinIcon from "../assets/bitcoin.png";


function Header() {
  return (
    <>
      <div className="relative bg-customSemiPurple h-screen w-full flex flex-col items-center justify-center gap-8">
        {/* Background Elements */}
        <img
          src={bitcoinIcon}
          alt="Bitcoin Icon"
          className="absolute top-10 left-10 opacity-90 w-16 h-16 animate-float"
        />
        <img
          src="/path-to-icons/blockchain.svg"
          alt="Blockchain Icon"
          className="absolute bottom-16 right-12 opacity-20 w-24 h-24 animate-float"
        />
        <img
          src="/path-to-icons/web3.svg"
          alt="Web3 Icon"
          className="absolute top-1/4 left-1/3 opacity-10 w-40 h-40"
        />
        <img
          src="/path-to-icons/network.svg"
          alt="Network Icon"
          className="absolute bottom-10 left-1/4 opacity-10 w-32 h-32"
        />


        <div className="text-customPurple bg-customDarkpurple px-8 py-2 rounded-xl font-bold border-2 border-customPurple shadow-custom-purple">
          <button>Powered by Web3 Tech</button>
        </div>
        <div className="flex flex-col items-center text-shadow-custom">
          <h1 className="text-customPurple text-8xl font-bold">
            The Future of{" "}
          </h1>
          <h1 className="text-customBlue text-8xl font-bold">Secure DEFI</h1>
          <p className="text-slate-400 font-semibold text-xl w-1/2 text-center py-4">
            Experience next-generation secure transfers, group payments, and
            smart savings features with unmatched security and seamless user
            experience.
          </p>
        </div>
        <div className="flex gap-8">
          <button className="text-white bg-customPurple px-4 py-2 rounded-md font-semibold shadow-custom-purple">
            Launch App
          </button>
          <button className="text-customBlue bg-white px-4 py-2 rounded-md font-semibold border-b-4 border-customBlue shadow-custom-purple">
            Explore Features
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;
