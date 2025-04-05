import React from "react";

function Cards({ title, description, icon }) {
  return (
    <div
      className="w-full sm:w-80 min-h-[250px] bg-customSemiPurple/60 backdrop-blur-lg border border-customPurple/30 hover:border-customPurple hover:shadow-lg 
      shadow-customPurple/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center transition-all duration-300 hover:scale-105"
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-customInput text-customNeonGreen mb-4 shadow-md">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-customPurple mb-2">{title}</h2>
      <p className="text-sm text-customGray">{description}</p>
    </div>
  );
}

export default Cards;
