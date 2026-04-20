import cookieCrumbler from "../assets/character.png";
import jacc from "../assets/jacc.png";
import spooky from "../assets/nitro.png";
import sombra from "../assets/sombra.png";
import rambuplant from "../assets/rambuplant.png";
import trunk from "../assets/trunk.png";

export type CharacterType = {
  id: string;
  name: string;
  image: string;
  hatStyle: string;
};

export const characters: CharacterType[] = [
  {
    id: "cookie-crumbler",
    name: "Cookie Crumbler",
    image: cookieCrumbler,
    hatStyle: "absolute top-[-10%] left-[18%] w-[56%] object-contain pointer-events-none",
  },
  {
    id: "jacc",
    name: "Jacc",
    image: jacc,
    hatStyle: "absolute top-[5%] left-[30%] w-[40%] object-contain pointer-events-none",
  },
  {
    id: "nitro",
    name: "Nitro",
    image: spooky,
    hatStyle: "absolute top-[5%] left-[30%] w-[40%] object-contain pointer-events-none",
  },
  {
    id: "sombra",
    name: "Sombra",
    image: sombra,
    hatStyle: "absolute top-[5%] left-[39%] w-[20%] object-contain pointer-events-none",
  },
  {
    id: "rambuplant",
    name: "Rambuplant",
    image: rambuplant,
    hatStyle: "absolute top-[1%] left-[28%] w-[40%] object-contain pointer-events-none",
  },
  {
    id: "trunk",
    name: "Trunk",
    image: trunk,
    hatStyle: "absolute top-[0%] left-[25%] w-[45%] object-contain pointer-events-none",
  },
];