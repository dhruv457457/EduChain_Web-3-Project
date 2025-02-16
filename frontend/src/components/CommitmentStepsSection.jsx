import React from "react";
import Cards from "./Cards";
import { Lock, CheckCircle, Wallet, Star } from "lucide-react";

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
                  className="text-purple-500 p-2 rounded-md border-b-4 border-purple-500"
                />
              }
              title="Secure Your Commitment"
              description="Lock funds in a Smart Work Commitment (SWC) contract to ensure trust and fairness in freelance or business deals."
            />
            <Cards
              icon={
                <CheckCircle
                  size={50}
                  className="text-green-500 p-2 rounded-md border-b-4 border-green-700"
                />
              }
              title="Work & Deliver"
              description="Complete tasks, milestones, or projects while funds remain securely held in escrow."
            />
          </div>

          <div className="hidden md:block w-1 h-10 bg-customPurple rounded-md"></div>

          <div className="relative flex flex-col md:flex-row gap-10 items-center">
            <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 w-[40px] h-1 bg-customPurple rounded-md"></div>

            <Cards
              icon={
                <Wallet
                  size={50}
                  className="text-customBlue p-2 rounded-md border-b-4 border-customBlue"
                />
              }
              title="Guaranteed Payouts"
              description="Once work is verified, payments are automatically released, ensuring no delays or disputes."
            />

            <Cards
              icon={
                <Star
                  size={50}
                  className="text-yellow-500 p-2 rounded-md border-b-4 border-yellow-700"
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
