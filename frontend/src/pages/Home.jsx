import React, { useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Cards from "../components/Cards";
import { FaShieldAlt, FaHandshake, FaUserTag } from "react-icons/fa";
import Footer from "../components/Footer";
import LogoCloud from "../components/LogoCloud";
import CommitmentStepsSection from "../components/CommitmentStepsSection";
import Chatbot from "../components/Chatbot";

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
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            {/* Individual Card Animations */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <Cards
                title="Secure Transfers"
                description="Encrypted transfers with multi-signature protection and real-time tracking."
                icon={
                  <div className="p-3 rounded-md border-b-4 border-green-500">
                    <FaShieldAlt className="text-green-500" size={30} />
                  </div>
                }
              />
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <Cards
                title="Smart Work Commitment"
                description="Escrow-based payments released only when commitments are met."
                icon={
                  <div className="p-3 rounded-md border-b-4 border-yellow-500">
                    <FaHandshake className="text-yellow-500" size={30} />
                  </div>
                }
              />
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <Cards
                title="Username-Based Payments"
                description="Send crypto easily using usernames with optional remarks."
                icon={
                  <div className="p-3 rounded-md border-b-4 border-blue-500">
                    <FaUserTag className="text-blue-500" size={30} />
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
      <Chatbot />
    </motion.div>
  );
}

export default Home;
