import React from "react";
import { FaTwitter, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <hr className="border-t-2 border-customPurple opacity-50" />
      <div className="bg-customDarkpurple py-10 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
              Cryptify
            </h1>

            <p className="mt-3 text-lg opacity-80">
              Where Every Payment is Fortified—Shop with Peace of Mind!
            </p>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-customPurple">Connect with us</h1>
            <div className="flex justify-center md:justify-start space-x-4 mt-3 ">
              <a
                href="https://x.com/CryptifySecure"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-xl hover:text-gray-400 transition-all"
              >
                <FaTwitter />
              </a>

              <a
                href="https://github.com/dhruv457457/EduChain_Web-3-Project"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-xl hover:text-gray-400 transition-all"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-customPurple mt-10 pt-8 text-center text-lg opacity-80">
          &copy; {new Date().getFullYear()} Cryptify, Inc. All rights reserved.
          | Empowering the future of digital transactions.
        </div>
      </div>
    </>
  );
}
