import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { characters } from "./characters";
import type { CharacterType } from "./characters";
import type { HatType } from "./hats.ts";

type CharacterContextType = {
  selectedCharacter: CharacterType;
  setSelectedCharacter: (character: CharacterType) => void;

  selectedHat: HatType | null;
  setSelectedHat: (hat: HatType | null) => void;
};

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType>(characters[0]);
  const [selectedHat, setSelectedHat] = useState<HatType | null>(null);

  return (
    <CharacterContext.Provider
      value={{
        selectedCharacter,
        setSelectedCharacter,
        selectedHat,
        setSelectedHat,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);

  if (!context) {
    throw new Error("useCharacter must be used inside CharacterProvider");
  }

  return context;
}