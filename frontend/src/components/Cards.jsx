import React from 'react';
import { FaShieldAlt, FaUsers, FaPiggyBank } from 'react-icons/fa';

function Cards({ title, description, icon }) {
  return (
    <div className="group box w-full sm:w-96 h-64 bg-slate-950 border-2 border-purple-500 rounded-xl shadow-custom-purple flex flex-col justify-center items-center p-6 
      transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 cursor-pointer ">
      <div className="flex items-center space-x-3">
        {icon}
        <h1 className="text-white text-xl font-bold group-hover:text-customPurple">{title}</h1>
      </div>
      <p className="text-white mt-3 text-md px-3">{description}</p>
      
    </div>
  );
}
 
export default Cards;
