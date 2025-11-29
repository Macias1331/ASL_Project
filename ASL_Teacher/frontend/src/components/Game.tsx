import Body from "./mini/Body";
import Header from "./mini/Header";
import arrowLeft from "../assets/arrow-left.svg";

function Game() {
  return (
    <>
      <Header />
      <Body tailwind="flex gap-[20px]">
        <div className="flex-1">
          <button>Learning Mode</button>
          <div className="">
      
          </div>
          <button>
            <img src={arrowLeft} alt="back"/>
          </button>
        </div>

        <div className="flex-1">
        </div>
      </Body>
    </>
  );
}

export default Game;