import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Import Tailwind and Fonts
import "./index.css"; // Ensure Tailwind is included
import "@fontsource/poppins"; // Default weight (400)
import "@fontsource/poppins/300.css"; // Light
import "@fontsource/poppins/600.css"; // Semi-bold
import "@fontsource/poppins/700.css"; // Bold

// Mount React App
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);