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
import DogVideo from "./svg/DogVideo";

interface gameSelection {
  WhichGame: (val: string) => boolean;
}

const GameIllustration: React.FC<gameSelection> = ({ WhichGame }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [isActive, setActive] = useState(() => {
    const activeIndex = localStorage.getItem("activeGameIndex");
    return activeIndex !== null ? JSON.parse(activeIndex) : 0;
  });
  // Define game options first so they're available for initialization
  const dropdownItems = [
    {
      icon: <SmartPlay />,
      icon2: <SmartPlay  />,
      text1: "SmartPlayKeno",
      text2: "KENO",
      text3: "KENO",
      width: "w-8",
    },
     
    

    {
      icon: <Hockey />,
      icon2: <Hockey  isSmall={true} isGreen={isActive===1?true:false}/>,
      text1: "SpeedSkating",
      text2: "SPEED SKATING",
      width: "w-8",
    },
   
    
    {
      icon: <Football/>,
      icon2: <Football />,
      text1: "ENGLISH LEAGUE",
      text2: "ENGLISH LEAGUE",
      text3: "SOCCERBET",
      width: "w-8",
    },
    {
      icon: <Jaguar />,
      icon2: <Jaguar isSmall={true} />,
      text1: "PlatinumHounds",
      text2: "CHARGING CHARIOTS",
      width: "w-8",
    },
    {
      icon: <Garri />,
      icon2: <Garri isSmall={true} />,
      text1: "HarnessRacing",
      text2: "CHARGING CHARIOTS",
      width: "w-8",
    },
    
    {
      icon: <DashingDerby />,
      icon2: <DashingDerby isSmall={true} />,
      text1: "DashingDerby",
      text2: "DASHING DERBY",
      width: "w-8",
    },

    {
      icon: <CarRacing />,
      icon2: <CarRacing isSmall={true} />,
      text1: "MotorRacing",
      text2: "MAXCAR",
      width: "w-8",
    },
    {
      icon: <F1 />,
      icon2: <F1 isSmall={true} />,
      text1: "SingleSeaterMotorRacing",
      text2: "SS motor Racing",
      text3: "Drive",
      width: "w-8",
    },
    {
      icon: <CircleDraw />,
      icon2: <CircleDraw />,
      text1: "SpinAndWin",
      text2: "SPIN AND WIN",
      width: "w-8",
    },
   
    {
      icon: <HorseJump />,
      icon2: <HorseJump isSmall={true} />,
      text1: "SteepleChase",
      text2: "JUMPS",
      text3: "JUMPS",
      width: "w-8",
    },
    
    // {
    //   icon: <DogVideo isGreen={isActive === 1} />,
    //   text1: "PreRecRealDogs",
    //   text2: "PLATINUM HOUNDS",
    //   text3: "greyHOund Racing",
    //   width: "w-8",
    // },
    {
      icon: <Bicycle />,
      icon2: <Bicycle isSmall={true} />,
      text1: "CycleRacing",
      text2: "SLIP STREAM",
      text3: "Track Racing",
      width: "w-8",
    }
  ];

  // Get initial active game index from localStorage or default to 0 (Keno)
  

  // Set selected game index based on active index
  const [selectedGame, setSelected] = useState(isActive);

  // Set selected game text based on active index
  const [selectedGametext, setSelectedGame] = useState(() => {
    // Get the game name from dropdownItems based on the active index
    return dropdownItems[isActive]?.text1 || "SmartPlayKeno";
  });

  const [isSelectedindex, setIndexSelected] = useState<number | null>(null);

  // Initialize the game on component mount
  useEffect(() => {
    // Set the selected game in game logic and Redux store
    WhichGame(selectedGametext);
    dispatch(addGameType(selectedGametext));
  }, []);

  // Save active game index to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activeGameIndex", JSON.stringify(isActive));
  }, [isActive]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickGame = (gameName: string, index: number) => {
    // Update the selected game name
    setSelectedGame(gameName);

    // Update the UI selection
    setSelected(index);
    setActive(index);

    // Update the game logic and Redux store
    WhichGame(gameName);
    dispatch(addGameType(gameName));
  };

  const toggleSelected = (item: number) => {
    setSelected(item);
    setIsOpen(false);
    setIndexSelected(item);
  };

  const handleClick = (index: number) => {
    // Handle any additional logic when a game is clicked
  };

  return (
    <div
      className="flex flex-col md:flex-row ml-1 md:ml-3 mb-4 pt-1 z-[9999] justify-between w-full"
    >
      <div className="buttons flex flex-wrap gap-1 sm:gap-2 items-center w-full md:w-[75%] overflow-x-auto pb-2 md:pb-0">
        {dropdownItems
          ? dropdownItems.map((item: any, index: number) => {
              return (
                <button
                  key={index}
                  className={`text-gray-500 hover:text-green-500 ${
                    isActive === index ? "text-green-600" : ""
                  }`}
                  onClick={() => {
                    handleClickGame(item.text1, index);
                    handleClick(index);
                  }}
                  disabled={item.text1 === "ENGLISH LEAGUE" ? true : false}
                >
                  {item.icon}
                </button>
              );
            })
          : ""}
      </div>
      <div className="drop-down w-full md:w-1/3 md:ml-5 !z-[9999] flex mt-2 md:mt-0">
        <div className="w-full items-center relative inline-block  text-left">
          <div className="flex items-center cursor-pointer ">
            <BsFillGrid3X3GapFill
              onClick={() => toggleDropdown()}
              className="text-green-600 "
              size={31}
            />
            <div
              className={`flex ml-2  ${
                selectedGame === 4 ? "gap-2" : selectedGame === 6 ? "gap-3" : ""
              } items-center`}
            >
              <button
                className={`text-green-500 hover:text-green-300 transition-all text-sm ${dropdownItems[selectedGame].width}`}
              >
                {dropdownItems[selectedGame].icon2}
              </button>
              <div className="flex flex-col">
                <div className="text-gray-400 hover:text-green-300 transition-all text-sm ">
                  {dropdownItems[selectedGame]?.text2?.toUpperCase() || ""}
                </div>
                <div className="text-gray-400 hover:text-green-300 transition-all text-sm ">
                  {dropdownItems[selectedGame]?.text3?.toUpperCase() || ""}
                </div>
              </div>
            </div>
          </div>

          {isOpen && (
            <div
              className="absolute p-4 left-0 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 text-xs overflow-y-auto overflow-x-hidden !max-h-[200px] custom-scrollbar"
              style={{ 
                boxShadow: "#3dd463 1px 1px 5px 1px", 
                zIndex: 9999,
                position: "absolute",
                top: "100%"
              }}
            >
              <div className="py-1 w-64">
                {dropdownItems.map((item, index) => (
                  <div
                    onClick={() => {
                      handleClickGame(item.text1, index);
                      toggleSelected(index);
                      handleClick(index);
                    }}
                    key={index}
                    className={`flex items-center -ml-5 pl-7 ${
                      isSelectedindex === index || selectedGame === index
                        ? "bg-green-500 w-full text-white"
                        : "hover:bg-gray-100"
                    }  cursor-pointer p-2`}
                  >
                    <div className="flex-shrink-0 flex items-center justify-center w-12">
                      <button
                        className={`text-gray-500 ${
                          isSelectedindex === index || selectedGame === index
                            ? " text-white"
                            : "hover:bg-gray-100"
                        } hover:text-green-300`}
                      >
                        {item.icon}
                      </button>
                    </div>
                    <div
                      className={`ml-2 mt-2  text-green-600 ${
                        isSelectedindex === index || isActive === index
                          ? " text-white"
                          : "hover:bg-gray-100"
                      } hover:text-green-300 transition-all`}
                    >
                      <div className="text-md">
                        {item.text2?.toUpperCase() || ""}
                      </div>
                      {item.text3?.toUpperCase() || ""}
                      {item.text1?.toUpperCase() || ""}
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
