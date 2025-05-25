import React, { useState, useCallback, memo } from "react";
import Top from "../ui/Top";
interface HeadProp {
  numberOfMenu: number;
  texts: string[];
  onMenuClick?: () => void;
  activeIndexprop: (val: number) => void;
  isReadOnly?: boolean; // Add this prop to indicate if the text is read-only
}
const Head: React.FC<HeadProp> = ({ texts, activeIndexprop, isReadOnly = true }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Memoize the click handler to prevent unnecessary re-renders
  const handleClick = useCallback((index: number) => {
    // Only update if not read-only
    if (!isReadOnly) {
      setActiveIndex(index);
      activeIndexprop(index);
    }
  }, [isReadOnly, activeIndexprop]);

  return (
    <div className="topHead">
      {texts.map((text, index) => {
        // Create a stable click handler for this specific tab
        const onClick = isReadOnly ? undefined : () => handleClick(index);

        return (
          <Top
            key={`${text}-${index}`} // More stable key
            text={text || `Menu ${index + 1}`}
            onClick={onClick}
            isActive={activeIndex === index}
            isReadOnly={isReadOnly} // Pass the isReadOnly prop to the Top component
          />
        );
      })}
    </div>
  );
};

export default memo(Head);
