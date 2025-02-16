import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@fontsource/poppins"; // Default weight (400)
import "@fontsource/poppins/300.css"; // Light
import "@fontsource/poppins/600.css"; // Semi-bold
import "@fontsource/poppins/700.css"; // Bold
import "./index.css"; // Ensure Tailwind is imported

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
