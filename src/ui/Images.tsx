import React from "react";

interface Image {
  src: string;
}
function Images(Prop: Image) {
  return (
    <img
      src={Prop.src}
      style={{
        height: "50px",
        width: "50px",
      }}
      width={50}
    />
  );
}

export default Images;
