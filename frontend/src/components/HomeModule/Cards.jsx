import React from "react";

function Cards({ title, description, icon }) {
  return (
    <div className="bg-[#16192E] p-8 rounded-lg border border-gray-700/50 text-center transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/50 shadow-lg">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-600/20">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

export default Cards;