import React from "react";
interface waysProp {
  text: string;
  text2: string;
  text3: string;
  onClick?: () => void;
  isvisible?: boolean;
}
const Ways: React.FC<waysProp> = ({
  text,
  text2,
  text3,
  onClick,
  isvisible,
}) => {
  return (
    <div
      className="h-full p-0 gap-0 wen"
      onClick={onClick}
      style={{
        visibility: isvisible && isvisible ? "hidden" : "hidden",
        width: "95%",
        pointerEvents: "none",
      }}
    >
      <div className="WaysContainer w-full flex-col items-center h-full pt-1">
        <p style={{ textTransform: "uppercase" }}>{text}</p>
        <p>{text2}</p>
        <p>{text3}</p>
      </div>
    </div>
  );
};

export default Ways;
