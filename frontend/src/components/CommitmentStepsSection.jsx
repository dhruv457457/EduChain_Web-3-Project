import React from "react";
import Cards from "./Cards";
import { Lock, Wallet, CheckCircle, Star } from "lucide-react";

function CommitmentStepsSection() {
  return (
    <div className="relative flex flex-col bg-customSemiPurple w-full px-4 pt-20">
      <div className="flex flex-col items-center justify-center text-center gap-6">
        <h1 className="text-customPurple text-xl md:text-4xl font-bold">
          A Smarter Way to Work and Earn with Cryptify
        </h1>
        <p className="text-slate-400 font-semibold text-xl w-full md:w-3/4 lg:w-1/2 py-4">
          Get started with Cryptify in four simple steps
        </p>

        <div className="flex flex-col items-center gap-10">
          {/* First Row */}
          <div className="relative flex flex-col md:flex-row gap-10 items-center">
            <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 w-[40px] h-1 bg-customPurple rounded-md"></div>
            <Cards
              icon={
                <Lock
                  size={50}
                  className="text-green-500 p-2 rounded-md border-b-4 border-green-500"
                />
              }
              title="Initiate the Contract"
              description="Start a Smart Work Commitment (SWC) by locking the total project amount on-chain. The contract begins once both users confirm the project details."
            />
            <Cards
              icon={
                <Wallet
                  size={50}
                  className="text-amber-300 p-2 rounded-md border-b-4 border-amber-300"
                />
              }
              title="Milestone-Based Progress"
              description="Freelancers complete milestones to unlock partial payments. Each milestone approval releases a portion of the funds securely from escrow."
            />
          </div>

          <div className="hidden md:block w-1 h-10 bg-customPurple rounded-md"></div>

          <div className="relative flex flex-col md:flex-row gap-10 items-center">
            <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 w-[40px] h-1 bg-customPurple rounded-md"></div>

            <Cards
              icon={
                <CheckCircle
                  size={50}
                  className="text-customBlue p-2 rounded-md border-b-4 border-customBlue"
                />
              }
              title="Final Confirmation & Payout"
              description="At the end of the contract, both users confirm the project's completion and value. Upon agreement, the remaining funds are automatically released."
            />

            <Cards
              icon={
                <Star
                  size={50}
                  className="text-yellow-500 p-2 rounded-md border-b-4 border-yellow-500"
                />
              }
              title="Build Your Crypto Credit Score"
              description="Every successful contract improves your Blockchain-Based Credit Score, helping you unlock better financial opportunities in the crypto space."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommitmentStepsSection;
