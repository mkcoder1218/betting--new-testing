import React from "react";

interface Image {
  src: string;
  isHeadtoHead?: boolean;
}
function ImagesResult(Prop: Image) {
  return (
    <img
      className={`${!Prop.isHeadtoHead ? "pr-14" : "h-full"}`}
      src={Prop.src}
      style={{ width: !Prop.isHeadtoHead ? "35%" : "100%" }}
    />
  );
}

export default ImagesResult;
