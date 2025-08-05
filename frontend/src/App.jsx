import React, { Suspense, lazy, Component } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { WalletProvider } from "./components/Global/WalletContext";
import Navbar from "./components/Global/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center text-white p-4">
          <h1 className="text-2xl font-bold">Something went wrong in Navbar</h1>
          <p>{this.state.error?.message || "Unknown error"}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Transfer = lazy(() => import("./pages/Transfer"));
const Home = lazy(() => import("./pages/Home"));
const User = lazy(() => import("./pages/User"));
const Contract = lazy(() => import("./pages/Contract"));
const Docs = lazy(() => import("./pages/Docs"));
const Jobs = lazy(() => import("./pages/Jobs"));
const Proposals = lazy(() => import("./pages/Proposals"));

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
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/proposals" element={<Proposals />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <>
    <ToastContainer position="top-right" autoClose={5000} />
      <WalletProvider>
        <Router>
          <ErrorBoundary>
            <Navbar />
          </ErrorBoundary>
          <AnimatedRoutes />
        </Router>
      </WalletProvider>
    </>
  );
}

export default App;
