import React, { useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Cards from "../components/Cards";
import { FaShieldAlt, FaUsers, FaPiggyBank } from "react-icons/fa";
import Footer from "../components/Footer";
import LogoCloud from "../components/LogoCloud";
import CommitmentStepsSection from "../components/CommitmentStepsSection";

const pageVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3, ease: "easeIn" } },
};

function Home() {
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Navbar />
      <Header scrollToFeatures={scrollToFeatures} />
      
      {/* Features Section */}
      <div className="bg-customSemiPurple w-full px-4" ref={featuresRef}>
        <div className="flex flex-col items-center text-center mx-4">
          
          {/* Animated Heading */}
          <motion.h1 
            className="text-customPurple text-3xl md:text-4xl lg:text-5xl font-bold"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Revolutionary Features
          </motion.h1>

          {/* Animated Cards Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } }
            }}
          >
            {/* Individual Card Animations */}
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
              <Cards
                title="Secure Transfers"
                description="Military-grade encryption and multi-signature protection for your assets with real-time transaction monitoring."
                icon={
                  <div className="p-3 rounded-md border-b-4 border-customBlue">
                    <FaShieldAlt className="text-customBlue" size={30} />
                  </div>
                }
              />
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
              <Cards
                title="Group Payments"
                description="Seamlessly manage group transactions with smart contract-powered splitting and automated distribution."
                icon={
                  <div className="p-3 rounded-md border-b-4 border-green-500">
                    <FaUsers className="text-green-500" size={30} />
                  </div>
                }
              />
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}>
              <Cards
                title="Savings Pots"
                description="Create intelligent savings pools with AI-driven yield optimization and advanced security protocols."
                icon={
                  <div className="p-3 rounded-md border-b-4 border-yellow-500">
                    <FaPiggyBank className="text-yellow-500" size={30} />
                  </div>
                }
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <CommitmentStepsSection />
      <LogoCloud />
      <Footer />
    </motion.div>
  );
}

export default Home;
