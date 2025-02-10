import React from 'react'
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <>
    <hr />
    <div className="relative bg-customSemiPurple h-auto w-full py-7 px-4">
       <div className='flex flex-col md:flex-row py-7 px-4 md:px-14 gap-10 md:gap-96'>
        <div className='text-center md:text-left'>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-600 to-purple-900 text-transparent bg-clip-text'>
                FortressPay
                </h1>
            <p className='py-6 text-xl bg-gradient-to-r from-teal-700 via-olive-600 to-yellow-300 text-transparent bg-clip-text'>
            Where Every Payment is Fortified—Shop with Peace of Mind!
            </p>
        </div>
        <div className='flex flex-col md:flex-row gap-10 md:gap-36 text-center md:text-left'>
            <div>
           <h1 className='text-2xl text-white font-bold'>
            Company
            </h1>
            <div className='text-lg text-white mt-2 px-3'>
            <ul className="text-lg mt-2">
            <li><a href="#" className="hover:underline">About us</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
          </ul>
           </div>
           </div>
           <div>
            <h1 className='text-2xl text-white font-bold'>Contact</h1>
            <div className="flex justify-center md:justify-start space-x-3 mt-3">
            <a href="#" className="text-white text-lg hover:text-gray-400"><FaFacebook /></a>
            <a href="#" className="text-white text-lg hover:text-gray-400"><FaTwitter /></a>
            <a href="#" className="text-white text-lg hover:text-gray-400"><FaLinkedin /></a>
          </div>
           </div>
        </div>
       </div>
       <div className="border-t border-gray-600 mt-2 pt-6 text-center text-xl text-white">
       &copy; 2025 FortressPay, Inc. All rights reserved. | Empowering the future of digital transactions.
       </div>
      </div>
      
    </>
  )
}
