import React from "react";

const LoaderButton = ({ onClick, loading, text, color }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 w-full rounded text-white bg-${color} hover:bg-${color} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={loading}
    >
      {loading ? "Processing..." : text}
    </button>
  );
};

export default LoaderButton;
