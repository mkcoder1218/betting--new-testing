import React, { useRef, useEffect } from "react";
import Firstminicontainer from "../components/innercontainers/firstminicontainer";
import Secondminicontainer from "../components/innercontainers/secondminicontainer";
import Thirdminicontainer from "../components/innercontainers/thirdminicontainer";
import Forthmini from "../components/innercontainers/forthmini";
import Fifthmini from "../components/innercontainers/fifthmini";
import Fourrowhover from "../components/svg/fourrowhover";

interface containerProp {
  gameid?: any;
}
function Container(prop: containerProp) {
  return (
    <div className="container">
      <Firstminicontainer gameId={prop.gameid} />
      <Secondminicontainer gameId={prop.gameid} />
      <Thirdminicontainer gameId={prop.gameid} />
      <Forthmini gameId={prop.gameid} />
      <Fifthmini gameId={prop.gameid} />
    </div>
  );
}

export default Container;
