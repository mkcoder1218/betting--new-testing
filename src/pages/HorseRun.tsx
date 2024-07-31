import React, { useEffect, useState } from "react";
import "../styles/App.css";
import Drop from "../components/Drop";
import Head from "../components/Head";
import { useAppDispatch } from "../features/hooks";
import { addHeadText } from "../features/slices/HeadSlice";
import { useAppSelector } from "../features/hooks";
import { RootEventData } from "../features/slices/RacingGameSlice";
import moment from "moment";
function HorseRun() {
  const texts = ["Main", "HEAD TO HEAD", "ALT", "SUM"];
  const dispatch = useAppDispatch();
  const [ setSelectedText] = useState("");
  const [activeIndexValue, setActiveindexVal] = useState(0);
  const [activeIndex, setActiveindex] = useState(0);
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
              "seconds"
            ),
          });
        }
      }
      let sortedOne = activeIndex.sort((a, b) => {
        return a.millisecond < b.millisecond;
      });
      setActiveindex(sortedOne[0].index);
    }
  }, [gameData]);
  return (
    <div className="App">
      <Head
        numberOfMenu={2}
        texts={texts}
        activeIndexprop={handleActiveIndex}
      />
      {gameData &&
        gameData.game &&
        gameData.game.map((game, index) => {
          const data: RootEventData = JSON.parse(game.gameData);

          return (
            <>
              <Drop
                place={`${data.Race.Name} ${data.Race.Distance}`}
                id={data.Number + ""}
                time={game.startTime}
                activeIndexValues={activeIndexValue}
                gameData={game}
                data={data}
                isActiveGame={index === activeIndex}
              />
            </>
          );
        })}
    </div>
  );
}

export default HorseRun;
