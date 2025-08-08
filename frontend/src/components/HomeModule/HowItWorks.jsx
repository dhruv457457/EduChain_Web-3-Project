import { Users, Shield, TrendingUp } from "lucide-react";
import React from "react";

const HowItWorks = () => {
  const features = [
    {
      number: "25+",
      label: "blockchain networks in one platform",
      description:
        "Connect with clients across multiple chains including Ethereum, Polygon, Solana, and more. One profile, unlimited opportunities.",
      bgGradient: "from-purple-500 to-blue-600",
      icon: <Users size={60} className="text-white/80" />,
    },
    {
      number: "170+",
      label: "crypto payment methods",
      description:
        "Get paid in any cryptocurrency you prefer. From Bitcoin to DeFi tokens, choose how you want to receive your earnings.",
      bgGradient: "from-blue-600 to-cyan-500",
      icon: <Shield size={60} className="text-white/80" />,
      featured: true,
    },
    {
      number: "Smart",
      label: "routing to optimize earnings",
      description:
        "Our AI matches you with the highest-paying projects that fit your skills. Maximize your potential in the decentralized economy.",
      bgGradient: "from-cyan-500 to-teal-500",
      icon: <TrendingUp size={60} className="text-white/80" />,
    },
  ];

  return (
    <div className="min-h-screen py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className=" w-full mb-16 flex ">
          <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
            Double the earnings with a fraction of the effort
          </h1>
          <div>
            <p className="mt-6 text-xl text-slate-300 leading-relaxed">
              Get the best of every opportunity. Cryptify puts an expansive
              network of Web3 projects at your fingertips, and seamlessly
              matches them with the skills best suited to maximize your
              earnings.
            </p>
            <button className="mt-8 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-100 transition-colors duration-200 shadow-xl">
              Start earning
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-3xl ${
                feature.featured ? "md:scale-105 z-10" : ""
              } transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              <div
                className={`bg-gradient-to-br ${feature.bgGradient} p-8 min-h-64 flex flex-col  relative`}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                  {feature.icon}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="text-4xl font-bold text-white mb-2">
                    {feature.number}
                  </div>
                  <div className="text-lg font-medium text-white/90 mb-4">
                    {feature.label}
                  </div>
                </div>

                {/* Bottom section with description */}
                <div className="relative z-10">
                  <p className="text-white/80 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-400 text-lg mb-6">
            Ready to revolutionize your freelancing career?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-primary to-primary_hover1 text-white font-semibold rounded-full hover:from-primary_hover1 hover:to-primary transition-all duration-200 shadow-lg">
              Join as Freelancer
            </button>
            <button className="px-8 py-3 border border-slate-600 text-white font-semibold rounded-full hover:border-slate-500 hover:bg-slate-800 transition-all duration-200">
              Hire Talent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
