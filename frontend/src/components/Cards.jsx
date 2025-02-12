import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Cards({ title, description, icon }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      whileHover={{
        scale: isSmallScreen ? 1.01 : 1.04, // Minimal scaling on small screens
        boxShadow: isSmallScreen
          ? "0px 2px 6px rgba(128, 0, 128, 0.15)"
          : "0px 8px 16px rgba(128, 0, 128, 0.3)",
      }}
      whileTap={{ scale: 0.97 }} // Slight tap effect for feedback
      transition={{
        type: "tween", // Smoother transition type
        duration: isSmallScreen ? 0.2 : 0.3, // Faster transition on mobile
        ease: "easeOut", // Less jerky effect
      }}
      className="w-full sm:w-96 h-64 bg-slate-950 border-2 border-customPurple rounded-xl shadow-md flex flex-col justify-center items-center p-6 cursor-pointer"
    >
      <div className="flex items-center space-x-3">
        {icon}
        <h1 className="text-white text-xl font-bold hover:text-customPurple">{title}</h1>
      </div>
      <p className="text-white mt-3 text-md px-3 text-center">{description}</p>
    </motion.div>
  );
}

export default Cards;
