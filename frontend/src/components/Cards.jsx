import React from "react";

function Cards({ title, description, icon }) {
  return (
    <div
      className="w-full sm:w-96 min-h-[250px] bg-customDarkpurple lg:bg-transparent lg:hover:bg-customDarkpurple border-b-4 border-customPurple rounded-md lg:hover:border-t-4 lg:hover:border-b-0
    flex flex-col justify-center items-center p-6 lg:shadow-custom-purple transition-all duration-75"
    >
      <div className="flex items-center space-x-3 lg:hover:scale-110 transition-all duration-150">
        {icon}
        <h1 className="text-white text-xl font-bold ">{title}</h1>
      </div>
      <p className="text-white mt-3 text-md text-center">{description}</p>
    </div>
  );
}

export default Cards;
