import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Cards from "../components/Cards";
import { FaShieldAlt, FaUsers, FaPiggyBank } from "react-icons/fa";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Header />
      <div className="relative bg-customSemiPurple min-h-screen w-full py-7 px-4">
        <div className="flex flex-col items-center text-center text-shadow-custom mx-4">
          <h1 className="text-customPurple text-2xl md:text-3xl lg:text-5xl font-bold">
            Revolutionary Features
          </h1>

          {/* Responsive Container */}
          <div className="flex flex-col md:flex-row flex-wrap justify-center items-center text-center text-shadow-custom py-28 space-y-10 md:space-y-0 md:gap-10">
            <Cards
              title="Secure Transfers"
              description="Military-grade encryption and multi-signature protection for your assets with real-time transaction monitoring."
              icon={<FaShieldAlt className="text-purple-500" size={40} />}
            />
            <Cards
              title="Group Payments"
              description="Seamlessly manage group transactions with smart contract-powered splitting and automated distribution."
              icon={<FaUsers className="text-purple-500" size={40} />}
            />
            <Cards
              title="Savings Pots"
              description="Create intelligent savings pools with AI-driven yield optimization and advanced security protocols."
              icon={<FaPiggyBank className="text-purple-500" size={40} />}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
