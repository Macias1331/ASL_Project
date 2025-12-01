import Header from "./mini/Header";
import Body from "./mini/Body";
import star from "../assets/star.png";
import lock from "../assets/lock.svg";
import fire from "../assets/fire.png";
import arrowLeft from "../assets/arrow-left.svg";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

type Achievement = {
  id: number;
  title: string;
  description: string;
  percent: number;
  unlocked: boolean;
};

function AchievementCard({ a, bg, border }: { a: Achievement; bg: string; border: string }) {
  return (
    <div
      className="rounded-3xl h-[96px] flex items-center p-[18px] w-full"
      style={{ background: bg, border: `4px solid ${border}` }}
    >
      <div className="ml-[12px] w-[54px] h-[54px] bg-white/30 rounded-xl flex items-center justify-center">
        {a.unlocked ? (
          <img src={star} alt="star" className="h-8 w-8" />
        ) : (
          <img src={lock} alt="locked" className="h-6 w-6 opacity-70" />
        )}
      </div>
      <div className="ml-[16px] mr-auto max-w-3/4">
        <p className="text-2xl font-bold">{a.title}</p>
        <p className="text-sm text-[#6B6B6B] mt-[4px]">{a.description}</p>
      </div>
      <div className="mr-[16px] text-xl font-bold">{a.percent}%</div>
    </div>
  );
}

function Achievements() {
  const navigate = useNavigate();

  const [achievements] = useState<Achievement[]>([
    { id: 1, title: "First Steps", description: "Complete your first lesson.", percent: 100, unlocked: true },
    { id: 2, title: "Study Streak", description: "Study 7 days in a row.", percent: 65, unlocked: false },
    { id: 3, title: "Social Star", description: "Connect with 10 friends.", percent: 40, unlocked: false },
    { id: 4, title: "Fluency", description: "Achieve 80% accuracy on tests.", percent: 95, unlocked: true },
    { id: 5, title: "Marathon", description: "Practice 100 minutes total.", percent: 28, unlocked: false },
    { id: 6, title: "Collector", description: "Complete 20 achievements.", percent: 30, unlocked: true },
    { id: 7, title: "Sharpshooter", description: "Finish a mini-game with perfect score.", percent: 5, unlocked: false },
    { id: 9, title: "Legend", description: "Complete all achievements.", percent: 12, unlocked: false },
    { id: 10, title: "?", description: "Hidden.", percent: 12, unlocked: false },
    { id: 11, title: "?", description: "Hidden.", percent: 12, unlocked: false },
    { id: 12, title: "?", description: "Hidden.", percent: 12, unlocked: false },
    { id: 13, title: "?", description: "Complete all achievements.", percent: 12, unlocked: false },
    
  ]);

  return (
    <>
      <Header />
      <Body tailwind="flex justify-center">
        <div className="w-full max-w-[1200px] flex gap-[30px]">
          <div className="w-[420px] h-full flex items-center justify-center">
            <div className="h-[460px] w-full bg-transparent flex flex-col items-center justify-center">
              <div className="mr-50 mb-10 h-[400px] w-[400px] bg-transparent border border-white/10 rounded-md flex items-center justify-center">
                <img src={fire} alt="character" className="h-[400px] w-[400px] object-contain" />
              </div>
              <div className=" mr-50 grid grid-cols-6 gap-[14px] justify-center mt-auto w-[360px]">
                {achievements.map((a, i) => (
                  <div key={i} className="relative h-[36px] w-[36px] rounded-full bg-[#D9D9D9] flex items-center justify-center">
                    {a.unlocked && (
                      <svg className="h-[20px] w-[20px] text-[#24E21D]" viewBox="0 0 24 24" fill="#24E21D" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 15l-3.5-3.5 1.4-1.4L10 12.2 15.1 7l1.4 1.4z" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
          </div>
          <button 
            aria-label="back" 
            className="fixed left-[20px] bottom-[20px] z-50 bg-[#F6D052] rounded-3xl p-[10px] w-[56px] h-[56px] flex items-center justify-center"
            onClick={() => navigate('/menu')}
          >
            <img src={arrowLeft} alt="back" />
          </button>
          
          <div className="flex-1 bg-transparent rounded-2xl p-[16px] flex flex-col">
            <div className="flex items-center gap-[12px]">
              <div className="flex-1" />
              <div className="flex-1 flex justify-center">
                <div className="bg-[#FFEFB8] px-[22px] py-[8px] rounded-3xl text-2xl font-bold">Achievements</div>
              </div>
              <div className="flex-1" />
            </div>
            <div className="mt-[24px] p-[12px] bg-transparent rounded-xl h-[calc(100vh-200px)] overflow-y-auto friends-scroll">
              <div className="flex flex-col gap-[18px]">
                {achievements.map((a) => {
                  let bg = "#FFFFFF";
                  let border = "#DDDDDD";
                  if (a.percent === 100) {
                    bg = "#ffffffff";
                    border = "#F6D052";
                  } else if (a.unlocked) {
                    bg = "#a8e1a6ff";
                    border = "#FF9EB3";
                  } else if (a.percent > 75) {
                    bg = "#d1b1b1ff";
                    border = "#FFFFFF";
                  } else if (a.percent > 30) {
                    bg = "#FFFFFF";
                    border = "#D33";
                  } else {
                    bg = "#8d89d2ff";
                    border = "#FFFFFF";
                  }
                  return <AchievementCard key={a.id} a={a} bg={bg} border={border} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </Body>
    </>
  );
}

export default Achievements;
