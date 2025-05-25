import React, { useState, useCallback } from "react";

import "../styles/App.css";
import Drop from "../components/Drop";
import Head from "../components/Head";

import { addHeadText } from "../features/slices/HeadSlice";
import { useAppDispatch } from "../features/hooks";

function DogWithVideo() {
  const texts = ["Main", "HEAD TO HEAD"];
  const [selectedText, setSelectedText] = useState("");
  const [activeIndexValue, setActiveindexVal] = useState(0);
  const dispatch = useAppDispatch();

  // Track drop expansion state
  const [isDropExpanded, setIsDropExpanded] = useState(false);

  const handleClickMenu = useCallback((text: string) => {
    setSelectedText(text);
  }, []);

  const handleActiveIndex = useCallback((val: number) => {
    setActiveindexVal(val);
    const text = texts[val];
    dispatch(addHeadText(text));
  }, [dispatch, texts]);

  const handleDropToggle = useCallback((activated: boolean) => {
    setIsDropExpanded(activated);
  }, []);

  return (
    <div className="App">
      <Head
        numberOfMenu={2}
        texts={texts}
        activeIndexprop={handleActiveIndex}
        isReadOnly={true} // Make the text read-only
      />
      <Drop
        place="SUMMERSET PARK 0"
        id="6000"
        time="00:00"
        activeIndexValues={activeIndexValue}
        isActiveGame={false}
        WhichGameSelected=""
        isActiveClicked={handleDropToggle}
        isExpanded={isDropExpanded}
      />
    </div>
  );
}

export default DogWithVideo;
