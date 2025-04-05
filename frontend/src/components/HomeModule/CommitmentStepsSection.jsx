import React from "react";
import { Lock, Wallet, CheckCircle, Star } from "lucide-react";

function CommitmentStepsSection() {
  return (
    <div className="relative w-full bg-customDarkpurple px-6 py-20 text-white">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold text-customPurple mb-4">
          Smart Work Commitment
        </h1>
        <p className="text-customGray text-lg md:text-xl font-medium max-w-2xl mx-auto">
          A Smarter Way to Work and Earn with Cryptify, Get started with
          Cryptify in four futuristic steps
        </p>
      </div>

      <div className="relative flex flex-col md:flex-row justify-center items-center gap-12 md:gap-16 px-2 md:px-10">
        {/** Connector line for desktop */}
        <div className="hidden md:block absolute top-1/2 transform -translate-y-1/2 left-16 right-16 h-[2px] bg-customPurple z-0" />

        {/* Card 1 */}
        <StepCard
          icon={<Lock size={40} className="text-customNeonGreen" />}
          title="Initiate the Contract"
          description="Start an SWC by locking funds on-chain. Contract activates when both users confirm the details."
        />

        {/* Card 2 */}
        <StepCard
          icon={<Wallet size={40} className="text-customNeonPink" />}
          title="Milestone-Based Progress"
          description="Unlock partial payments as freelancers complete approved milestones."
        />

        {/* Card 3 */}
        <StepCard
          icon={<CheckCircle size={40} className="text-customBlue" />}
          title="Final Confirmation & Payout"
          description="Both users verify completion. Remaining funds get auto-released."
        />

        {/* Card 4 */}
        <StepCard
          icon={<Star size={40} className="text-yellow-400" />}
          title="Build Crypto Credit Score"
          description="Successful SWCs boost your Blockchain Credit Score and financial trust."
        />
      </div>
    </div>
  );
}

function StepCard({ icon, title, description }) {
  return (
    <div className="relative z-10 backdrop-blur-md bg-customSemiPurple/60 border border-customPurple/40 rounded-2xl p-6 w-[260px] md:w-[280px] hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-customPurple/50">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-customInput rounded-full p-3">{icon}</div>
      </div>
      <h3 className="text-xl text-customPurple font-semibold text-center mb-2">
        {title}
      </h3>
      <p className="text-customGray text-sm text-center">{description}</p>
    </div>
  );
}

export default CommitmentStepsSection;
