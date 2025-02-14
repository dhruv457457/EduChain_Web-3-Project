import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Cards from "../components/Cards";
import { FaShieldAlt, FaUsers, FaPiggyBank } from "react-icons/fa";
import Footer from "../components/Footer";
import LogoCloud from "../components/LogoCloud";
import Problem from "../components/Problem";

function Home() {
  return (
    <>
      <Navbar />
      <Header />
      <div className="bg-customSemiPurple w-full px-4">
        <div className="flex flex-col items-center text-center mx-4">
          <h1 className="text-customPurple text-3xl md:text-4xl lg:text-5xl font-bold">
            Revolutionary Features
          </h1>

          {/* Optimized Cards Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20">
            <Cards
              title="Secure Transfers"
              description="Military-grade encryption and multi-signature protection for your assets with real-time transaction monitoring."
              icon={
                <FaShieldAlt
                  className="text-purple-500 bg-customSemiPurple px-2 rounded-md border-b-4 border-customPurple"
                  size={50}
                />
              }
            />
            <Cards
              title="Group Payments"
              description="Seamlessly manage group transactions with smart contract-powered splitting and automated distribution."
              icon={
                <FaUsers
                  className="text-purple-500 bg-customSemiPurple px-2 rounded-md border-b-4 border-customPurple"
                  size={50}
                />
              }
            />
            <Cards
              title="Savings Pots"
              description="Create intelligent savings pools with AI-driven yield optimization and advanced security protocols."
              icon={
                <FaPiggyBank
                  className="text-purple-500 bg-customSemiPurple px-2 rounded-md border-b-4 border-customPurple"
                  size={50}
                />
              }
            />
          </div>
        </div>
      </div>
      <Problem />
      <LogoCloud />
      <Footer />
    </>
  );
}

export default Home;
