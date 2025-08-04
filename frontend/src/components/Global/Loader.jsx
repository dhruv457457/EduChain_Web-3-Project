import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-8">
      {/* Animated Loader */}
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Orbiting Circles */}
        <div className="absolute w-full h-full rounded-full border-2 border-primary/30 animate-spin-slow"></div>
        <div className="absolute w-2/3 h-2/3 rounded-full border-2 border-blue-500/40 animate-spin-medium"></div>
        <div className="absolute w-1/3 h-1/3 rounded-full border-2 border-primary/60 animate-spin-fast"></div>
        
        {/* Central Glowing Orb */}
        <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_#fff,0_0_25px_#fff,0_0_35px_#a855f7]"></div>
      </div>

      {/* Caption */}
      <p className="text-primary font-semibold animate-pulse text-lg text-center tracking-wider">
        Initializing Secure Connection...
      </p>
    </div>
  );
};

export default Loader;