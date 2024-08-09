import React from "react";
import Container from "../pages/CashierplayContainer";
import "../styles/spin.css";
import Timer from "../pages/timer";
import { useAppSelector } from "../features/hooks";
import { useState } from "react";
import { RootEventData } from "../features/slices/RacingGameSlice";
import CircularUnderLoad from "../components/svg/Loader";
function Spin() {
  const [gameid, setgameId] = useState<RootEventData | null>(null);
  const gamedata = useAppSelector((state) => state.racingGame);

  return (
    <div className="App">
      <div className="parent-container">
        <Timer />

        {gamedata && gamedata.loading ? (
          <div className="w-full h-fit mt-10 flex justify-center">
            <CircularUnderLoad />
          </div>
        ) : (
          gamedata.game &&
          gamedata.game.length > 0 && <Container gameid={gamedata.game[0].id} />
        )}
      </div>
    </div>
  );
}

export default Spin;
