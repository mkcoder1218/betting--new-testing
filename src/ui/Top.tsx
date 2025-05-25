import React, { memo } from "react";

interface TopTextProp {
  text: string;
  onClick?: () => void;
  isActive: boolean;
  activeIndex?: number;
  isReadOnly?: boolean; // Add this prop to indicate if the text is read-only
}

const Top: React.FC<TopTextProp> = ({ text, onClick, isActive, isReadOnly = true }) => {
  return (
    <div
      className={`TopHead ${isReadOnly ? 'read-only' : ''}`}
      // Only add onClick handler if not read-only
      onClick={isReadOnly ? undefined : onClick}
      style={{
        backgroundColor: isActive ? "rgb(55, 179, 74) " : "transparent",
        color: isActive ? "white " : "",
        // Add visual indicators for read-only state
        opacity: isReadOnly ? 0.7 : 1,
        cursor: isReadOnly ? 'default' : 'pointer',
        pointerEvents: isReadOnly ? 'none' : 'auto',
      }}
    >
      <p>{text}</p>
    </div>
  );
};

export default memo(Top);
