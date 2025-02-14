import React from 'react'
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <>
    <hr />
    <div className="relative bg-customSemiPurple h-auto w-full py-7 px-4">
       <div className='flex flex-col md:flex-row py-7 px-4 md:px-14 gap-10 md:gap-96'>
        <div className='text-center md:text-left '>
            <h1 className='text-4xl font-bold text-customBlue lg:text-shadow-custom '>
                Cryptify
                </h1>
            <p className='py-6 text-lg text-white opacity-80 lg:text-shadow-custom'>
            Where Every Payment is Fortified—Shop with Peace of Mind!
            </p>
        </div>
        <div className='flex items md:flex-row justify-around md:gap-36 text-center md:text-left'>
            <div>
           <h1 className='text-2xl text-white font-bold'>
            Company
            </h1>
            <div className='text-lg text-white mt-2 px-3'>
            <ul className="text-lg mt-2 opacity-80">
            <li><a href="#" className="hover:text-gray-300">About us</a></li>
            <li><a href="#" className="hover:text-gray-300">Careers</a></li>
          </ul>
           </div>
           </div>
           <div>
            <h1 className='text-2xl text-white font-bold '>Contact</h1>
            <div className="flex justify-center md:justify-start space-x-3 mt-3">
            <a href="#" className="text-white text-lg hover:text-gray-400"><FaFacebook /></a>
            <a href="#" className="text-white text-lg hover:text-gray-400"><FaTwitter /></a>
            <a href="#" className="text-white text-lg hover:text-gray-400"><FaLinkedin /></a>
          </div>
           </div>
        </div>
       </div>
       <div className="border-t border-customPurple mt-2 pt-6 text-center text-lg text-white opacity-80 lg:text-shadow-custom ">
       &copy; 2025 Cryptify, Inc. All rights reserved. | Empowering the future of digital transactions.
       </div>
      </div>
      
    </>
  )
}
