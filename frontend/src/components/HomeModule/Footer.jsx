import React from "react";
import { motion } from "framer-motion";
import { SparklesIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

export function Footer() {
  return (
    <footer className="relative w-full  border-t border-gray-700 text-slate-400 overflow-hidden">
    

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
          {/* Column 1: Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <a
              href="#"
              className="group flex items-center gap-3 text-white text-xl font-bold mb-4"
            >
            
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Dkarma
              </span>
            </a>
            <p className="text-slate-400 leading-relaxed max-w-xs mb-6">
              Empowering global finance with secure blockchain contracts and
              a decentralized reputation system for the future of work.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-slate-500">Live on EDU Chain</span>
            </div>
          </motion.div>

          {/* Column 2: Product */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-semibold mb-4 text-base">Product</h3>
            <ul className="space-y-3">
              {[
                { name: "Features", href: "#" },
                { name: "Pricing", href: "#" },
                { name: "Use Cases", href: "#" },
                { name: "Documentation", href: "/docs" },
                { name: "API", href: "#" },
              ].map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={item.href}
                    className="group flex items-center gap-2 hover:text-blue-500 transition-colors duration-300"
                  >
                    <span>{item.name}</span>
                    <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-semibold mb-4 text-base">Company</h3>
            <ul className="space-y-3">
              {[
                { name: "About Us", href: "#" },
                { name: "Blog", href: "#" },
                { name: "Careers", href: "#" },
                { name: "Contact", href: "#" },
                { name: "Press Kit", href: "#" },
              ].map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={item.href}
                    className="group flex items-center gap-2 hover:text-blue-500 transition-colors duration-300"
                  >
                    <span>{item.name}</span>
                    <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-semibold mb-4 text-base flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-blue-500" />
              Stay Updated
            </h3>
            <p className="text-sm mb-4 text-slate-400 leading-relaxed">
              Subscribe for product updates, industry insights, and exclusive
              blockchain tips.
            </p>
            <form className="space-y-3">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-all duration-300 group-hover:border-white/20"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-300/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              </div>
              <button
                type="submit"
                className="group relative w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-xl transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-blue-500/25"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Subscribe
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </form>
            <p className="text-xs text-slate-500 mt-3">
              No spam, unsubscribe at any time.
            </p>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-white/10 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <span>
                © {new Date().getFullYear()} Dkarma. All rights reserved.
              </span>
              <span>•</span>
              <a
                href="#"
                className="hover:text-blue-500 transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <span>•</span>
              <a
                href="#"
                className="hover:text-blue-500 transition-colors duration-300"
              >
                Terms of Service
              </a>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Built on EDU Chain</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}