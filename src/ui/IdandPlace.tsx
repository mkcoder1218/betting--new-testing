import React from "react";

interface IdandPlaceProp {
  Id: string;
  Place: string;
  isActive?: boolean;
  isPastGame?: boolean;
}
const IdandPlace: React.FC<IdandPlaceProp> = ({
  Place,
  Id,
  isActive,
  isPastGame,
}) => {
  return (
    <div className="IdAndPlace flex flex-col">
      <p
        className="Place"
        style={{ color: isActive || isPastGame ? "white" : "" }}
      >
        {Place}
      </p>
      <p
        className="id -mt-1"
        style={{ color: isActive || isPastGame ? "white" : "" }}
      >
        ID {Id}
      </p>
    </div>
  );
};

export default IdandPlace;
