import Header from "./mini/Header";
import Body from "./mini/Body";
import star from "../assets/star.png";
import lock from "../assets/lock.svg";
import fire from "../assets/fire.png";
import arrowLeft from "../assets/arrow-left.svg";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import stara from "../assets/stara.png";

type Achievement = {
  id: number;
  title: string;
  description: string;
  percent: number;
  unlocked: boolean;
};

function AchievementCard({ a }: { a: Achievement }) {
  // Determine the visual state of the card
  const isComplete = a.percent === 100 || a.unlocked;
  const isStarted = a.percent > 0 && !isComplete;

  // Dynamic classes based on achievement progress
  const cardTheme = isComplete
    ? "bg-gradient-to-r from-[#FFD700] to-[#FDB931] border-[#FFFFFF] shadow-[0_0_15px_rgba(253,185,49,0.4)] text-black"
    : isStarted
    ? "bg-[#243447] border-[#3A4D63] text-white"
    : "bg-[#1A2533] border-[#2A3A4D] text-gray-500 opacity-80 grayscale-[50%]";

  return (
    <div
      className={`rounded-3xl border-4 h-[100px] flex items-center p-[16px] w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cardTheme}`}
    >
      {/* Icon Container */}
      <div 
        className={`shrink-0 w-[56px] h-[56px] rounded-2xl flex items-center justify-center shadow-inner ${
          isComplete ? "bg-white/40" : "bg-black/30"
        }`}
      >
        {isComplete ? (
          <img src={star} alt="star" className="h-8 w-8 drop-shadow-md animate-pulse" />
        ) : (
          <img src={lock} alt="locked" className="h-6 w-6 opacity-60" />
        )}
      </div>

      {/* Text Content */}
      <div className="ml-[16px] flex-1">
        <p className={`text-xl font-bold tracking-wide ${isComplete ? "text-black" : "text-white"}`}>
          {a.title}
        </p>
        <p className={`text-sm mt-1 ${isComplete ? "text-black/70 font-semibold" : "text-gray-400"}`}>
          {a.description}
        </p>
      </div>

      {/* Progress Bar Section */}
      <div className="ml-[16px] w-[120px] shrink-0 flex flex-col items-end gap-1.5">
        <span className={`text-lg font-bold ${isComplete ? "text-black" : "text-white"}`}>
          {a.percent}%
        </span>
        <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              isComplete ? "bg-white" : "bg-[#4ade80]"
            }`}
            style={{ width: `${a.percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Achievements() {
  const navigate = useNavigate();

  const [achievements] = useState<Achievement[]>([
    { id: 1, title: "First Steps", description: "Complete your first lesson.", percent: 100, unlocked: true },
    { id: 2, title: "Study Streak", description: "Study 7 days in a row.", percent: 65, unlocked: false },
    { id: 3, title: "Social Star", description: "Connect with 10 friends.", percent: 40, unlocked: false },
    { id: 4, title: "Fluency", description: "Achieve 80% accuracy on tests.", percent: 95, unlocked: false },
    { id: 5, title: "Marathon", description: "Practice 100 minutes total.", percent: 28, unlocked: false },
    { id: 6, title: "Collector", description: "Complete 20 achievements.", percent: 100, unlocked: true },
    { id: 7, title: "Sharpshooter", description: "Finish a mini-game with perfect score.", percent: 5, unlocked: false },
    { id: 9, title: "Legend", description: "Complete all achievements.", percent: 12, unlocked: false },
    { id: 10, title: "?", description: "Hidden.", percent: 0, unlocked: false },
    { id: 11, title: "?", description: "Hidden.", percent: 0, unlocked: false },
    { id: 12, title: "?", description: "Hidden.", percent: 0, unlocked: false },
    { id: 13, title: "?", description: "Complete all achievements.", percent: 0, unlocked: false },
  ]);

  return (
    <>
      <Header />
      <Body tailwind="flex justify-center items-center">
        <div className="w-full max-w-[1200px] flex gap-[40px] items-start mt-6">
          
          {/* Left Panel: Character Showcase */}
          <div className="w-[420px] flex flex-col items-center justify-center bg-black/20 p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-sm">
            <div className="relative h-[350px] w-[350px] flex items-center justify-center">
              {/* Added a subtle glow effect behind the character */}
              <div className="absolute inset-0 bg-[#F6D052] blur-[100px] opacity-20 rounded-full animate-pulse" />
              <img src={stara} alt="character" className="relative h-[350px] w-[350px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
            </div>
            
            {/* Condensed Achievement Dots */}
            <div className="grid grid-cols-6 gap-[12px] justify-center mt-8 w-full px-4">
              {achievements.map((a, i) => (
                <div 
                  key={i} 
                  className={`relative h-[36px] w-[36px] rounded-full flex items-center justify-center transition-all ${
                    a.unlocked || a.percent === 100 
                      ? "bg-[#24E21D] shadow-[0_0_10px_rgba(36,226,29,0.5)]" 
                      : "bg-[#D9D9D9]/20"
                  }`}
                >
                  {(a.unlocked || a.percent === 100) && (
                    <svg className="h-[20px] w-[20px] text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 15l-3.5-3.5 1.4-1.4L10 12.2 15.1 7l1.4 1.4z" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Back Button */}
          <button 
            aria-label="back" 
            className="fixed left-[30px] bottom-[30px] z-50 bg-[#F6D052] rounded-full p-[14px] w-[64px] h-[64px] flex items-center justify-center shadow-lg hover:bg-yellow-400 hover:scale-110 transition-all"
            onClick={() => navigate('/menu')}
          >
            <img src={arrowLeft} alt="back" className="w-8 h-8" />
          </button>
          
          {/* Right Panel: Achievement List */}
          <div className="flex-1 bg-black/40 rounded-3xl p-[24px] border border-white/10 shadow-2xl flex flex-col h-[calc(100vh-140px)]">
            {/* Header Title */}
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-[#FCE17A] to-[#FFD700] px-[32px] py-[10px] rounded-full text-black text-2xl font-black uppercase tracking-wider shadow-lg">
                Achievements
              </div>
            </div>
            
            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto friends-scroll pr-2">
              <div className="flex flex-col gap-[16px] pb-4">
                {achievements.map((a) => (
                  <AchievementCard key={a.id} a={a} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </Body>
    </>
  );
}

export default Achievements;