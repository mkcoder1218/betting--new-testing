import React from "react";

interface IdandPlaceProp {
  Id: string;
  Place: string;
}
const IdandPlace: React.FC<IdandPlaceProp> = ({ Place, Id }) => {
  return (
    <div className="IdAndPlace">
      <p className="Place">{Place}</p>
      <p className="id">ID {Id}</p>
    </div>
  );
};

export default IdandPlace;
