import React, { useState } from "react";
import Top from "../ui/Top";
interface HeadProp {
  numberOfMenu: number;
  texts: string[];
  onMenuClick?: () => void;
  activeIndexprop: (val: number) => void;
}
const Head: React.FC<HeadProp> = ({ numberOfMenu, texts, activeIndexprop }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleClick = (index: number, text: string) => {
    setActiveIndex(index);
    activeIndexprop(index);
  };
  return (
    <div className="topHead">
      {texts.map((text, index) => (
        <Top
          key={index}
          text={text || `Menu ${index + 1}`}
          onClick={() => {
            handleClick(index, text);
          }}
          isActive={activeIndex === index}
        />
      ))}
    </div>
  );
};

export default Head;
