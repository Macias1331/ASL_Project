import Body from "./mini/Body";
import Header from "./mini/Header";
import Button from "./mini/Button";
import arrowLeft from "../assets/arrow-left.svg";
import { useNavigate } from "react-router-dom";

function Store() {
  const navigate = useNavigate();

  const handlePurchaseDLC = () => navigate('/purchase/asl-master');
  const handlePurchasePass = () => navigate('/purchase/battle-pass');

  return (
    <>
      <Header />
      <Body tailwind="flex flex-col gap-[40px] p-8">
        {/* Header Tabs */}
        <div className="flex gap-[20px]">
          <div className="bg-[#FFEFB8] h-[50px] flex-1 flex justify-between items-center rounded-2xl px-8 shadow-sm border border-yellow-200">
            <p className="font-bold text-gray-800 tracking-wide">FEATURED ITEMS</p>
            <p className="text-sm font-medium bg-white/50 px-3 py-1 rounded-lg">45h 12m</p>
          </div>
          <div className="bg-[#FFEFB8] h-[50px] flex-1 flex justify-between items-center rounded-2xl px-8 shadow-sm border border-yellow-200">
            <p className="font-bold text-gray-800 tracking-wide">DAILY ITEMS</p>
            <p className="text-sm font-medium bg-white/50 px-3 py-1 rounded-lg">21h 05m</p>
          </div>
        </div>

        {/* Store Grid */}
        <div className="grid grid-rows-2 grid-cols-4 flex-1 gap-[24px]">
          <div className="row-span-full bg-white rounded-[2rem] shadow-md border border-gray-100 hover:shadow-lg transition-shadow"></div>
          <div className="row-span-full bg-white rounded-[2rem] shadow-md border border-gray-100 hover:shadow-lg transition-shadow"></div>
          
          {/* ASL Master DLC Box */}
          <div 
            onClick={handlePurchaseDLC}
            className="relative group overflow-hidden bg-gradient-to-br from-[#4A4A4A] to-[#2D2D2D] rounded-[2rem] flex flex-col items-center justify-end p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-95"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
            <div className="z-10 text-center w-full">
              <span className="text-[10px] uppercase tracking-[0.2em] text-yellow-400 font-bold mb-1 block">Expansion Pack</span>
              <h3 className="text-white text-2xl font-black mb-4 tracking-tight">ASL MASTER</h3>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white py-2 rounded-xl text-sm font-semibold group-hover:bg-yellow-400 group-hover:text-black transition-colors duration-300 uppercase tracking-tighter">
                Unlock Now
              </div>
            </div>
          </div>

          {/* Battle Pass Box */}
          <div 
            onClick={handlePurchasePass}
            className="relative group overflow-hidden bg-gradient-to-br from-[#6366F1] to-[#4338CA] rounded-[2rem] flex flex-col items-center justify-end p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-95"
          >
            {/* Animated-style glow effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-60"></div>
            
            <div className="z-10 text-center w-full">
              <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-200 font-bold mb-1 block">Season 01</span>
              <h3 className="text-white text-2xl font-black mb-4 tracking-tight italic">BATTLE PASS</h3>
              <div className="bg-white text-indigo-700 py-2 rounded-xl text-sm font-bold shadow-lg group-hover:bg-indigo-50 transition-colors duration-300 uppercase tracking-tighter">
                Upgrade
              </div>
            </div>
          </div>

          <div className="bg-[#FFD2D2] rounded-[2rem] shadow-md hover:brightness-105 transition-all"></div>
          <div className="bg-white rounded-[2rem] shadow-md border border-gray-100 hover:shadow-lg transition-shadow"></div>
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