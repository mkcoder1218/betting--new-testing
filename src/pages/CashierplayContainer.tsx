import React, { useRef, useEffect } from "react";
import Firstminicontainer from "../components/innercontainers/firstminicontainer";
import Secondminicontainer from "../components/innercontainers/secondminicontainer";
import Thirdminicontainer from "../components/innercontainers/thirdminicontainer";
import Forthmini from "../components/innercontainers/forthmini";
import Fifthmini from "../components/innercontainers/fifthmini";
import Fourrowhover from "../components/svg/fourrowhover";

interface containerProp {
  gameid?: any;
  gameNumber?: any;
  gameStartTime?: any;
  gameidofback?:string
}
function Container(prop: containerProp) {
  return (
    <div className="container">
      <Firstminicontainer
        gameId={prop.gameid}
        gameNumber={prop.gameNumber[0]}
        gameStartTime={prop.gameStartTime}
        gameIdofBack={prop.gameidofback}
      />
      <Secondminicontainer
        gameId={prop.gameid}
        gameNumber={prop.gameNumber[0]}
        gameStartTime={prop.gameStartTime}
        gameIdofBack={prop.gameidofback}
      />
      <Thirdminicontainer
        gameId={prop.gameid}
        gameNumber={prop.gameNumber[0]}
        gameStartTime={prop.gameStartTime}
        gameIdofBack={prop.gameidofback}
      />
      <Forthmini
        gameId={prop.gameid}
        gameNumber={prop.gameNumber[0]}
        gameStartTime={prop.gameStartTime}
        gameIdofBack={prop.gameidofback}
      />
      <Fifthmini
        gameId={prop.gameid}
        gameStartTime={prop.gameStartTime}
        gameNumber={prop.gameNumber[0]}
        gameIdofBack={prop.gameidofback}
      />
    </div>
  );
}

export default Container;
