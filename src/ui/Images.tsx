import React from "react";

interface Image {
  src: string;
}
function Images(Prop: Image) {
  return <img className="pr-14" src={Prop.src} style={{ width: "90%" }} />;
}

export default Images;
