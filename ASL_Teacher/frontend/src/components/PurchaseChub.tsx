import Header from "./mini/Header";
import Body from "./mini/Body";
import Button from "./mini/Button";
import arrowLeft from "../assets/arrow-left.svg";
import { useNavigate } from "react-router-dom";
import chub from "../assets/chub.png";

function PurchaseChub() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Body tailwind="flex flex-col items-center justify-center gap-[30px] p-8">
        <div className="bg-black rounded-[2rem] shadow-md border border-gray-100 w-full max-w-[700px] p-10 flex flex-col items-center gap-[24px]">
          <img
            src={chub}
            alt="Chub"
            className="max-h-[400px] object-contain"
          />

          <h1 className="text-4xl font-black text-white">Chub</h1>

          <button className="flex items-center gap-3 bg-[#F6D052] px-6 py-3 rounded-2xl text-2xl font-bold text-black hover:scale-[1.02] transition">
            <span>🪙</span>
            <span>Unlock for 1000 Coins</span>
          </button>

        </div>

        <Button
          imageOne={arrowLeft}
          altOne="back"
          onClick={() => navigate("/store")}
        />
      </Body>
    </>
  );
}

export default PurchaseChub;