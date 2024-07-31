import React from "react";
import F from "./F";
import BasicRating from "./Rating";
import ButtonSizes from "./Win";
import Images from "./Images";
import { useAppSelector } from "../features/hooks";

function MiniHeadtoHead() {
  const gameType = useAppSelector((state) => state.gameType.gameType);
  return (
    <div className="flex w-full p-2 justify-center">
      <div className="flex gap-1 p-0 w-full justify-between">
        <F />
        <div className="flex-col headCon mr-7">
          <p className="text-xl">Name</p>
          <div className="flex-col item-center">
            <BasicRating isHeadToHead={true} />
            <p className="-mt-2">2,3,4,6,7</p>
          </div>
        </div>
        <div className="flex justify-evenly items-center butto">
          <Images src="/Images/CyclistHelmets/silk_1.png" isHeadtoHead={true} />
          {gameType !== "TRACK RACING" ? (
            <p className="text-center ml-2 text-xl">1</p>
          ) : (
            ""
          )}
          <ButtonSizes text="12" />
          <p className="text-3xl vs">vs</p>
          <ButtonSizes text="12" />
          {gameType !== "TRACK RACING" ? (
            <p className="text-center mr-2 text-xl">1</p>
          ) : (
            ""
          )}
          <Images src="/Images/CyclistHelmets/silk_1.png" isHeadtoHead={true} />
        </div>
        <div className="flex-col headCon ml-7">
          <p className="text-xl">Name</p>
          <div className="flex-col item-center">
            <BasicRating isHeadToHead={true} />
            <p className="-mt-2">2,3,4,6,7</p>
          </div>
        </div>
        <F />
      </div>
    </div>
  );
}

export default MiniHeadtoHead;
