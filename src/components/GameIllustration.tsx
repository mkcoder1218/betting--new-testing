// import { Bicycle, Garri } from "./svg/Bicycle";
import React, { useEffect, useState } from "react";
import { Bicycle } from "./svg/Bicycle";
import { CarRacing } from "./svg/CarRacing";
import { CircleDraw } from "./svg/CircleDraw";
import { DashingDerby } from "./svg/DashingDerby";
import { Football } from "./svg/FootBall";
import { Garri } from "./svg/Garri";
import { HorseJump } from "./svg/HorseJump";
import { Jaguar } from "./svg/Jaguar";
import { LuckyLoot } from "./svg/LuckLoot";
import { SmartPlay } from "./svg/SmartPlay";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { IoMdHelpCircle } from "react-icons/io";
import { DogWithVideo } from "./svg/DogWithVideo";
import { HorseWithSpin } from "./svg/HorseWithSpin";
import { F1 } from "./svg/F1";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { addGameType } from "../features/slices/betSlip";
import Hockey from "./svg/Hockey";

interface gameSelection {
  WhichGame: (val: string) => boolean;
}
const GameIllustration: React.FC<gameSelection> = ({ WhichGame }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGame, setSelected] = useState(3);
  const [selectedGametext, setSelectedGame] = useState("");
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickGame = (gameName: string) => {
    setSelectedGame(gameName);
    WhichGame(gameName);

    console.log("gameNameofg:", gameName);
  };

  const toggleSelected = (item: number) => {
    setSelected(item);
    setIsOpen(false);
  };

  const dropdownItems = [
    { icon: <SmartPlay />, text1: "KENO", text2: "", width: "w-8" },
    {
      icon: <DogWithVideo />,
      text1: "PreRecRealDogs",
      text2: "PLATINUM HOUNDS",

      width: "w-12",
    },
    {
      icon: <Bicycle />,
      text1: "SingleSeaterMotorRacing",
      text2: "SLIP STREAM",
      width: "w-12",
    },
    {
      icon: <HorseJump />,
      text1: "SteepleChase",
      text2: "JUMPS",
      width: "w-12",
    },
    { icon: <CircleDraw />, text1: "SPIN AND WIN", text2: "", width: "w-8" },
    { icon: <Hockey />, text1: "Hockey", text2: "", width: "w-8" },
    { icon: <F1 />, text1: "F1", text2: "", width: "w-8" },
    {
      icon: <CarRacing />,
      text1: "MOTOR RACING",
      text2: "MAXCAR",
      width: "w-14",
    },
    {
      icon: <DashingDerby />,
      text1: "HORSE RACING",
      text2: "DASHING DERBY",
      width: "w-10",
    },

    {
      icon: <Garri />,
      text1: "HarnessRacing",
      text2: "CHARGING CHARIOTS",
      width: "w-12",
    },
    {
      icon: <Jaguar />,
      text1: "Jaguar",
      text2: "CHARGING CHARIOTS",
      width: "w-12",
    },
  ];

  return (
    <div className="flex justify-between" style={{ width: "100%" }}>
      <div className="buttons flex gap-2 items-center" style={{ width: "70%" }}>
        {dropdownItems
          ? dropdownItems.map((item: any, index: number) => {
              return (
                <button
                  className="text-gray-500 hover:text-green-500 "
                  onClick={() => handleClickGame(item.text1)}
                >
                  {item.icon}
                </button>
              );
            })
          : ""}
      </div>
      <div className="drop-down w-56 flex">
        <div className="w-full items-center relative inline-block text-left">
          <div className="flex items-center cursor-pointer">
            <BsFillGrid3X3GapFill
              onClick={() => toggleDropdown()}
              className="text-green-600"
              size={36}
            />
            <div className="flex ml-2 items-center">
              <button
                className={`text-green-500 hover:text-green-300 transition-all ${dropdownItems[selectedGame].width}`}
              >
                {dropdownItems[selectedGame].icon}
              </button>
              <div className="text-gray-600 hover:text-green-300 transition-all  text-md ml-2">
                {dropdownItems[selectedGame].text1}
              </div>
            </div>
          </div>

          {isOpen && (
            <div className="absolute p-4 left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-y-auto h-48 z-10 custom-scrollbar">
              <div className="py-1">
                {dropdownItems.map((item, index) => (
                  <div
                    onClick={() => toggleSelected(index)}
                    key={index}
                    className="flex items-center cursor-pointer hover:bg-gray-100 p-2"
                  >
                    <div className="flex-shrink-0 flex items-center justify-center w-12">
                      <button className="text-gray-500 hover:text-green-300">
                        {item.icon}
                      </button>
                    </div>
                    <div className="ml-2 text-green-600  hover:text-green-300 transition-all">
                      <div className="text-sm">{item.text1}</div>
                      <div className="text-xs">{item.text2}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="cursor-pointer">
          <IoMdHelpCircle
            size={34}
            className="text-gray-400 hover:text-gray-600 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default GameIllustration;
