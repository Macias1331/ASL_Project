import Header from "./mini/Header";
import Body from "./mini/Body";
import { useState } from "react";

type Friend = {
  id: number;
  name: string;
  color: string;
};

function FriendItem({ friend, index }: { friend: Friend; index: number }) {
  return (
    <div className="flex items-center gap-[16px] rounded-xl p-[8px] w-full" style={{ backgroundColor: friend.color }}>
      <div className="w-[60px] flex items-center gap-[10px]">
        <div className="bg-[rgba(0,0,0,0.15)] rounded-md h-[60px] w-[60px] flex items-center justify-center text-2xl font-bold text-[#523018]">
          {index + 1}
        </div>
      </div>
      <div className="h-[60px] w-[60px] bg-white rounded-sm" />
      <p className="text-white text-2xl font-bold">{friend.name}</p>
    </div>
  );
}

function Friends() {
  const [playerID, setPlayerID] = useState("");
  const [friends] = useState<Friend[]>([
    { id: 1, name: "NateClickbait", color: "#B9B8B8" },
    { id: 2, name: "Oyasumi", color: "#D6E9FF" },
    { id: 3, name: "ChocoChocobo", color: "#4E3B86" },
    { id: 4, name: "funman4", color: "#F09A9A" },
  ]);

  return (
    <>
      <Header />
      <Body tailwind="flex justify-center">
        <div className="w-full max-w-[1200px] flex gap-[30px]">
          <div className="bg-white rounded-2xl p-[24px] w-[420px]">
            <div className="flex justify-center">
              <div className="bg-[#F6D052] px-[30px] py-[10px] rounded-3xl text-2xl font-bold">Add friends</div>
            </div>
            <div className="mt-[40px] border border-transparent rounded-lg p-[16px]">
              <p className="text-[#3B9B3B] font-bold text-xl">Your ID #120482</p>
              <div className="mt-[14px] flex gap-[10px] items-center">
                <input
                  value={playerID}
                  onChange={(e) => setPlayerID(e.target.value)}
                  placeholder="Enter Player ID"
                  className="flex-1 border border-[#E2E2E2] rounded-xl p-[14px] text-xl"
                />
                <button className="w-[48px] h-[48px] rounded-xl bg-[#2D9F3C] text-white text-3xl flex items-center justify-center">+</button>
              </div>
              <div className="mt-[26px] flex justify-center">
                <button className="bg-[#3b5998] text-white px-[30px] py-[14px] rounded-2xl text-2xl flex items-center gap-[12px]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 fill-white">
                    <path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.48 2 2 6.48 2 12.07c0 4.93 3.6 8.99 8.28 9.78v-6.9H7.9V12h2.37V9.8c0-2.34 1.4-3.63 3.54-3.63 1.02 0 2.09.18 2.09.18v2.3h-1.18c-1.16 0-1.52.72-1.52 1.46V12h2.59l-.41 2.95h-2.18v6.9C18.4 21.06 22 16.99 22 12.07z" />
                  </svg>
                  <span>Connect</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-[16px] flex flex-col">
            <div className="flex items-center gap-[12px]">
              <div className="flex-1 p-[8px] rounded-tl-3xl rounded-bl-3xl rounded-tr-md rounded-br-md bg-[#FFEFB8] text-center text-2xl font-bold">Friends</div>
              <div className="bg-[#F6D052] p-[8px] rounded-tr-3xl rounded-br-3xl text-2xl font-bold w-[220px] text-center">Invite friends</div>
            </div>
            <div className="mt-[16px] p-[12px] bg-white rounded-xl overflow-y-scroll friends-scroll">
              <div className="flex flex-col gap-[10px]">
                {friends.map((f, i) => (
                  <FriendItem key={f.id} friend={f} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Body>
    </>
  );
}

export default Friends;