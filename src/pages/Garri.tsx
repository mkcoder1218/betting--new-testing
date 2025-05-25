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

  // Track which drops are expanded
  const [expandedDrops, setExpandedDrops] = useState<Set<string>>(new Set());

  const handleActiveIndex = (val: number) => {
    const text = texts[val];
    setActiveindexVal(val);
    dispatch(addHeadText(text));
  };

  const gameData = useAppSelector((state) => state.racingGame);

  const handleClickMenu = (text: string) => {
    setSelectedText(text);
  };

  // Handle drop expansion/collapse
  const handleDropToggle = (dropId: string, isActive: boolean) => {
    const newExpandedDrops = new Set(expandedDrops);
    if (isActive) {
      newExpandedDrops.add(dropId);
    } else {
      newExpandedDrops.delete(dropId);
    }
    setExpandedDrops(newExpandedDrops);
  };

  return (
    <div className="App">
      <Head
        numberOfMenu={2}
        texts={texts}
        activeIndexprop={handleActiveIndex}
        isReadOnly={true} // Make the text read-only
      />
      {gameData &&
        gameData.game &&
        gameData.game.map((game, index) => {
          // Create unique IDs for each drop
          const dropId1 = `drop-${index}-1`;
          const dropId2 = `drop-${index}-2`;

          return (
            <React.Fragment key={index}>
              <Drop
                place="SUMMERSEx PARK 0"
                id={dropId1}
                time="00:00"
                activeIndexValues={activeIndexValue}
                isActiveGame={false}
                WhichGameSelected=""
                isActiveClicked={(activated) => handleDropToggle(dropId1, activated)}
                isExpanded={expandedDrops.has(dropId1)}
              />
              <Drop
                place="SUMMERSEx PARK 0"
                id={dropId2}
                time="00:00"
                activeIndexValues={activeIndexValue}
                isActiveGame={false}
                WhichGameSelected=""
                isActiveClicked={(activated) => handleDropToggle(dropId2, activated)}
                isExpanded={expandedDrops.has(dropId2)}
              />
            </React.Fragment>
          );
        })}
    </div>
  );
}

export default Gari;
