import React, { useEffect, useState } from "react";

import "../styles/App.css";
import Drop from "../components/Drop";
import Head from "../components/Head";

import { useAppDispatch } from "../features/hooks";
import { addHeadText } from "../features/slices/HeadSlice";
import { useAppSelector } from "../features/hooks";
import {
  getLastRacingGames,
  RootEventData,
} from "../features/slices/RacingGameSlice";
import moment from "moment";
import CircularUnderLoad from "../components/svg/Loader";
import { setIsLive } from "../features/slices/gameType";
interface prop {
  gameType: string;
}
function HorseRun({ gameType }: prop) {
  const texts = ["Main", "HEAD TO HEAD", "ALT", "SUM"];
  const dispatch = useAppDispatch();
  const [selectedText, setSelectedText] = useState("");
  const [activeIndexValue, setActiveindexVal] = useState(0);
  const [activeIndex, setActiveindex] = useState(0);
  const [ActiveGame, setIsActivegame] = useState(false);
  const [_D_interval, _D_setInterval] = useState(0);
  const [pastIndex, setpastIndex] = useState<number | null>(null);
  const [liveIndex, setLiveIndex] = useState(false);
  const handleClickMenu = (text: string) => {
    setSelectedText(text);
  };
  const gameData = useAppSelector((state) => state.racingGame);

  const handleActiveIndex = (val: number) => {
    const text = texts[val];
    setActiveindexVal(val);
    dispatch(addHeadText(text));
  };

  useEffect(() => {
    if (gameData && gameData.game) {
      let activeIndex: { index: number; millisecond: number }[] = [];
      for (let index in gameData.game) {
        if (
          moment(gameData.game[index].startTime).diff(moment(), "seconds") > 0
        ) {
          activeIndex.push({
            index: parseInt(index),
            millisecond: moment(gameData.game[index].startTime).diff(
              moment(),
              "milliseconds"
            ),
          });
        }
      }
      let sortedOne = activeIndex.sort((a, b) => {
        return a.millisecond < b.millisecond;
      });
      if (sortedOne.length > 0) {
        setActiveindex(sortedOne[0].index);

        _D_setInterval(sortedOne[0].millisecond);
        setpastIndex(sortedOne[0].index - 1);
        if (pastIndex) {
          dispatch(setIsLive(true));
        }
      } else {
        dispatch(
          getLastRacingGames("9c6d610d-33e9-4847-80ab-5e179833591e", gameType)
        );
      }
    }
  }, [gameData, _D_interval]);

  useEffect(() => {
    const __interval = () => {
      _D_setInterval(0);
    };
    let timer: NodeJS.Timeout | null = null;
    if (_D_interval !== 0) {
      setInterval(__interval, _D_interval * 1000);
    }
  }, [_D_interval]);
  return (
    <div className="App">
      <Head
        numberOfMenu={2}
        texts={texts}
        activeIndexprop={handleActiveIndex}
      />
      {gameData && gameData.loading ? (
        <div className="w-full h-fit mt-10 flex justify-center">
          <CircularUnderLoad />
        </div>
      ) : (
        gameData &&
        gameData.game &&
        gameData.game.map((game, index) => {
          const data: RootEventData = game.gameData;
          return (
            <>
              <Drop
                place={`${data.Race?.Name} ${data.Race?.Distance}`}
                id={data.Number + ""}
                time={game.startTime}
                activeIndexValues={activeIndexValue}
                gameData={game}
                data={data}
                isActiveGame={index === activeIndex}
                isPastGame={index === pastIndex}
                gameNumber={data.Number}
              />
            </>
          );
        })
      )}
      {}
    </div>
  );
}

export default HorseRun;
