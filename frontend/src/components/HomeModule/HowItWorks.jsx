import { Users, Shield, TrendingUp, EarthLockIcon } from "lucide-react";
import { motion } from "framer-motion";

// Hex to RGBA utility
const hexToRgba = (hex, opacity) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  return `rgba(${+r},${+g},${+b},${opacity})`;
};

const HowItWorks = () => {
  const features = [
    {
      number: "25+",
      label: "blockchain networks in one platform",
      description:
        "Connect with clients across multiple chains including Ethereum, Polygon, Solana, and more. One profile, unlimited opportunities.",
      color: "#5A67D8",
      icon: <Users size={28} className="text-white" />,
    },
    {
      number: "170+",
      label: "crypto payment methods",
      description:
        "Get paid in any cryptocurrency you prefer. From Bitcoin to DeFi tokens, choose how you want to receive your earnings.",
      color: "#38A169",
      icon: <Shield size={28} className="text-white" />,
      featured: true,
    },
    {
      number: "Smart",
      label: "routing to optimize earnings",
      description:
        "Our AI matches you with the highest-paying projects that fit your skills. Maximize your potential in the decentralized economy.",
      color: "#6B46C1",
      icon: <TrendingUp size={28} className="text-white" />,
    },
  ];

  return (
    <div className="min-h-screen py-20 relative">
      <div className="max-w-7xl mx-auto ">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16"
        >
          <div className="text-left border-r border-white border-opacity-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
              <EarthLockIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-slate-300">
               Earning Engine
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Double the earnings
              <br />
              <span className="bg-gradient-to-r from-primary via-primary_hover to-primary bg-clip-text text-transparent">
                with Dkarma
              </span>
            </h2>
          </div>
          <div className="text-left md:pl-8">
            <p className="text-lg text-slate-300 leading-relaxed">
              Get the best of every opportunity. Dkarma puts an expansive
              network of Web3 projects at your fingertips, and seamlessly
              matches them with the skills best suited to maximize your
              earnings.
            </p>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl p-6 border shadow-lg transition-all duration-300 hover:scale-105 ${
                feature.featured ? "md:scale-105 z-10" : ""
              }`}
              style={{
                backgroundColor: hexToRgba(feature.color, 0.08),
                borderColor: hexToRgba(feature.color, 0.3),
              }}
            >
              <div className="flex flex-col justify-between h-full">
                <div className="mb-4">
                  <div className="text-4xl font-bold text-white mb-1">
                    {feature.number}
                  </div>
                  <div className="text-lg font-medium text-white/90 mb-3">
                    {feature.label}
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div
                  className="self-end p-2 rounded-full"
                  style={{ backgroundColor: feature.color }}
                >
                  {feature.icon}
                </div>
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
