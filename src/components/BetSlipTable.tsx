import { IoIosPrint } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import betData, {
  BetSlip,
  cancelTicket,
  redeemTicket,
} from "../features/slices/betData";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { useEffect, useState } from "react";
import { printSelectedTickets } from "../features/slices/ticketSlice";
import { Ticket } from "../features/slices/betSlip";
import { SmartPlay } from "./svg/SmartPlay";
import { IoChevronBackOutline } from "react-icons/io5";
import Result from "../ui/Result";
import { Jaguar } from "./svg/Jaguar";
import { GameData } from "../features/slices/RacingGameSlice";
import { Garri } from "./svg/Garri";
import { DogWithVideo } from "./svg/DogWithVideo";
import HorseRun from "../pages/HorseRun";
import { Bicycle } from "./svg/Bicycle";
import { HorseJump } from "./svg/HorseJump";
import Hockey from "./svg/Hockey";
import { F1 } from "./svg/F1";
import { CarRacing } from "./svg/CarRacing";
import { DashingDerby } from "./svg/DashingDerby";
import moment from "moment";
import ResultforSpin from "../ui/ResultforSpin";

interface ActionType {
  type: string;
  data: BetSlip;
}

const BetSlipTable = ({ type, data }: ActionType) => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector((state) => state.game.game?.gamenumber);
  // const gameResult = useAppSelector((state) => state.game.game?.result);
  const userData = useAppSelector((state) => state.user);
  const gameNumber = data.Tickets?.map((items) => items.Game.gamenumber);
  const totalStake = data.Tickets?.reduce((a, b) => a + parseInt(b?.stake), 0);
  const [gameResult, setGameResult] = useState<GameData>();
  const [resultVisible, toggleResult] = useState(false);
  const gameResults = useAppSelector((state) => {
    return state.summary.eventResult;
  });
  const printSelected = (item: Ticket) => {
    const payload = {
      betslipId: item.betSlipId,
      shopId: userData.user?.Cashier.shopId,
      cashierCreateId: userData.user?.Cashier.id,
    };

    printSelectedTickets(payload);
  };

  const handleCancel = () => {
    dispatch(
      cancelTicket(
        gameNumber?.[0],
        parseInt(data?.betSlipNumber),
        userData.user?.Cashier.id
      )
    );
  };
  const gameTypeSelector = (gameType: string) => {
    switch (gameType) {
      case "HarnessRacing":
        return Garri;
      case "PreRecRealDogs":
        return DogWithVideo;
      case "horseRun":
        return HorseRun;
      case "CycleRacing":
        return Bicycle;
      case "SteepleChase":
        return HorseJump;
      case "SpeedSkating":
        return Hockey;
      case "SingleSeaterMotorRacing":
        return F1;
      case "MotorRacing":
        return CarRacing;
      case "DashingDerby":
        return DashingDerby;
      case "PlatinumHounds":
        return Jaguar;
      default:
        return;
    }
  };
  const handleRedeem = () => {
    dispatch(
      redeemTicket(userData.user?.Cashier.id, parseInt(data?.betSlipNumber))
    );
  };

  return (
    <>
      {!resultVisible && (
        <div className="right-flex pl-3 pr-3 flex-grow border-l-2 border-slate-200 ml-6">
          <div className="slip-header text-green-600 font-semibold text-xl">
            Betslip
          </div>
          <div className="slip-container mt-3 relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right">
              <thead className="text-xs border-b-2 border-t-2 border-slate-300 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-3">
                    Number
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td scope="row" className="px-3 py-3">
                    {data.betSlipNumber}
                  </td>
                  <td className="px-3 py-3">
                    {new Date(data.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3">
                    {new Date(data.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="slip-header text-green-600 font-semibold text-xl">
            Bets
          </div>
          <div className="slip-container mt-3 relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right">
              <thead className="text-xs border-b-2 border-t-2 border-slate-300 text-gray-700 uppercase bg-gray-50">
                <tr>
                  {type === "redeem" && (
                    <th
                      colSpan={1}
                      scope="col"
                      className="px-6 col-span-4 py-3"
                    >
                      Actions
                    </th>
                  )}
                  <th scope="col" className="px-3 py-3">
                    Bet ID
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Game
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Event No
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Market
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Selection
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Win
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.Tickets?.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      className={`${
                        item.win > 0 ? "bg-orange-300 text-white" : "bg-white"
                      } border-b`}
                    >
                      {type === "redeem" && (
                        <td scope="row" className="px-1 flex gap-4 py-2">
                          <FaEye
                            onClick={() => {
                              toggleResult(true);
                              setGameResult(item.Game);
                            }}
                            className="text-green-500 border-2 bg-white border-green-300 rounded-md p-1 cursor-pointer"
                            size={40}
                          />
                          <IoIosPrint
                            onClick={() => printSelected(item)}
                            className="text-green-500 border-2 bg-white border-green-300 rounded-md p-1 cursor-pointer"
                            size={40}
                          />
                        </td>
                      )}
                      <td scope="row" className="px-3 py-2">
                        {item.ticketNumber}
                      </td>
                      <td className="px-3 py-2">{item.Game.gameType}</td>
                      <td className="px-3 py-2">
                        {item.Game.gamenumber == 0
                          ? item.Game.gameData.Number
                          : item.Game.gamenumber}
                      </td>
                      <td scope="row" className="px-3 py-2">
                        {/* {((!item.nums.includes(-2) &&
                      !item.nums.includes(-4) &&
                      !item.nums.includes(-6)) && item.Game.status === "COMPLETED" && item.win > 0) && "Win"}
                    {((!item.nums.includes(-2) &&
                      !item.nums.includes(-4) &&
                      !item.nums.includes(-6)) && item.Game.status === "COMPLETED" && item.win < 1) && "Lost"} */}
                        {item.Game.gameType === "SmartPlayKeno" &&
                          !item.nums.includes(-2) &&
                          !item.nums.includes(-4) &&
                          !item.nums.includes(-6) &&
                          "Win"}
                        {item.Game.gameType !== "SmartPlayKeno" && item.oddType}
                        {(item.nums.includes(-2) ||
                          item.nums.includes(-4) ||
                          item.nums.includes(-6)) &&
                          "Heads and Tails"}
                      </td>
                      <td className="px-3 py-2">
                        {item.nums.includes(-2) ||
                        item.nums.includes(-4) ||
                        item.nums.includes(-6)
                          ? ""
                          : item.nums.join(", ")}
                        {item.nums.includes(-2) && "Heads"}
                        {item.nums.includes(-4) && "Evens"}
                        {item.nums.includes(-6) && "Tails"}
                      </td>
                      <td className="px-3 py-2">
                        {item&&item.win&& item.win > 0 ? parseInt(item.win).toFixed(2) : 0.0}{" "}
                        Br
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="bet-footer">
            <div className="flex justify-between text-sm items-center p-3">
              <div>{new Date(data.createdAt).toLocaleDateString()} A.M</div>
              <div className="mr-6">
                {data.Tickets.reduce((a, b) => a + parseInt(b?.win), 0).toFixed(2)} Br
              </div>
            </div>
            <div className="flex items-center justify-end mt-3">
              {type === "redeem" ? (
                <div className="font-bold text-l">
                  {data.Tickets &&
                    data.Tickets[0].Game.status === "COMPLETED" &&
                   data.Tickets.reduce((a, b) => a + parseInt(b.win), 0) < 1 &&
                    "Not a Winning Ticket"}
                  {data.Tickets &&
                  data.Tickets.reduce((a, b) => a + parseInt(b.win), 0) > 0 &&
                    `Unclaimed Winnings Br. ${data.Tickets?.reduce(
                      (a, b) => a + parseInt(b.win),
                      0
                    )}.00 `}
                </div>
              ) : (
                <div className="font-bold text-l">
                  Total Stake Br. {parseInt(totalStake).toFixed(2)}
                </div>
              )}
              {type === "redeem" ? (
                <button
                  onClick={handleRedeem}
                  className="ml-3 px-4 py-2 bg-green-600 text-white rounded-sm"
                >
                  Redeem $
                </button>
              ) : (
                <button
                  style={{ backgroundColor: "#F0AD4E" }}
                  onClick={handleCancel}
                  className="ml-3 px-4 py-2 text-white rounded-sm"
                >
                  Cancel $
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {resultVisible && (
        <div className="right-flex pl-3 pr-3 w-full flex-grow ml-2">
          <div className="result-header flex text-gray-500 justify-between">
            {gameResult.gameType === "SmartPlayKeno" && (
              <div className="w-full">
                <div className="flex w-full gap-3">
                  <SmartPlay />
                  <p className="mb-5">
                    {moment(gameResult.startTime).format("YYYY/MM/DD hh:mm:ss")}{" "}
                    ID{" "}
                    {gameResult.gameType === "SmartPlayKeno"
                      ? gameResult.gamenumber
                      : gameResult.gamenumber}
                  </p>
                </div>
                <div className="borderLine"></div>
                <div className="w-full p-3 text-xl flex justify-center">
                  <p>{"Results".toUpperCase()}</p>
                </div>
              </div>
            )}

            {gameResult?.gameType !== "SmartPlayKeno" &&
            gameResult?.gameType !== "SpinAndWin" ? (
              <Result
                Icon={gameTypeSelector(gameResult?.gameType)}
                isSmall={true}
                gameData={gameResult?.result}
                gameType={gameResult?.gameType}
              />
            ) : (
              gameResult?.gameType === "SpinAndWin"?<ResultforSpin gameData={gameResult?.result}/>:''
            )}

            <div>
              <button
                onClick={() => toggleResult(false)}
                className="flex w-36 p-1 justify-center border-gray-400 hover:bg-slate-200 transition-all items-center rounded-md"
                style={{ border: "1px solid #cfcfcf" }}
              >
                <IoChevronBackOutline size={24} /> Back To List
              </button>
            </div>
          </div>

          <div className="results-content flex items-center flex-col w-full">
            <div className="w-2/3 mr-20 mt-4">
              <div className="mb-3">
                <div className="grid gap-x-24 gap-y-1 grid-cols-10 -ml-14 pb-4 w-full">
                  {gameResult.gameType === "SmartPlayKeno" &&
                    gameResult &&
                    gameResult.result.MarketResults[0].WinningSelections.slice()
                      .sort((a, b) => parseInt(a) - parseInt(b))
                      .map((_) => {
                        return (
                          <button
                            style={{
                              backgroundColor: "#bc4307",
                            }}
                            key={_}
                            className={`balls rounded-full w-10 h-10 text-white`}
                          >
                            {_}
                          </button>
                        );
                      })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BetSlipTable;
