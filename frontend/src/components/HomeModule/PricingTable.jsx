import React from "react";
import { motion } from "framer-motion";
import { CheckIcon, SparklesIcon } from "@heroicons/react/24/solid";

const plans = [
  {
    name: "Free",
    id: "plan-free",
    price: "$0",
    period: "/yearly",
    description: "For Individuals",
    features: [
      "Browse Projects",
      "Submit Proposals",
      "Basic Smart Contract Payments",
      "Community Support",
    ],
    featured: false,
    button: "Get Started",
  },
  {
    name: "Enterprise",
    id: "plan-enterprise",
    price: "$149",
    period: "/yearly",
    description: "For Large Teams & Corporates",
    features: [
      "Up to 30 Team Members",
      "Dedicated Account Manager",
      "Custom Integrations",
      "Advanced Analytics",
      "24/7 Support",
    ],
    featured: true,
    button: "Contact Sales",
  },
];

// A simple utility for conditional class names
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PricingTable() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto ">
        {/* Section Header - Updated to 2-column layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16"
        >
          {/* Left Column */}
       <div className="text-left border-r  border-white border-opacity-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
              <SparklesIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-slate-300">
                Pricing Plans
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Power up your
              <br />
              <span className="bg-gradient-to-r from-primary via-primary_hover to-primary bg-clip-text text-transparent">
                freelance journey
              </span>
            </h2>
          </div>

          {/* Right Column */}
          <div className="text-left md:pl-8">
            <p className="max-w-2xl text-lg text-slate-300 leading-relaxed">
              Get access to more features and tune up your next project with our
              flexible pricing plans designed for every stage of your career.
            </p>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-2 justify-center"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={classNames(
                "group relative rounded-2xl p-8 flex flex-col items-center border backdrop-blur-sm transition-all duration-500 overflow-hidden",
                plan.featured
                  ? "shadow-2xl scale-105 border-2 border-primary_hover1/40 z-10"
                  : "shadow-lg border-border"
              )}
            >
              {/* Background Gradient */}
              <div
                className={classNames(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  plan.featured
                    ? "from-surface via-primary/5 to-black/20"
                    : "from-surface to-black/20"
                )}
              />

              {/* Content */}
              <div className="relative z-10 w-full">
                {/* Badge */}
                <div className="mb-4 w-full flex justify-between items-center">
                  <span
                    className={classNames(
                      "text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm",
                      plan.featured
                        ? "bg-primary_hover1/10 text-primary"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {plan.name}
                  </span>
                  {plan.featured && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                      <SparklesIcon className="w-3 h-3 text-primary" />
                      <span className="text-xs font-medium text-primary">
                        Popular
                      </span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-base text-slate-400">
                    {plan.period}
                  </span>
                </div>

                {/* Description */}
                <div className="text-slate-400 text-sm mb-6">
                  {plan.description}
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-3 w-full">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.6 + featureIndex * 0.1,
                      }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 text-slate-200"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckIcon
                          className={classNames(
                            "h-3 w-3",
                            plan.featured ? "text-primary_hover1" : "text-primary"
                          )}
                        />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={classNames(
                    "w-full py-3 rounded-xl font-semibold text-base transition-all duration-300 relative overflow-hidden group/btn",
                    plan.featured
                      ? "bg-gradient-to-r from-primary to-primary_hover1 text-white hover:from-primary hover:to-primary shadow-lg"
                      : "bg-primary text-white hover:bg-primary_hover1"
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {plan.button}
                    {plan.featured && (
                      <SparklesIcon className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                    )}
                  </span>
                  {plan.featured && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary_hover1 to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-slate-400 mb-4">
            Need a custom plan? Contact our sales team for enterprise solutions.
          </p>
          <button className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
            Contact Sales Team
          </button>
        </motion.div>
      </div>
    </section>
  );
}
