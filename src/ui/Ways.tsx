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
      className="WaysContainer"
      onClick={onClick}
      style={{ visibility: isvisible && isvisible ? "visible" : "hidden" }}
    >
      <p style={{ textTransform: "uppercase" }}>{text}</p>
      <p>{text2}</p>
      <p>{text3}</p>
    </div>
  );
};

export default Ways;
