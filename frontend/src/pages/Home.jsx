import React, { memo } from "react";
import { motion } from "framer-motion";
import Header from "../components/HomeModule/Header";
import Cards from "../components/HomeModule/Cards";
import { FaShieldAlt, FaHandshake, FaUserTag } from "react-icons/fa";
import Footer from "../components/HomeModule/Footer";
import LogoCloud from "../components/HomeModule/LogoCloud";
import CommitmentStepsSection from "../components/HomeModule/CommitmentStepsSection";
import Chatbot from "../components/Global/Chatbot";

// Slide-in + fade animation for better perceived performance
const pageVariants = {
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1], // easeOutExpo feel
    },
  },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

const cardContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      ease: "easeOut",
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const FeatureCard = memo(({ title, description, icon }) => (
  <motion.div variants={cardItemVariants}>
    <Cards title={title} description={description} icon={icon} />
  </motion.div>
));

const features = [
  {
    title: "Secure Transfers",
    description:
      "Encrypted transfers with multi-signature protection and real-time tracking.",
    icon: (
      <div className="p-3 rounded-md border-b-4 border-green-500">
        <FaShieldAlt className="text-green-500" size={30} />
      </div>
    ),
  },
  {
    title: "Smart Work Commitment",
    description:
      "Escrow-based payments released only when commitments are met.",
    icon: (
      <div className="p-3 rounded-md border-b-4 border-yellow-500">
        <FaHandshake className="text-yellow-500" size={30} />
      </div>
    ),
  },
  {
    title: "Username-Based Payments",
    description: "Send crypto easily using usernames with optional remarks.",
    icon: (
      <div className="p-3 rounded-md border-b-4 border-blue-500">
        <FaUserTag className="text-blue-500" size={30} />
      </div>
    ),
  },
];

function Home() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-customDarkpurple min-h-screen"
    >
      <Header />

      {/* Features Section */}
      <section className="w-full px-4 py-10 text-white">
        <div className="flex flex-col items-center text-center mx-4">
          <motion.h1
            className="text-customPurple text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            Revolutionary Features
          </motion.h1>
          <p className="text-customGray text-lg max-w-xl mb-10 font-semibold">
            Explore how Cryptify transforms the future of smart work
            commitments.
          </p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardContainerVariants}
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </motion.div>
        </div>
      </section>

      <CommitmentStepsSection />
      <LogoCloud />
      <Footer />
      <Chatbot />
    </motion.div>
  );
}

export default Home;
