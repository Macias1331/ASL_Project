import Body from "./mini/Body";
import Header from "./mini/Header";
import character from "../assets/character.png";
import Button from "./mini/Button";
import arrowLeft from "../assets/arrow-left.svg";
import { useNavigate } from "react-router-dom";

function DressingRoom() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Body tailwind="flex">
        <div className="flex-1 flex flex-col">
          <img src={character} alt='your character' className="size-125 self-center mt-auto" />
          <h2 className="bg-white text-3xl pl-[20px] pr-[20px] self-center rounded-lg">Cookie Crumbler</h2>
          <div className="mt-auto"><Button imageOne={arrowLeft} altOne='back' onClick={() => navigate('/menu')} /></div>
        </div>

        <div className="flex-1 bg-white rounded-lg flex flex-col min-w-[700px] max-w-[700px]">
          <div className="flex-1 border-b border-[#554747] flex items-center pl-[20px] pr-[40px] pt-[10px] pb-[10px] gap-[20px]">
            <button className="flex-2 h-4/5 border rounded-xl text-3xl">Selecting</button>
            <div className="flex-1 bg-[#4B5988] h-full rounded-xl"></div>
            <div className="flex-1 bg-[#4B5988] h-full rounded-xl"></div>
            <div className="flex-1 bg-[#4B5988] h-full rounded-xl"></div>
            <div className="flex-1 bg-[#4B5988] h-full rounded-xl"></div>
          </div>

          <div className="flex-7 grid grid-cols-4 auto-rows-[150px] gap-[20px] overflow-auto p-[20px]">
            
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
            <div className='bg-black rounded-xl'></div>
          </div>
        </div>
      </Body>
    </>
  );
}

export default DressingRoom;