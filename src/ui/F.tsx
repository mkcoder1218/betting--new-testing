import React, { memo } from "react";

interface favorite {
  favoritenumber: number;
}
function F(prop: favorite) {
  return <div className="F">F{prop.favoritenumber}</div>;
}

export default memo(F);
