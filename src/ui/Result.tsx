import React from "react";
import { RootResultInterface } from "../config/types";
import Images from "./Images";
import moment from "moment";
import { Entry } from "../features/slices/RacingGameSlice";

interface ResultsProp {
  Icon: React.ComponentType;
  isSmall: boolean;
  gameData: RootResultInterface;
  gameType: string;
}
const Result: React.FC<ResultsProp> = ({
  Icon,
  isSmall,
  gameData,
  gameType,
}) => {
  const silkGenerator = (row: Entry, gameType: string, index: number) => {
    switch (gameType) {
      case "HarnessRacing":
        return `https://games2.playbetman.com/Content/Images/HorseSilks/silk_${row.SilkNumber}.png`;
      case "PreRecRealDogs":
        return `https://games2.playbetman.com/Content/Images/GreyhoundJackets/raceguimarkers0${
          index + 1
        }.png`;
      case "horseRun":
        return `https://games2.playbetman.com/Content/Images/HorseSilks/silk_${row.SilkNumber}.png`;
      case "CycleRacing":
        return `https://games2.playbetman.com/Content/Images/CyclistHelmets/silk_${
          index + 1
        }.png`;
      case "SteepleChase":
        return `https://games2.playbetman.com/Content/Images/HorseSilks/silk_${row.SilkNumber}.png`;
      case "SpeedSkating":
        return `https://games2.playbetman.com/Content/Images/SpeedSkatingFlags/Flag_0${
          index + 1
        }.png`;
      case "SingleSeaterMotorRacing":
        return `https://games2.playbetman.com/Content/Images/SingleSeaterMotorRacing/Helmet_${row.SilkNumber}.png`;
      case "MotorRacing":
        return `https://games2.playbetman.com/Content/Images/SingleSeaterMotorRacing/Helmet_${row.SilkNumber}.png`;
      case "DashingDerby":
        return `https://games2.playbetman.com/Content/Images/HorseSilks/silk_${row.SilkNumber}.png`;
      case "PlatinumHounds":
        return `https://games2.playbetman.com/Content/Images/GreyhoundJackets/raceguimarkers0${
          index + 1
        }.png`;
      default:
        return `https://games2.playbetman.com/Content/Images/HorseSilks/silk_${row.SilkNumber}.png`;
    }
  };
  return (
    <div
      className="w-full bg-black text-white text-lg"
      style={{ height: "50vw" }}
    >
      <div className="flex w-full items-center p-5 uppercase gap-4">
        <div className="">
          <Icon isSmall={isSmall} />
        </div>
        <div className="flex-col w-full">
          <p className="" style={{ fontSize: "25px" }}>
            Place
          </p>
          <div className="flex w-full gap-1" style={{ fontSize: "16px" }}>
            <p>
              {moment(gameData.AdjustedStartTime).format("DD/MM/YYYY hh:mm:ss")}
            </p>

            <p className="flex-1" style={{ fontSize: "20px" }}>
              ID {gameData.EventNumber}
            </p>
          </div>
        </div>
      </div>
      <div className="borderLine"></div>
      <div className="flex w-full justify-center mt-4 uppercase -mb-10">
        <p>Results</p>
      </div>
      <div
        className="bg-gray-500 h-28 flex justify-center mt-14 ml-10 w-full"
        style={{ width: "95%" }}
      >
        <div className="border-l-2 flex justify-between w-1/3">
          <div
            className="bg-green-600 text-white w-5 h-7 text-center rounded-br-full rounded-tr-lg pr-1 flex items-end justify-end"
            style={{ fontSize: 12 }}
          >
            <p>1</p>
          </div>
          <div
            className="flex flex-col m-auto items-center w-full"
            style={{ padding: "auto" }}
          >
            <div className="">
              <Images
                src={silkGenerator(
                  gameData.Race.Entries[0],
                  gameType + "",
                  parseInt(gameData.Race.Entries[0].Form)
                )}
                src={`https://games2.playbetman.com/Content/Images/HorseSilks/silk_${gameData.Race.Entries[0].SilkNumber}.png`}
              />
            </div>
            <div className="">
              {gameData.Race.Entries[0].Draw} {gameData.Race.Entries[0].Name}
            </div>
          </div>
        </div>
        <div className="border-l-2 w-1/3">
          {" "}
          <div
            className="bg-green-600 text-white w-5 h-7 text-center rounded-br-full rounded-tr-lg pr-1 flex items-end justify-end"
            style={{ fontSize: 12 }}
          >
            <p>2</p>
          </div>
          <div
            className="flex flex-col m-auto items-center w-full"
            style={{ padding: "auto" }}
          >
            <div className="">
              <Images
                src={`https://games2.playbetman.com/Content/Images/HorseSilks/silk_${gameData.Race.Entries[1].SilkNumber}.png`}
              />
            </div>
            <div className="">
              {gameData.Race.Entries[1].Draw} {gameData.Race.Entries[1].Name}
            </div>
          </div>
        </div>
        <div className="border-l-2 w-1/3">
          {" "}
          <div
            className="bg-green-600 text-white w-5 h-7 text-center rounded-br-full rounded-tr-lg pr-1 flex items-end justify-end"
            style={{ fontSize: 12 }}
          >
            <p>3</p>
          </div>
          <div
            className="flex flex-col m-auto items-center w-full"
            style={{ padding: "auto" }}
          >
            <div
              className=""
              style={{
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <Images
                src={`https://games2.playbetman.com/Content/Images/HorseSilks/silk_${gameData.Race.Entries[2].SilkNumber}.png`}
              />
            </div>
            <div className="">
              {gameData.Race.Entries[2].Draw} {gameData.Race.Entries[2].Name}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center text-sm mt-1">
        <p>Number Of Particepants:</p>
      </div>
    </div>
  );
};

export default Result;
