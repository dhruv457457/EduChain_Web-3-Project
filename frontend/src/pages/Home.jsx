import React, { useRef } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Cards from "../components/Cards";
import { FaShieldAlt, FaUsers, FaPiggyBank } from "react-icons/fa";
import Footer from "../components/Footer";
import LogoCloud from "../components/LogoCloud";
import CommitmentStepsSection from "../components/CommitmentStepsSection";

function Home() {
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar />
      <Header scrollToFeatures={scrollToFeatures} />
      <div className="bg-customSemiPurple w-full px-4 " ref={featuresRef}>
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
                <div className=" p-3 rounded-md border-b-4 border-customBlue">
                  <FaShieldAlt className="text-customBlue" size={30} />
                </div>
              }
            />

            <Cards
              title="Group Payments"
              description="Seamlessly manage group transactions with smart contract-powered splitting and automated distribution."
              icon={
                <div className="p-3 rounded-md border-b-4 border-green-500">
                  <FaUsers className="text-green-500" size={30} />
                </div>
              }
            />

            <Cards
              title="Savings Pots"
              description="Create intelligent savings pools with AI-driven yield optimization and advanced security protocols."
              icon={
                <div className=" p-3 rounded-md border-b-4 border-yellow-500">
                  <FaPiggyBank className="text-yellow-500" size={30} />
                </div>
              }
            />
          </div>
        </div>
      </div>
      {/* <Problem /> */}
      <CommitmentStepsSection />
      <LogoCloud />
      <Footer />
    </>
  );
}

export default Home;
