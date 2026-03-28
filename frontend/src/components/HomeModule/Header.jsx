import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Briefcase,
  User,
  SparklesIcon as SolidSparkles,
} from "lucide-react";

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
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <header className="relative w-full h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
        {/* Left Side */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full md:w-3/4 flex flex-col items-start text-left"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6"
          >
            <SolidSparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-slate-300">
              The Future of Decentralized Work is Here
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold text-white"
          >
            Secure Payments, Verified Trust.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-lg mt-6 text-lg text-slate-400 leading-relaxed"
          >
            Dkarma leverages blockchain for transparent, secure, and efficient
            transactions. Manage contracts and build your on-chain reputation
            with confidence.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-10">
            <button
              onClick={() => navigate("/user#transfer")}
              className="group relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-primary_hover1 text-white font-semibold rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            >
              Get Started
            </button>
          </motion.div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="relative w-full md:w-1/4 flex items-center justify-center h-[400px] md:h-[500px]"
        >
          {/* 📸 Background Hero Image */}
          <motion.img
            src="https://i.ibb.co/TxC9bHtc/Screenshot-2025-08-08-110405-left.png"
            alt="Hero Visual"
            className="absolute top-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 w-[280px] md:w-[320px] lg:w-[400px] rounded-2xl opacity-90 object-cover z-10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          />

          {/* Top Right Card */}
          <motion.div
            className="absolute top-[65%] right-[90%] flex items-center gap-4 bg-black/20 backdrop-blur-md border border-black/20 rounded-3xl p-4 shadow-lg min-w-[320px]"
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.7, delay: 1.2, ease: "easeOut" }}
          >
              <div className="bg-primary p-2 rounded-full">
              <User className="text-white" size={24} />
            </div>
            <div>
              <p className="font-bold text-white">Find Top Talent</p>
              <p className="text-sm text-slate-300">Connect with skilled freelancers</p>
            </div>
          </motion.div>

          {/* Bottom Left Card */}
          <motion.div
            className="absolute bottom-[80%] left-[-65%] flex items-center gap-4 bg-black/20 backdrop-blur-md border border-black/20 rounded-3xl p-4 shadow-lg"
            initial={{ opacity: 0, y: 20, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.7, delay: 1.4, ease: "easeOut" }}
          >
            <div className="bg-primary p-2 rounded-full">
              <User className="text-white" size={24} />
            </div>
            <div>
              <p className="font-bold text-white">Land Your Next Gig</p>
              <p className="text-sm text-slate-300">Browse projects & get hired</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 opacity-70">
        <span className="text-sm">Scroll to discover</span>
        <ArrowDown size={20} className="animate-bounce" />
      </div>
    </header>
  );
};

export default Header;
