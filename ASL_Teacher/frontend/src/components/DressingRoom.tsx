import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Body from "./mini/Body";
import Header from "./mini/Header";
import Button from "./mini/Button";
import arrowLeft from "../assets/arrow-left.svg";
import { useCharacter } from "./characterContext";
import { characters } from "./characters";

function DressingRoom() {
  const navigate = useNavigate();
  const { selectedCharacter, setSelectedCharacter } = useCharacter();
  const [activeTab, setActiveTab] = useState<"characters" | "cosmetics">("characters");

  return (
    <>
      <Header />
      <Body tailwind="flex">
        <div className="flex-1 flex flex-col">
          <img
            src={selectedCharacter.image}
            alt={selectedCharacter.name}
            className="size-125 self-center mt-auto object-contain"
          />

          <h2 className="bg-white text-3xl px-[20px] self-center rounded-lg">
            {selectedCharacter.name}
          </h2>

          <div className="mt-auto">
            <Button
              imageOne={arrowLeft}
              altOne="back"
              onClick={() => navigate("/menu")}
            />
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg flex flex-col min-w-[700px] max-w-[700px]">
          <div className="flex-1 border-b border-[#554747] flex items-center pl-[20px] pr-[40px] pt-[10px] pb-[10px] gap-[20px]">
            <button className="flex-2 h-4/5 border rounded-xl text-3xl">
              Selecting
            </button>

            <button
              onClick={() => setActiveTab("characters")}
              className={`flex-1 h-full rounded-xl flex items-center justify-center text-white text-xl transition ${
                activeTab === "characters"
                  ? "bg-[#F6D052] text-black"
                  : "bg-[#4B5988]"
              }`}
            >
              Characters
            </button>

            <button
              onClick={() => setActiveTab("cosmetics")}
              className={`flex-1 h-full rounded-xl flex items-center justify-center text-white text-xl transition ${
                activeTab === "cosmetics"
                  ? "bg-[#F6D052] text-black"
                  : "bg-[#4B5988]"
              }`}
            >
              Cosmetics
            </button>
          </div>

          <div className="flex-7 grid grid-cols-2 gap-[20px] overflow-auto p-[20px]">
            {activeTab === "characters" &&
              characters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharacter(char)}
                  className={`rounded-xl flex items-center justify-center ${
                    selectedCharacter.id === char.id
                      ? "bg-[#F6D052] border-4 border-white"
                      : "bg-black border-4 border-transparent"
                  }`}
                >
                  <img
                    src={char.image}
                    alt={char.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </button>
              ))}

            {activeTab === "cosmetics" && (
              <>
                <div className="bg-black rounded-xl"></div>
                <div className="bg-black rounded-xl"></div>
                <div className="bg-black rounded-xl"></div>
                <div className="bg-black rounded-xl"></div>
              </>
            )}
          </div>
        </div>
      </Body>
    </>
  );
}

export default DressingRoom;