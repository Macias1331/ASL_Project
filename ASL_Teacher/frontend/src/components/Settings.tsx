import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from "./mini/Header";
import Body from "./mini/Body";
import google from '../assets/google-original.svg';

function SettingsScreen() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Body tailwind="flex flex-col items-center justify-between h-[calc(100vh-100px)] p-4 md:p-6 w-full">
        
        <div className="bg-[#fce17a] text-black font-bold text-3xl px-16 py-4 rounded-2xl shadow-md shrink-0 mt-4 md:mt-8">
          Settings
        </div>

        <div className="flex flex-col justify-center items-center flex-1 gap-16 md:gap-24 w-full max-w-7xl py-10">
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 w-full">
            <button className="bg-[#6b6161] border-2 border-[#9b8e8e] text-white px-8 py-4 md:py-6 rounded-full font-bold text-xl md:text-2xl min-w-[220px] md:min-w-[280px] hover:scale-105 transition-transform">
              Volume: 90%
            </button>
            
            <button className="bg-[#fce17a] text-black px-8 py-4 md:py-6 rounded-full font-bold text-xl md:text-2xl flex items-center justify-center gap-5 min-w-[220px] md:min-w-[280px] hover:scale-105 transition-transform">
              Music 
              <span className="bg-[#4ade80] border-2 border-black text-black text-base md:text-lg font-black rounded-full h-9 w-9 md:h-10 md:w-10 flex items-center justify-center">
                ON
              </span>
            </button>

            <button className="bg-[#fce17a] text-black px-8 py-4 md:py-6 rounded-full font-bold text-xl md:text-2xl min-w-[220px] md:min-w-[280px] hover:scale-105 transition-transform">
              Resolution: 1080p
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 w-full">
            <button className="bg-black border-2 border-white text-white px-14 py-4 md:py-6 rounded-full font-bold text-xl md:text-2xl hover:scale-105 transition-transform">
              Dark Mode
            </button>

            <div className="flex gap-6 md:gap-8">
              <button className="bg-black border-2 border-white px-6 py-3 md:py-4 rounded-full flex items-center gap-4 hover:scale-105 transition-transform">
                <span className="font-serif italic text-white text-2xl md:text-3xl">X</span>
                <span className="bg-[#4ade80] text-black rounded-full h-8 w-8 md:h-10 md:w-10 flex items-center justify-center font-bold text-lg">✓</span>
              </button>
              
              <button className="bg-black border-2 border-white px-6 py-3 md:py-4 rounded-full flex items-center gap-4 hover:scale-105 transition-transform">
                <img src={google} alt="Google" className="h-8 w-8 md:h-10 md:w-10 object-contain" />
                <span className="bg-red-600 text-black rounded-full h-8 w-8 md:h-10 md:w-10 flex items-center justify-center font-bold text-lg">X</span>
              </button>

              <button className="bg-black border-2 border-white px-6 py-3 md:py-4 rounded-full flex items-center gap-4 hover:scale-105 transition-transform">
                <span className="font-bold text-white text-2xl md:text-3xl">f</span>
                <span className="bg-[#4ade80] text-black rounded-full h-8 w-8 md:h-10 md:w-10 flex items-center justify-center font-bold text-lg">✓</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-end gap-8 md:gap-12 w-full text-center">
            
            <div className="flex flex-col items-center gap-3">
              <span className="font-semibold text-white text-lg md:text-xl">Language</span>
              <button className="bg-[#fce17a] text-black px-8 py-4 md:py-6 rounded-2xl font-bold text-xl md:text-2xl min-w-[200px] md:min-w-[240px] hover:scale-105 transition-transform">
                English
              </button>
            </div>

            <button className="bg-[#fce17a] text-black px-8 py-4 md:py-6 rounded-2xl font-bold text-xl md:text-2xl min-w-[200px] md:min-w-[240px] hover:scale-105 transition-transform">
              Terms of service
            </button>

            <div className="flex flex-col items-center gap-3">
              <span className="font-semibold text-white text-lg md:text-xl">Location</span>
              <button className="bg-[#fce17a] text-black px-8 py-4 md:py-6 rounded-2xl font-bold text-xl md:text-2xl min-w-[200px] md:min-w-[240px] hover:scale-105 transition-transform">
                United States
              </button>
            </div>

            <button className="bg-[#fce17a] text-black px-8 py-4 md:py-6 rounded-2xl font-bold text-xl md:text-2xl min-w-[200px] md:min-w-[240px] hover:scale-105 transition-transform">
              Credits
            </button>
          </div>
        </div>

        <div className="w-full max-w-7xl flex justify-between items-center shrink-0 pt-4 pb-6">
          
          <button 
            onClick={() => navigate(-1)}
            className="bg-[#fce17a] text-black h-16 w-24 md:h-20 md:w-32 rounded-2xl flex items-center justify-center hover:scale-110 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 14 4 9l5-5"/>
              <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/>
            </svg>
          </button>

          <button 
            onClick={() => navigate('/')} 
            className="bg-[#c8201a] border-2 border-white text-white px-10 py-4 md:py-6 rounded-2xl font-bold text-xl md:text-2xl hover:bg-red-700 transition-colors"
          >
            Log Out
          </button>
          
        </div>
      </Body>
    </>
  );
}

export default SettingsScreen;