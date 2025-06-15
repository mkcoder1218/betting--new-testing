import React, { useState } from "react";

import "../styles/App.css";
import Drop from "../components/Drop";
import Head from "../components/Head";

import { useAppDispatch } from "../features/hooks";
import { addHeadText } from "../features/slices/HeadSlice";
function Bike() {
  const texts = ["Main", "HEAD TO HEAD", "ALT", "SUM"];
  const [selectedText, setSelectedText] = useState("");
  const dispatch = useAppDispatch();
  const [activeIndexValue, setActiveindexVal] = useState(0);
  const handleActiveIndex = (val: number) => {
    const text = texts[val];
    setActiveindexVal(val);
    dispatch(addHeadText(text));
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

export default Bike;
