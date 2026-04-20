import Body from "./mini/Body";
import Header from "./mini/Header";
import Button from "./mini/Button";
import arrowLeft from "../assets/arrow-left.svg";
import { useNavigate } from "react-router-dom";

// Simple Lock Icon SVG
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-900/50">
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
  </svg>
);

function Store() {
  const navigate = useNavigate();

  const handlePurchaseDLC = () => navigate('/purchase/asl-master');
  const handlePurchasePass = () => navigate('/purchase/battle-pass');
  const handleUnlockFeatured = () => navigate('/purchase/featured-unlock');

  return (
    <>
      <Header />
      <Body tailwind="flex flex-col gap-[40px] p-8">
        {/* Header Tabs */}
        <div className="flex gap-[20px]">
          <div className="bg-[#FFEFB8] h-[50px] flex-1 flex justify-between items-center rounded-2xl px-8 shadow-sm border border-yellow-200">
            <p className="font-bold text-gray-800 tracking-wide uppercase">Featured Items</p>
            <p className="text-sm font-medium bg-white/50 px-3 py-1 rounded-lg">45h 12m</p>
          </div>
          <div className="bg-[#FFEFB8] h-[50px] flex-1 flex justify-between items-center rounded-2xl px-8 shadow-sm border border-yellow-200">
            <p className="font-bold text-gray-800 tracking-wide uppercase">Daily Items</p>
            <p className="text-sm font-medium bg-white/50 px-3 py-1 rounded-lg">21h 05m</p>
          </div>
        </div>

        {/* Store Grid */}
        <div className="grid grid-rows-2 grid-cols-4 flex-1 gap-[24px]">
          <div className="row-span-full bg-white rounded-[2rem] shadow-md border border-gray-100"></div>
          <div className="row-span-full bg-white rounded-[2rem] shadow-md border border-gray-100"></div>
          
          {/* ASL Master DLC Box */}
          <div 
            onClick={handlePurchaseDLC}
            className="relative group overflow-hidden bg-gradient-to-br from-[#4A4A4A] to-[#2D2D2D] rounded-[2rem] flex flex-col items-center justify-end p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-95"
          >
            <div className="z-10 text-center w-full">
              <span className="text-[10px] uppercase tracking-[0.2em] text-yellow-400 font-bold mb-1 block">Expansion</span>
              <h3 className="text-white text-2xl font-black mb-4 tracking-tight">ASL MASTER</h3>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white py-2 rounded-xl text-sm font-semibold group-hover:bg-yellow-400 group-hover:text-black transition-colors duration-300 uppercase">
                Unlock
              </div>
            </div>
          </div>

          {/* Battle Pass Box */}
          <div 
            onClick={handlePurchasePass}
            className="relative group overflow-hidden bg-gradient-to-br from-[#6366F1] to-[#4338CA] rounded-[2rem] flex flex-col items-center justify-end p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-95"
          >
            <div className="z-10 text-center w-full">
              <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-200 font-bold mb-1 block">Season 01</span>
              <h3 className="text-white text-2xl font-black mb-4 tracking-tight italic">BATTLE PASS</h3>
              <div className="bg-white text-indigo-700 py-2 rounded-xl text-sm font-bold shadow-lg group-hover:bg-indigo-50 transition-colors duration-300 uppercase">
                Upgrade
              </div>
            </div>
          </div>

          {/* PAY TO UNLOCK: Featured Items Box */}
          <div 
            onClick={handleUnlockFeatured}
            className="relative group overflow-hidden bg-[#FFD2D2] rounded-[2rem] flex flex-col items-center justify-center p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95 border-2 border-red-200"
          >
            {/* Visual Indicator of "Locked" Content */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] group-hover:backdrop-blur-0 transition-all duration-500"></div>
            
            <div className="z-10 flex flex-col items-center">
              <div className="mb-2 transform group-hover:scale-110 transition-transform">
                <LockIcon />
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-red-800 font-black mb-1 opacity-60">Store Feature</p>
              <h3 className="text-red-950 text-xl font-black mb-4 tracking-tighter text-center">FEATURED SHOP</h3>
              
              <div className="bg-red-600 text-white px-6 py-2 rounded-2xl text-xs font-black shadow-lg shadow-red-200 group-hover:bg-red-700 transition-colors flex flex-col items-center">
                <span>PAY TO UNLOCK</span>
                <span className="text-[10px] opacity-80">$9.99</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-md border border-gray-100"></div>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center mt-4">
          <Button 
            imageOne={arrowLeft} 
            altOne="back"
            onClick={() => navigate('/menu')}
          />
          <div className="flex gap-[12px] bg-gray-100/50 p-2 rounded-2xl">
            <Button text="1" tailwind="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm font-bold text-gray-700 hover:bg-yellow-400 transition-colors" />
            <Button text="2" tailwind="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 transition-colors" />
          </div>
        </div>
      </Body>
    </>
  );
}

export default Store;