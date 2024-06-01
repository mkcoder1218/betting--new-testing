// import { Bicycle, Garri } from "./svg/Bicycle";
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


export default function GameIllustration() {
    return (
        <div className="buttons flex gap-4">
            <button className="text-green-500 hover:text-green-500 w-8">
                <DashingDerby />
            </button>
            <button className="text-green-500 hover:text-green-500 w-8">
                <Football />
            </button>
            <button className="text-green-500 hover:text-green-500 w-8">
                <Jaguar />
            </button>
            <button className="text-green-500 ml-4 hover:text-green-500 w-8">
                <SmartPlay />
            </button>
            <button className="text-green-500 hover:text-green-500 w-8">
                <CircleDraw />
            </button>
            <button className="text-green-500 hover:text-green-500 w-8">
                <LuckyLoot />
            </button>
            <button className="text-green-500 hover:text-green-500 w-8">
                <CarRacing />
            </button>
            <button className="text-green-500 hover:text-green-500 w-8">
                <Garri />
            </button>
            <button className="text-green-500 hover:text-green-500 w-8">
                <Bicycle />
            </button>
            <button className="text-green-500 hover:text-green-500 w-8">
                <HorseJump />
            </button>
        </div>
    )
}