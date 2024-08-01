import React from "react";

interface IdandPlaceProp {
  Id: string;
  Place: string;
  isActive?: boolean;
}
const IdandPlace: React.FC<IdandPlaceProp> = ({ Place, Id, isActive }) => {
  return (
    <div className="IdAndPlace flex flex-col">
      <p className="Place" style={{ color: isActive ? "white" : "" }}>
        {Place}
      </p>
      <p className="id -mt-1" style={{ color: isActive ? "white" : "" }}>
        ID {Id}
      </p>
    </div>
  );
};

export default IdandPlace;
