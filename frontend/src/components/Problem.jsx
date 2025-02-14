import React from "react";
import Cards2 from "./Cards2";

function Problem() {
  return (
    <>
      <div className="flex flex-col bg-customSemiPurple w-full px-4">
        <div className="flex flex-col items-center justify-center text-center gap-6">
          <h1 className="text-customPurple text-3xl md:text-4xl lg:text-5xl font-bold">
            The Problem
          </h1>
          <p className="text-slate-400 font-semibold text-xl w-full md:w-3/4 lg:w-1/2 py-4">
            The financial landscape in crypto transactions is still inefficient,
            making it difficult for users to perform seamless and secure
            transactions.
          </p>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <Cards2
              title="Complex Crypto Transfers"
              description=" Users struggle to remember long wallet addresses, leading to errors and lost funds."
            />
            <Cards2
              title="Lack of Payment Transparency"
              description="Crypto transactions often lack descriptions or remarks, making it hard to track payment purposes."
            />
            <Cards2
              title="Trust Issues in Online Agreements"
              description="Freelancers and businesses face trust issues in payments, with no secure commitment system."
            />
            <Cards2
              title="Limited Group Finance Options"
              description="No efficient way for multiple users to pool funds, save together, or split payments transparently."
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Problem;
