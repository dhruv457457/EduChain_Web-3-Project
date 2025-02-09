import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Transfer from "./pages/Transfer";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Transfer />} />
        <Route path="/contact" element={<Transfer />} />
      </Routes>
    </Router>
  );
}

export default App;
