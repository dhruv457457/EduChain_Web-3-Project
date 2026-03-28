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
      className="w-full bg-[#101328] px-6 py-24 text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Smart Work Commitment
        </motion.h1>
        <motion.p
          className="text-gray-400 text-lg md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          A smarter way to collaborate and transact. Follow these four futuristic
          steps to get started with Dkarma.
        </motion.p>
      </div>

      <motion.div
        className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
        variants={containerVariants}
      >
        {/* Step Cards with updated styling */}
        <StepCard
          icon={<Lock size={32} className="text-purple-400" />}
          title="Initiate Contract"
          description="Start by defining terms and locking funds on-chain. The contract activates once both parties agree."
        />
        <StepCard
          icon={<Wallet size={32} className="text-blue-400" />}
          title="Milestone Progress"
          description="Unlock partial payments as milestones are completed and approved by the client."
        />
        <StepCard
          icon={<CheckCircle size={32} className="text-green-400" />}
          title="Final Confirmation"
          description="Once all work is done, both users verify completion, and remaining funds are auto-released."
        />
        <StepCard
          icon={<Star size={32} className="text-yellow-400" />}
          title="Build Reputation"
          description="Successful contracts boost your on-chain credit score, building trust for future work."
        />
      </motion.div>
    </motion.div>
  );
}

function StepCard({ icon, title, description }) {
  return (
    <motion.div
      variants={cardVariants}
      className="relative z-10 bg-[#16192E] border border-gray-700/50 rounded-lg p-6 text-center"
    >
      <div className="flex items-center justify-center mb-4 h-16 w-16 rounded-full bg-gray-900/50 mx-auto">
        {icon}
      </div>
      <h3 className="text-xl text-white font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </motion.div>
  );
}

export default CommitmentStepsSection;