import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/solid";


const Header = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <header className="relative w-full h-screen flex items-center justify-center overflow-hidden">


      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6"
          >
            <SparklesIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-slate-300">
              The Future of Decentralized Work is Here
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold text-white"
          >
            Secure Payments,
            <br />
            <span className="bg-gradient-to-r from-primary to-primary_hover1 bg-clip-text text-transparent">
              Verified Trust.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-2xl mx-auto mt-6 text-lg text-slate-400 leading-relaxed"
          >
            Cryptify leverages blockchain for transparent, secure, and
            efficient transactions. Manage contracts and build your on-chain
            reputation with confidence.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate("/transfer")}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-primary_hover1 text-white font-semibold rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            >
              Get Started
              <ArrowRightIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/docs")}
              className="w-full sm:w-auto px-8 py-3 bg-white/5 border border-white/20 text-slate-300 font-semibold rounded-lg backdrop-blur-sm transition-colors duration-300 hover:bg-white/10 hover:border-white/30"
            >
              Read Docs
            </button>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;