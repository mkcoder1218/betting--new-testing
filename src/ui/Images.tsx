import React from "react";

interface Image {
  src: string;
  isHeadtoHead?: boolean;
}
function Images(Prop: Image) {

  return (
    <img
      className={`${!Prop.isHeadtoHead ? "pr-14" : "h-8"}`}
      src={Prop.src}
      style={{ width: !Prop.isHeadtoHead ? "32%" : "100%" }}
    />
  );
}

export default Images;
