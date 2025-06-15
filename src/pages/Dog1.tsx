import React, { useState } from "react";

import "../styles/App.css";
import Drop from "../components/Drop";
import Head from "../components/Head";

import { addHeadText } from "../features/slices/HeadSlice";
function DogWithVideo() {
  const texts = ["Main", "HEAD TO HEAD"];
  const [selectedText, setSelectedText] = useState("");
  const [activeIndexValue, setActiveindexVal] = useState(0);

  const handleClickMenu = (text: string) => {
    setSelectedText(text);
    
  };
  const handleActiveIndex = (val: number) => {
    setActiveindexVal(val);
  };

  return (
    <div className="App">
      <Head
        numberOfMenu={2}
        texts={texts}

        activeIndexprop={handleActiveIndex}
      />
      <Drop
        place="SUMMERSET PARK 0"
        id="6000"
        time="00:00"
        activeIndexValues={activeIndexValue}
      />
    </div>
  );
}

export default DogWithVideo;
