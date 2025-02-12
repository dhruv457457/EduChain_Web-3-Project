import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Transfer from "./pages/Transfer";
import Home from "./pages/Home";
import User from "./pages/User";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/user" element={<User />} />

      </Routes>
    </Router>
  );
}

export default App;
