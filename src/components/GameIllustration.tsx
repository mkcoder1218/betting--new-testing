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

import { addGameType } from "../features/slices/gameType";
import Hockey from "./svg/Hockey";

interface gameSelection {
  WhichGame: (val: string) => boolean;
}
const GameIllustration: React.FC<gameSelection> = ({ WhichGame }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGame, setSelected] = useState(0);
  const [selectedGametext, setSelectedGame] = useState("");
  const [isActive, setActive] = useState(0);
  const dispatch = useAppDispatch();
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickGame = (gameName: string, index: number) => {
    setSelectedGame(gameName);
    WhichGame(gameName);
    dispatch(addGameType(gameName));
    setSelected(index);
  };

  const toggleSelected = (item: number) => {
    setSelected(item);
    setIsOpen(false);
  };

  const dropdownItems = [
    { icon: <SmartPlay />, text1: "SmartPlayKeno", text2: "", width: "w-8" },
    {
      icon: <DogWithVideo />,
      text1: "PreRecRealDogs",
      text2: "PLATINUM HOUNDS",

      width: "w-12",
    },
    {
      icon: <Bicycle />,
      text1: "CycleRacing",
      text2: "SLIP STREAM",
      width: "w-12",
    },
    {
      icon: <HorseJump />,
      text1: "SteepleChase",
      text2: "JUMPS",
      width: "w-12",
    },
    { icon: <CircleDraw />, text1: "SpinAndWin", text2: "", width: "w-1" },
    { icon: <Hockey />, text1: "SpeedSkating", text2: "", width: "w-8" },
    { icon: <F1 />, text1: "SingleSeaterMotorRacing", text2: "", width: "w-8" },
    {
      icon: <CarRacing />,
      text1: "MotorRacing",
      text2: "MAXCAR",
      width: "w-14",
    },
    {
      icon: <DashingDerby />,
      text1: "DashingDerby",
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
      text1: "PlatinumHounds",
      text2: "CHARGING CHARIOTS",
      width: "w-12",
    },
  ];
  const handleClick = (index: number) => {
    setActive(index);
  };
  return (
    <div
      className="flex ml-3 mb-4 pt-1 justify-between"
      style={{ width: "100%" }}
    >
      <div className="buttons flex gap-2 items-center" style={{ width: "75%" }}>
        {dropdownItems
          ? dropdownItems.map((item: any, index: number) => {
              return (
                <button
                  className={`text-gray-500 hover:text-green-500 ${
                    isActive === index ? "text-green-600" : ""
                  }`}
                  onClick={() => {
                    handleClickGame(item.text1, index);
                    handleClick(index);
                  }}
                >
                  {item.icon}
                </button>
              );
            })
          : ""}
      </div>
      <div className="drop-down w-1/2 ml-5 flex ">
        <div className="w-full items-center relative inline-block text-left">
          <div className="flex items-center cursor-pointer">
            <BsFillGrid3X3GapFill
              onClick={() => toggleDropdown()}
              className="text-green-600"
              size={36}
            />
            <div
              className={`flex ml-2 ${
                selectedGame === 4 ? "gap-4" : ""
              } items-center`}
            >
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
            <div className="absolute p-4 left-0 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-y-auto h-48 z-10 custom-scrollbar">
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
        <div className="cursor-pointer -ml-14">
          <IoMdHelpCircle
            size={31}
            className="text-gray-600 hover:text-gray-600 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default GameIllustration;
