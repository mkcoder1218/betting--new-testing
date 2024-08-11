import React from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface plusminusProp {
  isActiveGame?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}
const PlusMinus: React.FC<plusminusProp> = ({
  isActive = true,
  onClick,
  isActiveGame,
}) => {
  return (
    <div className="plusminus" style={{ color: isActive ? "white" : "" }}>
      {isActive || isActiveGame ? (
        <RemoveIcon onClick={onClick} />
      ) : (
        <AddIcon onClick={onClick} />
      )}
    </div>
  );
};

export default PlusMinus;
