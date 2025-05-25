import React, { memo } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { TiMinus, TiPlus } from "react-icons/ti";

interface plusminusProp {
  isActiveGame?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  isPastGame?: boolean;
}

const PlusMinus: React.FC<plusminusProp> = ({
  isActive = true,
  onClick,
  isActiveGame,
  isPastGame,
}) => {
  return (
    <div className="plusminus">
      {isActive ? (
        <TiMinus
          onClick={onClick}
          className={`cursor-pointer !font-bold mr-2 ${isActiveGame ? "text-white" : "text-gray-500"}`}
        />
      ) : (
        <TiPlus
          onClick={onClick}
          className={`cursor-pointer mr-2 ${isActiveGame ? "text-white" : "text-gray-500"}`}
        />
      )}
    </div>
  );
};

// Custom comparison function to prevent unnecessary re-renders
export default memo(PlusMinus, (prevProps, nextProps) => {
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.isActiveGame === nextProps.isActiveGame &&
    prevProps.isPastGame === nextProps.isPastGame
    // Note: We intentionally don't compare onClick function references
    // as they may change but the component behavior remains the same
  );
});
