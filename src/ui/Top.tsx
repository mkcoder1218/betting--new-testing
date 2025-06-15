import React from "react";

interface TopTextProp {
  text: string;
  onClick?: () => void;
  isActive: boolean;
  activeIndex?: number;
}

const Top: React.FC<TopTextProp> = ({ text, onClick, isActive }) => {
  return (
    <div
      className="TopHead"
      onClick={onClick}
      style={{
        backgroundColor: isActive ? "rgb(5, 217, 5) " : "transparent",
        color: isActive ? "white " : "",
      }}
    >
      <p>{text}</p>
    </div>
  );
};

export default Top;
