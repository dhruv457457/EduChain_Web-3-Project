const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-6 bg-transparent">
      {/* Spinning Neon Circle */}
      <div className="relative w-20 h-20">
        <div
          className="absolute inset-0 rounded-full border-[6px] border-purple-500 animate-spin"
          style={{
            filter: "drop-shadow(0 0 10px #a855f7)",
            animationDuration: "0.6s",
          }}
        ></div>

        <div className="absolute inset-[6px] rounded-full bg-purple-600 animate-ping opacity-50"></div>

        <div className="absolute inset-[12px] rounded-full bg-purple-400 shadow-lg shadow-purple-500"></div>
      </div>

      {/* Purple Man SVG */}
      <div className="animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          fill="none"
          className="w-12 h-12 text-purple-500 drop-shadow-md"
        >
          <circle cx="32" cy="10" r="6" fill="#a855f7" />
          <path
            d="M32 18c-3 4-5 6-5 10s2 6 5 6 5-2 5-6-2-6-5-10z"
            fill="#9333ea"
          />
          <path
            d="M27 34l-4 6c-1 2 0 4 2 4h2l3-4 2 6h4l-2-8 3-5h-10z"
            fill="#7e22ce"
          />
          <path
            d="M39 34l4 3c2 1 2 4 0 5l-3 1-4-5-2-4h5z"
            fill="#a855f7"
          />
        </svg>
      </div>

      {/* Caption */}
      <p className="text-purple-400 font-medium animate-pulse text-sm text-center">
        Mining your crypto magic...
      </p>
    </div>
  );
};

export default Loader;
