import React from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

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
    <div
      className="plusminus"
      style={{ color: isActive || isPastGame ? "white" : "" }}
    >
      {isActive || isActiveGame ? (
        <RemoveIcon
          onClick={onClick}
          className="cursor-pointer "

        />
      ) : (
        <AddIcon onClick={onClick} className="cursor-pointer" />
      )}
    </div>
  );
};

export default PlusMinus;
