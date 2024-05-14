import { CarRacing } from "./svg/CarRacing";
import { CircleDraw } from "./svg/CircleDraw";
import { DashingDerby } from "./svg/DashingDerby";
import { Football } from "./svg/FootBall";
import { Jaguar } from "./svg/Jaguar";
import { LuckyLoot } from "./svg/LuckLoot";
import { SmartPlay } from "./svg/SmartPlay";


export default function GameIllustration() {
    return (
        <div className="buttons flex gap-4">
            <button className="text-amber-700 hover:text-amber-600 w-8">
                <DashingDerby />
            </button>
            <button className="text-amber-700 hover:text-amber-600 w-8">
                <Football />
            </button>
            <button className="text-amber-700 hover:text-amber-600 w-8">
                <Jaguar />
            </button>
            <button className="text-amber-600 ml-4 hover:text-amber-600 w-8">
                <SmartPlay />
            </button>
            <button className="text-amber-700 hover:text-amber-600 w-8">
                <CircleDraw />
            </button>
            <button className="text-amber-700 hover:text-amber-600 w-8">
                <LuckyLoot />
            </button>
            <button className="text-amber-700 hover:text-amber-600 w-8">
                <CarRacing />
            </button>
        </div>
    )
}