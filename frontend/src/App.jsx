import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Transfer from "./pages/Transfer";
import Home from "./pages/Home";
import User from "./pages/User";
import Contract from "./pages/Contract";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/user" element={<User />} />
        <Route path="/contract" element={<Contract />} />
      </Routes>
    </Router>
  );
}

export default App;
