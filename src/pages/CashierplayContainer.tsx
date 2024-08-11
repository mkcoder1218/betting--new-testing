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
}
function Container(prop: containerProp) {
  return (
    <div className="container">
      <Firstminicontainer
        gameId={prop.gameid}
        gameNumber={prop.gameNumber[0]}
      />
      <Secondminicontainer
        gameId={prop.gameid}
        gameNumber={prop.gameNumber[0]}
      />
      <Thirdminicontainer
        gameId={prop.gameid}
        gameNumber={prop.gameNumber[0]}
      />
      <Forthmini gameId={prop.gameid} gameNumber={prop.gameNumber[0]} />
      <Fifthmini gameId={prop.gameid} gameNumber={prop.gameNumber[0]} />
    </div>
  );
}

export default Container;
