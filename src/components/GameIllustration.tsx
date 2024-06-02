// import { Bicycle, Garri } from "./svg/Bicycle";
import { useState } from "react";
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

export default function GameIllustration() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedGame, setSelected] = useState(0);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const toggleSelected = (item: number) => {
        setSelected(item);
        setIsOpen(false);
    };

    const dropdownItems = [
        { icon: <Football />, text1: 'FOOTBALL', text2: 'FOOTBALL', width: 'w-8' },
        { icon: <DashingDerby />, text1: 'DASHING DERBY', text2: 'DASHING DERBY', width: 'w-10' },
        { icon: <Jaguar />, text1: 'JAGUAR', text2: 'JAGUAR', width: 'w-16' },
        { icon: <SmartPlay />, text1: 'SMART PLAY', text2: 'SMART PLAY', width: 'w-8' },
        { icon: <CircleDraw />, text1: 'CIRCLE DRAW', text2: 'CIRCLE DRAW', width: 'w-8' },
        { icon: <LuckyLoot />, text1: 'LUCKY LOOT', text2: 'LUCKY LOOT', width: 'w-8' },
        { icon: <CarRacing />, text1: 'CAR RACING', text2: 'CAR RACING', width: 'w-14' },
        { icon: <Garri />, text1: 'GARRI', text2: 'GARRI', width: 'w-12' },
        { icon: <Bicycle />, text1: 'BICYCLE', text2: 'BICYCLE', width: 'w-12' },
        { icon: <HorseJump />, text1: 'HORSE JUMP', text2: 'HORSE JUMP', width: 'w-12' },
    ];

    return (
        <div className="flex justify-between">
            <div className="buttons basis-3/4 flex gap-4 items-center">
                <button className="text-gray-500 hover:text-green-500 w-8">
                    <DashingDerby />
                </button>
                <button className="text-gray-500 hover:text-green-500 w-5">
                    <Football />
                </button>
                <button className="text-gray-500 hover:text-green-500 w-8">
                    <Jaguar />
                </button>
                <button className="text-green-500 ml-4 hover:text-green-300 w-6">
                    <SmartPlay />
                </button>
                <button className="text-gray-500 hover:text-green-500 w-8">
                    <CircleDraw />
                </button>
                <button className="text-gray-500 hover:text-green-500 w-8">
                    <LuckyLoot />
                </button>
                <button className="text-gray-500 hover:text-green-500 w-12">
                    <CarRacing />
                </button>
                <button className="text-gray-500 hover:text-green-500 w-12">
                    <Garri />
                </button>
                <button className="text-gray-500 hover:text-green-500 w-10">
                    <Bicycle />
                </button>
                <button className="text-gray-500 hover:text-green-500 w-8">
                    <HorseJump />
                </button>
            </div>
            <div className="drop-down w-64 flex">
                <div className="w-full items-center relative inline-block text-left">
                    <div onClick={() => toggleDropdown()} className="flex items-center cursor-pointer">
                        <BsFillGrid3X3GapFill className="text-green-600" size={36} />
                        <div className="flex ml-2 items-center">
                            <button className={`text-green-500 hover:text-green-300 transition-all ${dropdownItems[selectedGame].width}`}>
                                {dropdownItems[selectedGame].icon}
                            </button>
                            <div className="text-gray-600 hover:text-green-300 transition-all  text-md ml-2">
                                {dropdownItems[selectedGame].text1}
                            </div>
                        </div>
                    </div>

                    {isOpen && <div className="absolute p-4 left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-y-auto h-48 z-10 custom-scrollbar">
                        <div className="py-1">
                            {dropdownItems.map((item, index) => (
                                <div onClick={() => toggleSelected(index)} key={index} className="flex items-center cursor-pointer hover:bg-gray-100 p-2">
                                    <div className="flex-shrink-0 flex items-center justify-center w-12">
                                        <button className="text-gray-500 hover:text-green-300">
                                            {item.icon}
                                        </button>
                                    </div>
                                    <div className="ml-2 text-green-600  hover:text-green-300 transition-all">
                                        <div className="font-bold text-sm">
                                            {item.text1}
                                        </div>
                                        <div className="font-bold text-xs">
                                            {item.text2}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>}

                </div>
                <div className="cursor-pointer">
                    <IoMdHelpCircle size={34} className="text-gray-400 hover:text-gray-600 transition-all" />
                </div>
            </div>
        </div>
    )
}