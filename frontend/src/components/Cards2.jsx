import React from "react";

function Cards2({ title, description}) {
  return (
    <>
      <div
        className="bg-customDarkpurple text-white border-b-4 border-customPurple flex flex-col items-center justify-center p-6 w-full min-h-[250px] max-w-[250px]
        lg:shadow-custom-purple transition-all duration-75 rounded-md lg:hover:border-t-4 lg:hover:border-b-0"
      >
        <h1 className="text-white text-xl font-bold">{title}</h1>
        <p className="text-white mt-3 text-md text-center">{description}</p>
      </div>
    </>
  );
}

export default Cards2;
