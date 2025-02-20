import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Transfer from "./pages/Transfer";
import Home from "./pages/Home";
import User from "./pages/User";
import Contract from "./pages/Contract";
import Docs from "./pages/Docs";

function AnimatedRoutes() {
  const location = useLocation(); // Track current route

  return (
    <AnimatePresence mode="wait"> 
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/user" element={<User />} />
        <Route path="/contract" element={<Contract />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
