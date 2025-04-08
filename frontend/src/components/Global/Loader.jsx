import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-6">
      {/* Lottie Animation */}
      <div className="w-32 h-32">
        <DotLottieReact
          src="https://lottie.host/b59c959d-038e-4461-8346-c531559628ae/14pbLW72x8.lottie"
          loop
          autoplay
        />
      </div>

      {/* Caption */}
      <p className="text-purple-400 font-semibold animate-pulse text-lg text-center">
        Mining your crypto magic with Cryptify...
      </p>
    </div>
  );
};

export default Loader;