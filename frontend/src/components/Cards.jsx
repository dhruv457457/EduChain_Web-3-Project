import React from 'react';

function Cards({ title, description, icon }) {
  return (
    <div className="w-full sm:w-96 min-h-[250px] bg-slate-950 border border-customPurple rounded-xl shadow-md flex flex-col justify-center items-center p-6">
    <div className="flex items-center space-x-3">
      {icon}
      <h1 className="text-white text-xl font-bold">{title}</h1>
    </div>
    <p className="text-white mt-3 text-md text-center">{description}</p>
  </div>
  );
}

export default Cards;
