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
};

export const characters: CharacterType[] = [
  {
    id: "cookie-crumbler",
    name: "Cookie Crumbler",
    image: cookieCrumbler,
  },
  {
    id: "jacc",
    name: "Jacc",
    image: jacc,
  },
  {
    id: "nitro",
    name: "Nitro",
    image: spooky,
  },
  {
    id: "sombra",
    name: "Sombra",
    image: sombra,
  },
  {
    id: "rambuplant",
    name: "Rambuplant",
    image: rambuplant,
  },
  {
    id: "trunk",
    name: "Trunk",
    image: trunk,
  },
];