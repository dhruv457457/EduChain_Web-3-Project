import React from "react";
import { motion } from "framer-motion";

function LogoCloud() {
  const logos = [
    {
      src: "https://pody.network/partner/educhain-black.svg",
      alt: "EduChain",
    },
    {
      src: "https://pody.network/_next/image?url=%2Fpartner%2Fblockchain-innovation-hub.png&w=640&q=75",
      alt: "Blockchain Innovation Hub",
    },
    {
      src: "https://pody.network/_next/image?url=%2Fpartner%2Fopencampus.png&w=640&q=75",
      alt: "OpenCampus",
    },
  ];

  return (
    <section className="relative w-full bg-customDarkpurple py-24 sm:pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-customPurple drop-shadow-md">
          Powered by Leading Web3 Chains & Innovators
        </h2>

        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 place-items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {logos.map((logo, index) => (
            <motion.div
              key={index}
              className="bg-white p-4 rounded-xl border border-customPurple/40 hover:border-customPurple shadow-md hover:shadow-customPurple/30 transition-all duration-300 cursor-pointer w-44 h-20 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default LogoCloud;
