import React from 'react';

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full space-y-4"
    >
      <div 
        className="w-12 h-12 rounded-full animate-spin 
                   border-4 border-solid border-primary border-t-transparent shadow-md"
      >
      </div>
      <p className="text-white/80 font-medium tracking-wider animate-pulse">
        {text}
      </p>
    </div>
  );
};

export default Loader;