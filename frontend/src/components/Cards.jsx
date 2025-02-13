import React from 'react';

function Cards({ title, description, icon }) {
  return (
    <div className="w-full sm:w-96 h-64 bg-slate-950 border-2 border-customPurple rounded-xl shadow-custom-purple flex flex-col justify-center items-center p-6 cursor-pointer">
      <div className="flex items-center space-x-3">
        {icon}
        <h1 className="text-white text-xl font-bold hover:text-customPurple">{title}</h1>
      </div>
      <p className="text-white mt-3 text-md px-3">{description}</p>
    </div>
  );
}

export default Cards;
