import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from "./mini/Header";
import Body from "./mini/Body";

function SettingsScreen() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Body tailwind="flex flex-col items-center justify-between h-[calc(100vh-100px)] p-4 md:p-6 w-full">
        
  
        <div className="bg-[#fce17a] text-black font-bold text-xl px-10 py-1 md:py-2 rounded-xl shadow-md shrink-0 mt-4 md:mt-8">
          Settings
        </div>


        <div className="flex flex-col justify-center items-center flex-1 gap-10 md:gap-16 w-full max-w-5xl py-8">
          
   
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 w-full">
            <button className="bg-[#6b6161] border-2 border-[#9b8e8e] text-white px-4 py-1.5 md:py-2 rounded-full font-semibold md:text-lg min-w-[140px] md:min-w-[160px] hover:scale-105 transition-transform">
              Volume: 90%
            </button>
            
            <button className="bg-[#fce17a] text-black px-4 py-1.5 md:py-2 rounded-full font-semibold md:text-lg flex items-center justify-center gap-3 min-w-[140px] md:min-w-[160px] hover:scale-105 transition-transform">
              Music 
              <span className="bg-[#4ade80] border-2 border-black text-black text-xs font-black rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center">
                ON
              </span>
            </button>

            <button className="bg-[#fce17a] text-black px-4 py-1.5 md:py-2 rounded-full font-semibold md:text-lg min-w-[140px] md:min-w-[160px] hover:scale-105 transition-transform">
              Resolution: 1080p
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-10 w-full">
            <button className="bg-black border-2 border-white text-white px-6 py-1.5 md:py-2 rounded-full font-semibold md:text-lg hover:scale-105 transition-transform">
              Dark Mode
            </button>

            <div className="flex gap-3 md:gap-5">
             
              <button className="bg-black border-2 border-white px-3 py-1 rounded-full flex items-center gap-2 hover:scale-105 transition-transform">
                <span className="font-serif italic text-white md:text-lg">X</span>
                <span className="bg-[#4ade80] text-black rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center font-bold text-sm">✓</span>
              </button>
              
         
              <button className="bg-black border-2 border-white px-3 py-1 rounded-full flex items-center gap-2 hover:scale-105 transition-transform">
                <span className="text-red-500 font-bold md:text-lg">G</span>
                <span className="bg-red-600 text-black rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center font-bold text-sm">X</span>
              </button>

             
              <button className="bg-black border-2 border-white px-3 py-1 rounded-full flex items-center gap-2 hover:scale-105 transition-transform">
                <span className="font-bold text-white md:text-lg">f</span>
                <span className="bg-[#4ade80] text-black rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center font-bold text-sm">✓</span>
              </button>
            </div>
          </div>

     
          <div className="flex flex-wrap justify-center items-end gap-4 md:gap-10 w-full text-center">
            
            <div className="flex flex-col items-center gap-1 md:gap-2">
              <span className="font-semibold text-white text-sm md:text-base">Language</span>
              <button className="bg-[#fce17a] text-black px-4 py-1.5 md:py-2 rounded-xl font-bold md:text-lg min-w-[120px] md:min-w-[140px] hover:scale-105 transition-transform">
                English
              </button>
            </div>

            <button className="bg-[#fce17a] text-black px-4 py-1.5 md:py-2 rounded-xl font-bold md:text-lg min-w-[120px] md:min-w-[140px] hover:scale-105 transition-transform">
              Terms of service
            </button>

            <div className="flex flex-col items-center gap-1 md:gap-2">
              <span className="font-semibold text-white text-sm md:text-base">Location</span>
              <button className="bg-[#fce17a] text-black px-4 py-1.5 md:py-2 rounded-xl font-bold md:text-lg min-w-[120px] md:min-w-[140px] hover:scale-105 transition-transform">
                United States
              </button>
            </div>

            <button className="bg-[#fce17a] text-black px-4 py-1.5 md:py-2 rounded-xl font-bold md:text-lg min-w-[120px] md:min-w-[140px] hover:scale-105 transition-transform">
              Credits
            </button>
          </div>
        </div>

        <div className="w-full max-w-6xl flex justify-between items-center shrink-0 pt-2 pb-4">
          
          <button 
            onClick={() => navigate(-1)}
            className="bg-[#fce17a] text-black h-10 w-14 md:h-12 md:w-16 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 14 4 9l5-5"/>
              <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/>
            </svg>
          </button>

          <button 
            onClick={() => navigate('/')} 
            className="bg-[#c8201a] border-2 border-white text-white px-6 py-1.5 md:py-2 rounded-xl font-bold md:text-lg hover:bg-red-700 transition-colors"
          >
            Log Out
          </button>
          
        </div>
      </Body>
    </>
  );
}

export default SettingsScreen;