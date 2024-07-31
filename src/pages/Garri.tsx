import React, { useEffect, useState } from "react";

import "../styles/App.css";
import Drop from "../components/Drop";
import Head from "../components/Head";

import { useAppDispatch } from "../features/hooks";
import { addHeadText } from "../features/slices/HeadSlice";
import { useAppSelector } from "../features/hooks";
function Gari() {
  const texts = ["Main", "HEAD TO HEAD", "ALT", "SUM"];
  const [selectedText, setSelectedText] = useState("");
    const dispatch = useAppDispatch();
  const [activeIndexValue, setActiveindexVal] = useState(0);
  const handleActiveIndex = (val: number) => {
   const text = texts[val];
   setActiveindexVal(val);
   dispatch(addHeadText(text));
 };
  const gameData = useAppSelector((state) => state.racingGame);

  const handleClickMenu = (text: string) => {
    setSelectedText(text);
  };

  useEffect(() => {}, []);
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
          return (
            <>
              <Drop
                place="SUMMERSEx PARK 0"
                id="6000"
                time="00:00"
                activeIndexValues={activeIndexValue}
              />
              <Drop
                place="SUMMERSEx PARK 0"
                id="6000"
                time="00:00"
                activeIndexValues={activeIndexValue}
              />
            </>
          );
        })}
    </div>
  );
}

export default Gari;
