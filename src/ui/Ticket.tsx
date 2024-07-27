import React from "react";
import { SvgIconComponent } from "@mui/icons-material";
import FormStatus from "./FormStatus";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { BsCheck2All } from "react-icons/bs";
interface ticketProp {
  Icon: React.ComponentType;
  isSmall?: boolean;
}
const Ticket: React.FC<ticketProp> = ({ Icon, isSmall }) => {
  return (
    <div className="bg-gray-400 w-3/4 h-28 rounded">
      <div className="text-white text-sm flex p-1" style={{ fontSize: "10px" }}>
        <div className="mt-1">
          <Icon isSmall={isSmall} />
        </div>
        <div className="flex-col">
          <div className="flex justify-between">
            <p>Place</p>
            <FaPlus className="-mr-20 text-lg rotate-45 w-4" />
          </div>
          <div className="flex gap-2">
            <p className="-mt-2">Namldcsacde</p>
            <p
              className="-mt-2 text-center flex justify-center h-4 w-10 bg-red-700 rounded-lg"
              style={{ fontSize: "10px" }}
            >
              1.5
            </p>
          </div>
          <div className="-mt-1 gap-1 flex">
            <p>2024/13/13</p>
            <p>12:12:12</p>
            <p>ID3030</p>
          </div>
          <div className="flex gap-2 -mt-2">
            <p className="">Namldcsacde</p>
            <p
              className=" w-10 text-center bg-red-700 h-4 rounded-lg"
              style={{ fontSize: "10px" }}
            >
              1.5
            </p>
            <p className="">Namldcsacde</p>
            <p
              className="w-10 h-4 text-center bg-red-700 rounded-lg"
              style={{ fontSize: "10px" }}
            >
              1.5
            </p>
          </div>
          <div className="flex items-center justify-center w-fit">
            <FaPlus className="bg-gray-200 text-gray-600 text-lg h-1/2 p-1 w-1/2 rounded-l-md" />
            <input
              type="text"
              className="text-black flex justify-end outline-none flex-grow text-right font-normal"
              style={{ fontSize: "20px", padding: "0.1rem" }}
            />

            <FaMinus className="bg-gray-200 text-gray-600 text-lg h-1/2 p-1 w-1/2 rounded-r-md" />
          </div>
          <div className="flex w-full justify-end">
            {/* <p className="" style={{ fontSize: "10px" }}>
              To win:Br 0.00
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
