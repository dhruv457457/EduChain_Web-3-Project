import React from 'react';
import { FaShieldAlt, FaUsers, FaPiggyBank } from 'react-icons/fa';

function Cards() {
  return (
    <div className="relative bg-customSemiPurple min-h-screen w-full py-8 px-4">
      <div className="flex flex-col items-center text-center text-shadow-custom mx-4">
        <h1 className="text-customPurple text-2xl md:text-3xl lg:text-5xl font-bold">
          Revolutionary Features
        </h1>

        {/* Responsive Container */}
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center text-center text-shadow-custom py-16 space-y-10 md:space-y-0 md:gap-10">
          
          {/* Secure Transfers */}
          <div className="box w-full sm:w-96 h-64 bg-slate-950 border-2 border-purple-500 rounded-xl shadow-custom-purple flex flex-col justify-center items-center p-6 
            transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 cursor-pointer">
            <div className="flex items-center space-x-3">
              <FaShieldAlt className="text-purple-500" size={40} />
              <h1 className="text-white text-xl font-bold">Secure Transfers</h1>
            </div>
            <p className="text-white mt-3 text-md px-3">
              Military-grade encryption and multi-signature protection for your assets with real-time transaction monitoring.
            </p>
          </div>

          {/* Group Payments */}
          <div className="box w-full sm:w-96 h-64 bg-slate-950 border-2 border-purple-500 rounded-xl shadow-custom-purple flex flex-col justify-center items-center p-6 
            transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 cursor-pointer">
            <div className="flex items-center space-x-3">
              <FaUsers className="text-purple-500" size={40} />
              <h1 className="text-white text-xl font-bold">Group Payments</h1>
            </div>
            <p className="text-white mt-3 text-md px-3">
              Seamlessly manage group transactions with smart contract-powered splitting and automated distribution.
            </p>
          </div>

          {/* Savings Pots */}
          <div className="box w-full sm:w-96 h-64 bg-slate-950 border-2 border-purple-500 rounded-xl shadow-custom-purple flex flex-col justify-center items-center p-6 
            transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 cursor-pointer">
            <div className="flex items-center space-x-3">
              <FaPiggyBank className="text-purple-500" size={40} />
              <h1 className="text-white text-xl font-bold">Savings Pots</h1>
            </div>
            <p className="text-white mt-3 text-md px-3">
              Create intelligent savings pools with AI-driven yield optimization and advanced security protocols.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cards;
