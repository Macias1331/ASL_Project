import Header from "./mini/Header";
import fire from "../assets/fire.png";
import star from "../assets/star.png";
import Body from "./mini/Body";
import character from "../assets/character.png";

function MenuScreen() {
  return (
    <>
      <Header />
      <Body tailwind="flex gap-[20px]">
        <div className="flex-1 flex flex-col gap-[30px]">
          <button className="bg-gradient-to-r from-[#FFF0F0] to-[#2B2727] flex-1 flex items-end p-[20px] text-3xl">
            Mini Games
          </button>
          <button className="bg-gradient-to-r from-[#D9D9D9] to-[#FFFFFF] flex-1 flex items-end p-[20px] text-3xl">
            Learning Mode
          </button>
          <button className="bg-gradient-to-r from-[#8C8B8B] to-[#FFFFFF] flex-1 flex items-end p-[20px] text-3xl">
            Achievements
          </button>
          <button className="bg-gradient-to-r from-[#433B3B] to-[#1D1818] text-white text-bold flex-2 flex items-end p-[20px] text-3xl">
            Battle Pass
          </button>

          <div className="flex-1 flex items-center gap-[30px]">
            <button className='bg-[#F6D052] text-3xl flex gap-[10px] items-center flex-3 pt-[20px] pb-[20px] pl-[20px]'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='size-11'>
                <title>cart-minus</title>
                <path d="M16 6V4H8V6M7 18C5.9 18 5 18.9 5 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18M17 18C15.9 18 15 18.9 15 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18M7.2 14.8V14.7L8.1 13H15.5C16.2 13 16.9 12.6 17.2 12L21.1 5L19.4 4L15.5 11H8.5L4.3 2H1V4H3L6.6 11.6L5.2 14C5.1 14.3 5 14.6 5 15C5 16.1 5.9 17 7 17H19V15H7.4C7.3 15 7.2 14.9 7.2 14.8Z" />
              </svg>
              Store
            </button>
            <button aria-label="dressing room" className='bg-[#F6D052] flex-1 flex justify-center pt-[20px] pb-[20px]'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='size-11'>
                <title>dresser-outline</title>
                <path d="M4 3C2.9 3 2 3.9 2 5V18C2 19.11 2.9 20 4 20V21H6V20H18V21H20V20C21.11 20 22 19.11 22 18V5C22 3.9 21.11 3 20 3H4M4 5H20V8H4V5M10 6V7H14V6H10M4 10H20V13H4V10M10 11V12H14V11H10M4 15H20V18H4V15M10 16V17H14V16H10Z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-2 flex flex-col">
          <div className="self-end text-white text-m flex flex-col gap-[5px]">
            <div className="flex gap-[15px] items-center">
              <h3 className="text-bold">Daily Goal</h3>
              <div className="bg-[#D9D9D9] rounded-xl w-[250px] h-[20px]">
                <div className="bg-[#E47615] rounded-xl w-80/100 h-[20px]"></div>
              </div>
              <p>16/30 mins</p>
            </div>

            <div className="flex items-center text-xl justify-end">
              <img src={fire} alt='fire' className="h-[50px] w-[50px]"/>
              <p>21 Day Streak!</p>
            </div>
          </div>

          {/*character*/}
          <div className="flex-1 flex justify-end">
            <img src={character} alt='your character' />
          </div>

          <div className="flex justify-end gap-[30px]">
            <a className="h-[84px] w-[200px] bg-[#F6D052] self-end flex flex-col items-center justify-center text-xl">
              <p className="font-bold">Game Selected:</p> 
              <p>FREE FOR ALL</p>
            </a>
            <a>
              <div 
                className="
                    grid grid-cols-[1fr_2fr] grid-rows-3 h-[125px] w-[400px] 
                    bg-[rgba(255,255,255,0.25)] place-items-center p-[10px] 
                    pl-[20px] pr-[20px] gap-x-[20px] gap-y-[10px] text-white
                  "
              >
                <div className="bg-gradient-to-b from-[#B29538] to-[#4C4018] row-span-full rounded-xl">
                  <img src={star} alt='star' />
                </div>
                <p className="text-3xl font-bold">HacksNoAim</p>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-10 fill-[#EBEF0A]">
                    <title>star-box-outline</title>
                    <path d="M15.58,17L12,14.84L8.42,17L9.37,12.93L6.21,10.2L10.38,9.84L12,6L13.62,9.83L17.79,10.19L14.63,12.92L15.58,17M19,3A2,2 0 0,1 21,5V19C21,20.11 20.1,21 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M5,5V19H19V5H5Z" />
                  </svg>
                  <p className="text-3xl text-[#EBEF0A]">100</p>
                </div>
                <div className="bg-[#D9D9D9] rounded-xl w-[250px] h-[10px]">
                  <div className="bg-[#E47615] rounded-xl w-80/100 h-[10px]"></div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </Body>  
    </>
  );
}

export default MenuScreen;