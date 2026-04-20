import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Body from "./mini/Body";
import Header from "./mini/Header";
import Button from "./mini/Button";
import arrowLeft from "../assets/arrow-left.svg";
import { useCharacter } from "./characterContext";
import { characters } from "./characters";
import { hats } from "./hats";

function DressingRoom() {
  const navigate = useNavigate();
  const {
    selectedCharacter,
    setSelectedCharacter,
    selectedHat,
    setSelectedHat,
  } = useCharacter();

  const [activeTab, setActiveTab] = useState<"characters" | "cosmetics">("characters");

  return (
    <>
      <Header />
      <Body tailwind="flex">
        <div className="flex-1 flex flex-col">
          <div className="relative size-125 self-center mt-auto">
            <img
              src={selectedCharacter.image}
              alt={selectedCharacter.name}
              className="w-full h-full object-contain"
            />

            {selectedHat && (
              <img
                src={selectedHat.image}
                alt={selectedHat.name}
                className={selectedCharacter.hatStyle}
              />
            )}
          </div>

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
              className={`flex-1 h-full rounded-xl flex items-center justify-center text-xl transition ${
                activeTab === "characters"
                  ? "bg-[#F6D052] text-black"
                  : "bg-[#4B5988] text-white"
              }`}
            >
              Characters
            </button>

            <button
              onClick={() => setActiveTab("cosmetics")}
              className={`flex-1 h-full rounded-xl flex items-center justify-center text-xl transition ${
                activeTab === "cosmetics"
                  ? "bg-[#F6D052] text-black"
                  : "bg-[#4B5988] text-white"
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
                <button
                  onClick={() => setSelectedHat(null)}
                  className={`rounded-xl flex items-center justify-center text-xl font-bold ${
                    selectedHat === null
                      ? "bg-[#F6D052] border-4 border-white text-black"
                      : "bg-black border-4 border-transparent text-white"
                  }`}
                >
                  No Hat
                </button>

                {hats.map((hat) => (
                  <button
                    key={hat.id}
                    onClick={() => setSelectedHat(hat)}
                    className={`rounded-xl flex items-center justify-center ${
                      selectedHat?.id === hat.id
                        ? "bg-[#F6D052] border-4 border-white"
                        : "bg-black border-4 border-transparent"
                    }`}
                  >
                    <img
                      src={hat.image}
                      alt={hat.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </Body>
    </>
  );
}

export default DressingRoom;