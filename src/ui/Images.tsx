import React, { memo } from "react";

interface Image {
  src: string;
  isHeadtoHead?: boolean;
  className?: string;
}
function Images(Prop: Image) {

  return (
    <img
      className={`${!Prop.isHeadtoHead ? "pr-5" : "h-8"} ${Prop.className || ""}`}
      src={Prop.src}
      style={{ width: !Prop.isHeadtoHead ? "38%" : "100%" }}
    />
  );
}

export default memo(Images);
