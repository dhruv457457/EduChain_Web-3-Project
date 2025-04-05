// LoaderButton.jsx
import React from "react";

const LoaderButton = ({ onClick, loading, text, color = "purple" }) => {
  const colorClasses = {
    purple: "bg-purple-600 hover:bg-purple-700",
    red: "bg-red-600 hover:bg-red-700",
    green: "bg-green-600 hover:bg-green-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    gray: "bg-gray-600 hover:bg-gray-700",
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`relative px-4 py-2 w-full text-white font-medium rounded transition-all duration-300 flex items-center justify-center gap-2
        ${colorClasses[color] || colorClasses.purple}
        ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Processing...
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default LoaderButton; // Fixed export name