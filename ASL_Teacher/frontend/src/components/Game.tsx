import Body from "./mini/Body";
import Header from "./mini/Header";
import arrowLeft from "../assets/arrow-left.svg";
import play from "../assets/play.png";
import { useNavigate } from "react-router-dom";
import { useCharacter } from "./characterContext";


function Game() {
  const navigate = useNavigate();
  const { selectedCharacter } = useCharacter();

  return (
    <>
      <Header />
      <Body tailwind="flex gap-[6px]">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-[16px]">
            <div className="inline-block bg-[#FFEFB8] rounded-3xl px-[22px] py-[8px] text-2xl font-bold">Learning Mode</div>
          </div>
          <div className="rounded-3xl bg-gradient-to-b from-[#1D1D1D] to-[#454545] p-[20px] border-white border-4 w-full max-w-[780px]">
            <div className="flex justify-between items-center">
              <div className="text-[#F6D052] text-2xl font-bold">Sign-Cam</div>
              <div className="flex items-center gap-[8px]">
                <div className="w-[28px] h-[20px] bg-[#111] rounded-sm" />
                <div className="w-[18px] h-[18px] bg-[#F24D4D] rounded-full shadow-md" />
              </div>
            </div>
            <div className="mt-[12px] border-t border-white/20 pt-[12px]">
              <div className="bg-white rounded-md p-[8px]">
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="rounded-3xl bg-gradient-to-b from-[#3A3A3A] to-[#151515] p-[24px] border-white border-4 w-full max-w-[940px] h-full flex flex-col justify-between min-h-0">
            <div className="bg-gradient-to-br from-[#F0A442] to-[#C44744] rounded-3xl p-[24px] border-white border-2 border-opacity-30 basis-[60%]">
              <div className="flex h-full items-center justify-between">
                <div className="flex-1 flex items-center justify-center text-center">
                  <div>
                    <p className="text-xl">Your word:</p>
                    <h1 className="text-6xl font-bold">"Hello"</h1>
                  </div>
                </div>
                <div className="flex items-center justify-center w-[500px]">
                  <div className="w-[500px] h-[500px] bg-gradient-to-b from-[#D84B4B] to-[#B73A3A] rounded-xl border-4 border-white/80 flex items-center justify-center shadow-md">
                    <img src={play} alt="play" className="h-20 w-20 object-contain" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 basis-[40%] bg-[#D4A090] rounded-2xl p-[18px] shadow-inner text-center h-full flex flex-col justify-center gap-[8px] min-h-0">
                <p className="font-bold text-lg">SignQuest AI</p>
                <p className="text-sm">You are getting there! Just fix up your index finger! Pwetty Pwease!!!</p>
            </div>
          </div>
        </div>
        <button 
          aria-label="back" 
          className="fixed left-[20px] bottom-[20px] z-50 bg-[#F6D052] rounded-3xl p-[10px] w-[56px] h-[56px] flex items-center justify-center shadow-md"
          onClick={() => navigate('/menu')}
        >
          <img src={arrowLeft} alt="back" />
        </button>
      </Body>
    </>
  );
}

export default Game;