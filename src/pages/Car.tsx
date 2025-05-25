import React, { useState, useCallback } from "react";

import "../styles/App.css";
import Drop from "../components/Drop";
import Head from "../components/Head";
import { useAppDispatch } from "../features/hooks";
import { addHeadText } from "../features/slices/HeadSlice";

function Car() {
  const texts = ["Main", "HEAD TO HEAD", "ALT", "SUM"];
  const [selectedText, setSelectedText] = useState("");
  const dispatch = useAppDispatch();
  const [activeIndexValue, setActiveindexVal] = useState(0);

  // Track drop expansion state
  const [isDropExpanded, setIsDropExpanded] = useState(false);

  const handleActiveIndex = useCallback((val: number) => {
    const text = texts[val];
    setActiveindexVal(val);
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
        Headtext={selectedText}
        isActiveGame={false}
        WhichGameSelected=""
        isActiveClicked={handleDropToggle}
        isExpanded={isDropExpanded}
      />
    </div>
  );
}

export default Car;
