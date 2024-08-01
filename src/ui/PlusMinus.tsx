import React from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface plusminusProp {
  isActive: boolean;
  onClick?: () => void;
}
const PlusMinus: React.FC<plusminusProp> = ({ isActive, onClick }) => {
  return (
    <div className="plusminus" style={{ color: isActive ? "white" : "" }}>
      {isActive ? (
        <RemoveIcon onClick={onClick} />
      ) : (
        <AddIcon onClick={onClick} />
      )}
    </div>
  );
};

export default PlusMinus;
