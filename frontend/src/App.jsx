import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Lazy Load Components
const Transfer = lazy(() => import("./pages/Transfer"));
const Home = lazy(() => import("./pages/Home"));
const User = lazy(() => import("./pages/User"));
const Contract = lazy(() => import("./pages/Contract"));
const Docs = lazy(() => import("./pages/Docs"));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/user" element={<User />} />
          <Route path="/contract" element={<Contract />} />
        </Routes>
      </Suspense>
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
