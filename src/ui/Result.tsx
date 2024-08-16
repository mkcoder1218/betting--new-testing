import React, { useEffect } from "react";
import { RootResultInterface } from "../config/types";
import Images from "./Images";
import moment from "moment";
import { Entry } from "../features/slices/RacingGameSlice";
import ImagesResult from "./ImageForResult";
import ResultLists from "./ResultLists";

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
        return `https://games2.playbetman.com/Content/Images/CyclistHelmets/silk_${index}.png`;
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
      className="w-full text-lg"
      style={{ height: "30vw", color: "#8c8c8c" }}
    >
      <div className="flex w-full items-center p-1 uppercase gap-4">
        <div className="">
          <Icon isSmall={isSmall} />
        </div>
        <div className="flex-col w-full">
          <p className="-mb-2" style={{ fontSize: "22px" }}>
            {gameData.Race.Name + " " + gameData.Race.Distance}
          </p>
          <div className="flex w-full gap-2 " style={{ fontSize: "14px" }}>
            <p>
              {moment(gameData.AdjustedStartTime).format("DD/MM/YYYY hh:mm:ss")}
            </p>

            <p className="flex-1" style={{ fontSize: "15px" }}>
              ID {gameData.EventNumber}
            </p>
          </div>
        </div>
      </div>
      <div className="borderLine"></div>
      <div className="w-full flex items-center p-2 text-xl justify-center">
        <p>{"Results".toUpperCase()}</p>
      </div>
      <div className="h-28 flex justify-center ml-5 w-full">
        <div
          className="flex flex-col m-auto items-center w-full"
          style={{ padding: "auto" }}
        >
          <div className="w-full flex flex-col items-center justify-center">
            <ImagesResult
              src={silkGenerator(
                gameData.Race.Entries[0],
                gameType + "",
                gameData.Race.Entries[0].Draw
              )}
            />

            <div className="text-sm -ml-10">
              {gameData.Race.Entries[0].Draw} {gameData.Race.Entries[0].Name}
            </div>
          </div>
        </div>{" "}
        <div
          className="flex flex-col m-auto items-center w-full"
          style={{ padding: "auto" }}
        >
          <div className="w-full flex flex-col items-center justify-center">
            <ImagesResult
              src={silkGenerator(
                gameData.Race.Entries[1],
                gameType + "",
                gameData.Race.Entries[1].Draw
              )}
            />

            <div className="text-sm -ml-10">
              {gameData.Race.Entries[1].Draw} {gameData.Race.Entries[1].Name}
            </div>
          </div>
        </div>{" "}
        <div
          className="flex m-auto justify-center items-center w-full"
          style={{ padding: "auto" }}
        >
          <div className="w-full flex flex-col items-center justify-center h-full">
            <ImagesResult
              src={silkGenerator(
                gameData.Race.Entries[2],
                gameType + "",
                gameData.Race.Entries[2].Draw
              )}
            />

            <div className="text-sm -ml-10">
              {gameData.Race.Entries[2].Draw} {gameData.Race.Entries[2].Name}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <ResultLists
          Name={"Last"}
          value={gameData.MarketResults[0].WinningSelections[0]}
        />
        <ResultLists
          Name={"Last 3"}
          value={gameData.MarketResults[1].WinningSelections[0]}
        />
        <ResultLists
          Name={"Head to Head"}
          value={gameData.MarketResults[2].WinningSelections[0]}
        />
        <ResultLists
          Name={"Head to Head"}
          value={gameData.MarketResults[3].WinningSelections[0]}
        />
        <ResultLists
          Name={"Head to Head"}
          value={gameData.MarketResults[4].WinningSelections[0]}
        />
      </div>
      <div className="w-full flex justify-center text-sm mt-1">
        <p>Number Of Particepants:{gameData.Race.Name.length}</p>
      </div>
    </div>
  );
};

export default Result;
