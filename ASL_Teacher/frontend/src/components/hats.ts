import cowboyHat from "../assets/hatt.png";

export type HatType = {
  id: string;
  name: string;
  image: string;
};

export const hats: HatType[] = [
  {
    id: "cowboy-hat",
    name: "Cowboy Hat",
    image: cowboyHat,
  },
];