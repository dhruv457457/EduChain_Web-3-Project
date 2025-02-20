import React from "react";

function LogoCloud() {
  const logos = [
    { src: "https://pody.network/partner/educhain-black.svg", alt: "EduChain" },
    {
      src: "https://pody.network/_next/image?url=%2Fpartner%2Fblockchain-innovation-hub.png&w=640&q=75",
      alt: "Blockchain Innovation Hub",
    },
    {
      src: "https://pody.network/_next/image?url=%2Fpartner%2Fopencampus.png&w=640&q=75",
      alt: "OpenCampus",
    },
  ];

  return (
    <div className="bg-customSemiPurple text-slate-100 font-semibold py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-semibold">
        Powered by Leading Web3 Chain in Innovation
        </h2>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-8 place-items-center">
          {logos.map((logo, index) => (
            <img
              key={index}
              src={logo.src}
              alt={logo.alt}
              className="w-52 h-20 object-contain bg-white px-4 rounded-md lg:shadow-custom-purple border-b-4 border-customPurple cursor-pointer lg:hover:border-t-4 lg:hover:border-b-0 transition-all duration-75"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LogoCloud;
