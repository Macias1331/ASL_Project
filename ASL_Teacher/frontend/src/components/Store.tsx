import Body from "./mini/Body";
import Header from "./mini/Header";
import Button from "./mini/Button";
import arrowLeft from "../assets/arrow-left.svg";
import { useNavigate } from "react-router-dom";

function Store() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Body tailwind="flex flex-col gap-[40px]">
        <div className="flex gap-[20px]">
          <div className="bg-[#FFEFB8] h-[40px] flex-1 flex justify-between items-center rounded-3xl pr-[30px] pl-[30px] text-2xl">
            <p>Featured Items</p>
            <p>45 hours</p>
          </div>
          <div className="bg-[#FFEFB8] h-[40px] flex-1 flex justify-between items-center rounded-3xl pr-[30px] pl-[30px] text-2xl">
            <p>Daily Items</p>
            <p>21 hours</p>
          </div>
        </div>

        <div className="grid grid-rows-2 grid-cols-4 flex-1 gap-[20px]">
          <div className="row-span-full bg-white rounded-3xl"></div>
          <div className="row-span-full bg-white rounded-3xl"></div>
          <div className="bg-[#B9B8B8] rounded-3xl"></div>
          <div className="bg-[#A3B1D4] rounded-3xl"></div>
          <div className="bg-[#FFD2D2] rounded-3xl"></div>
          <div className="bg-white rounded-3xl"></div>
        </div>

        <div className="flex justify-between">
          <Button 
            imageOne={arrowLeft} 
            altOne="back"
            onClick={() => navigate('/menu')}
          />
          <div className="flex gap-[20px]">
            <Button text="1"/>
            <Button text="2"/>
          </div>
        </div>
      </Body>
    </>
  );
}

export default Store;