import React from 'react';
import { motion } from 'framer-motion';

function Cards({ title, description, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(128, 0, 128, 0.3)" }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
      className="w-full sm:w-96 h-64 bg-slate-950 border-2 border-customPurple rounded-xl shadow-custom-purple flex flex-col justify-center items-center p-6 cursor-pointer"
    >
      <div className="flex items-center space-x-3">
        {icon}
        <h1 className="text-white text-xl font-bold hover:text-customPurple">{title}</h1>
      </div>
      <p className="text-white mt-3 text-md px-3">{description}</p>
    </motion.div>
  );
}

export default Cards;
