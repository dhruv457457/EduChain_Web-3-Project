import React from "react";

function Header() {
  return (
    <>
      <div className="bg-customSemiPurple h-screen w-full flex flex-col items-center justify-center gap-8 ">
        <div className="text-customPurple bg-customDarkpurple px-8 py-2 rounded-xl font-bold border-2 border-customPurple shadow-custom-purple">
          <button>Powered by Web3 Tech</button>
        </div>
        <div className="flex flex-col items-center text-shadow-custom ">
          <h1 className="text-customPurple text-8xl font-bold ">
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
