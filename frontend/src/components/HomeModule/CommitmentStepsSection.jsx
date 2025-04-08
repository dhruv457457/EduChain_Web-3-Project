import React from "react";
import { Lock, Wallet, CheckCircle, Star } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
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

function CommitmentStepsSection() {
  return (
    <motion.div
      className="relative w-full bg-customDarkpurple px-6 py-20 text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="text-center mb-16">
        <motion.h1
          className="text-3xl md:text-5xl font-extrabold text-customPurple mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Smart Work Commitment
        </motion.h1>
        <motion.p
          className="text-customGray text-lg md:text-xl font-medium max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          A Smarter Way to Work and Earn with Cryptify, Get started with
          Cryptify in four futuristic steps
        </motion.p>
      </div>

      <motion.div
        className="relative flex flex-col md:flex-row justify-center items-center gap-12 md:gap-16 px-2 md:px-10"
        variants={containerVariants}
      >
        {/* Connector line for desktop */}
        <motion.div
          className="hidden md:block absolute top-1/2 transform -translate-y-1/2 left-20 right-20 h-[2px] bg-customPurple z-0 origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
        />

        {/* Cards */}
        <StepCard
          icon={<Lock size={40} className="text-customNeonGreen" />}
          title="Initiate the Contract"
          description="Start an SWC by locking funds on-chain. Contract activates when both users confirm the details."
        />
        <StepCard
          icon={<Wallet size={40} className="text-customNeonPink" />}
          title="Milestone-Based Progress"
          description="Unlock partial payments as freelancers complete approved milestones."
        />
        <StepCard
          icon={<CheckCircle size={40} className="text-customBlue" />}
          title="Final Confirmation & Payout"
          description="Both users verify completion. Remaining funds get auto-released."
        />
        <StepCard
          icon={<Star size={40} className="text-yellow-400" />}
          title="Build Crypto Credit Score"
          description="Successful SWCs boost your Blockchain Credit Score and financial trust."
        />
      </motion.div>
    </motion.div>
  );
}

function StepCard({ icon, title, description }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.08 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
       className="relative z-10 backdrop-blur-md bg-customSemiPurple/60 border border-customPurple/40 hover:border-customPurple rounded-2xl p-6 w-[260px] md:w-[280px] shadow-lg cursor-pointer"
    >
      <div className="flex items-center justify-center mb-4">
        <div className="bg-customInput rounded-full p-3">{icon}</div>
      </div>
      <h3 className="text-xl text-customPurple font-semibold text-center mb-2">
        {title}
      </h3>
      <p className="text-customGray text-sm text-center">{description}</p>
    </motion.div>
  );
}

export default CommitmentStepsSection;
