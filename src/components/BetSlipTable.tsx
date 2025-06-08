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
import { ComponentType } from "react";

interface ActionType {
  type: string;
  data: BetSlip;
}

const BetSlipTable = ({ type, data }: ActionType) => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user);
  const gameNumber = data.Tickets?.map((items) => items.Game.gamenumber);
  const totalStake =
    data.Tickets?.reduce((a, b) => a + (parseInt(b?.stake) || 0), 0) || 0;
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [resultVisible, setResultVisible] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);

  const handleCancel = () => {
    dispatch(
      cancelTicket(
        gameNumber?.[0],
        parseInt(data?.betSlipNumber),
        userData.user?.Cashier.id
      )
    );
  };

  const handleRedeem = () => {
    if (!userData.user?.Cashier?.id) return;

    dispatch(
      redeemTicket(
  data?.id,
        userData.user.Cashier.id,
        Number(data?.betSlipNumber),
        userData.user.Cashier.userId,
        userData.shop?.name || "",
        userData.user.username || ""
      )
    );
  };

  const handlePrint = (ticket: any) => {
    // Create printable content
    const printContent = `
      <html>
      <head>
        <title>Betslip Print</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .ticket { padding: 20px; }
          .header { text-align: center; font-weight: bold; margin-bottom: 10px; }
          .info { margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">Betslip</div>
          <div class="info">
            <p>ID: ${data.betSlipNumber}</p>
            <p>Date: ${new Date(data.createdAt).toLocaleDateString()}</p>
            <p>Time: ${new Date(data.createdAt).toLocaleTimeString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>BetID</th>
                <th>Game</th>
                <th>Event No</th>
                <th>Market</th>
                <th>Selection</th>
                <th>Win</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${ticket.ticketNumber}</td>
                <td>${ticket.Game.gameType}</td>
                <td>${ticket.Game.gamenumber}</td>
                <td>${getMarketName(ticket)}</td>
                <td>${ticket.nums && Array.isArray(ticket.nums) ? ticket.nums.join(", ") : ticket.nums}</td>
                <td>Br ${(ticket.win > 0) ? Number(ticket.win).toFixed(2) : "0.00"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;

    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
  };

  const handleViewResult = (ticket: any) => {
    setSelectedTicket(ticket);
    setGameResult(ticket.Game);
    setResultVisible(true);
  };

  const closeResultView = () => {
    setResultVisible(false);
    setGameResult(null);
    setSelectedTicket(null);
  };

  // Function to determine the market name based on the ticket data
  const getMarketName = (ticket: any) => {
    // If the game data is available and has market information
    if (ticket.Game && ticket.Game.gameData) {
      try {
        // Try to parse the gameData if it's a string
        const gameData = typeof ticket.Game.gameData === 'string'
          ? JSON.parse(ticket.Game.gameData)
          : ticket.Game.gameData;

        // Check if marketType exists in the parsed data
        if (gameData.marketType) {
          return gameData.marketType;
        }

        // Check if there's a market field
        if (gameData.market) {
          return gameData.market;
        }

        // Check for specific game types
        switch (ticket.Game.gameType) {
          case "Keno":
            return "Win";
          case "PlatinumHounds":
          case "HarnessRacing":
          case "Virtual Dog race":
          case "DashingDerby":
          case "CycleRacing":
          case "SteepleChase":
          case "SpeedSkating":
          case "SingleSeaterMotorRacing":
          case "MotorRacing":
          case "Dashing Derby":
            // For racing games, determine market based on the selection format
            if (ticket?.oddType) {
              console.log('ticket nums',ticket?.oddType);
              if (typeof ticket?.oddType === 'string') {
                if (ticket?.oddType?.toLowerCase()?.includes('win')) return 'Win';
                if (ticket?.oddType?.toLowerCase()?.includes('place')) return 'Place';
                if (ticket?.oddType?.toLowerCase()?.includes('exacta')) return 'Exacta';
                if (ticket?.oddType?.toLowerCase()?.includes('trifecta')) return 'Trifecta';
                if (ticket?.oddType?.toLowerCase()?.includes('quinella')) return 'Quinella';
                if (ticket?.oddType?.toLowerCase()?.includes('trio')) return 'Trio';
                if (ticket?.oddType?.toLowerCase()?.includes('swinger')) return 'Swinger';
              }
              return "Win/Place";
            }
            return "Win";
          default:
            return "Win";
        }
      } catch (error) {
        console.error("Error parsing game data:", error);
        return "Win"; // Default fallback
      }
    }

    // Default fallback based on game type
    return ticket.Game.gameType === "Keno" ? "Win" : "Win/Place";
  };

  // Function to determine which icon to display based on game type
  const gameTypeSelector = (gameType: string): ComponentType<any> | null => {
    switch (gameType) {
      case "PlatinumHounds":
        return Jaguar;
      case "HarnessRacing":
        return Garri;
      case "Virtual Dog race":
        return DogWithVideo;
      case "DashingDerby":
        return DashingDerby;
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
      case "Dashing Derby":
        return DashingDerby;
      default:
        return null;
    }
  };

  return (
    <div className="right-flex pl-3 pr-3 flex-grow border-l-2 border-slate-200 ml-6">
      {resultVisible && gameResult ? (
        <div className="right-flex pl-3 pr-3 w-full flex-grow ml-2 overflow-y-auto">
          <div className="result-header flex text-gray-500 justify-between">
            {gameResult.gameType === "SmartPlayKeno" && (
              <div className="w-full">
                <div className="flex w-full gap-3">
                  <SmartPlay />
                  <p className="mb-5">
                    {moment(gameResult.startTime).format(
                      "YYYY/MM/DD hh:mm:ss"
                    )}{" "}
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

            {gameResult.gameType !== "SmartPlayKeno" &&
            gameResult.gameType !== "SpinAndWin" ? (
              gameTypeSelector(gameResult.gameType) ? (
                <Result
                  Icon={gameTypeSelector(gameResult.gameType) as React.ComponentType}
                  isSmall={true}
                  gameData={gameResult.result}
                  gameType={gameResult.gameType}
                />
              ) : (
                <div className="p-4">
                  <p>Results not available for this game type</p>
                </div>
              )
            ) : gameResult.gameType === "SpinAndWin" ? (
              <ResultforSpin gameData={gameResult.result} />
            ) : (
              ""
            )}

            <div>
              <button
                onClick={closeResultView}
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
                    gameResult?.result?.MarketResults[0]?.WinningSelections.slice()
                      .sort((a: string, b: string) => parseInt(a) - parseInt(b))
                      .map((selection: string) => {
                        return (
                          <button
                            style={{
                              backgroundColor: "#bc4307",
                            }}
                            key={selection}
                            className={`balls rounded-full w-10 h-10 text-white`}
                          >
                            {selection}
                          </button>
                        );
                      })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="slip-header text-green-600 font-light text-xl">
            Betslip
          </div>
          <div className="slip-container mt-3 relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right">
              <thead className="text-xs border-b-2 uppercase">
                <tr>
                  <th scope="col" className="px-3 py-3">
                    ID
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
          <div className="slip-header text-green-600 font-light text-xl">
            Bets
          </div>
          <div className="slip-container mt-3 relative overflow-x-auto overflow-y-auto ">
            <table className="w-full text-sm text-left rtl:text-right">
              <thead className="text-xs border-b-2 uppercase sticky top-0 bg-white z-10">
                <tr>
                  {type !== "cancel" && (
                    <th scope="col" className="px-3 py-3">
                      Actions
                    </th>
                  )}
                  <th scope="col" className="px-3 py-3">
                    BetID
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
                      className={`${item.win > 0 ? 'bg-[#d4b052]' : 'bg-white'} border-b`}
                    >
                      {type !== "cancel" && (
                        <td className="px-3 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewResult(item)}
                              className="w-10 h-10 flex items-center justify-center border bg-white border-green-500 text-green-500 rounded-sm hover:bg-[#c9a646] transition-all"
                              title="View Result"
                            >
                              <FaEye size={18} color="green" />
                            </button>
                            <button
                              onClick={() => handlePrint(item)}
                              className="w-10 h-10 flex items-center justify-center border bg-white border-green-500 text-green-500 rounded-sm hover:bg-[#c9a646] transition-all"
                              title="Print Ticket"
                            >
                              <IoIosPrint size={18} color="green" />
                            </button>
                          </div>
                        </td>
                      )}
                      <td scope="row" className="px-3 py-2">
                        {item.ticketNumber}
                      </td>
                      <td className="px-3 py-2">{item.Game.gameType}</td>
                      <td className="px-3 py-2">
                        {item.Game.gamenumber === 0
                          ? (item.Game.gameData && typeof item.Game.gameData === 'object')
                            ? item.Game.gamenumber
                            : item.Game.gamenumber
                          : item.Game.gamenumber}
                      </td>
                      <td scope="row" className="px-3 py-2">
                        {getMarketName(item)}
                      </td>
                      <td className="px-3 py-2">
                        {item.nums && Array.isArray(item.nums)
                          ? item.nums.join(", ")
                          : item.nums}
                      </td>
                      <td className="px-3 py-2">
                        Br {(item.win > 0) ? Number(item.win).toFixed(2) : "0.00"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="bet-footer">
            <div className="flex flex-col w-full mt-3 gap-2">
              {type !== "cancel" && (
                <>
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-light text-gray-500">
                      {new Date(data.createdAt).toLocaleDateString()} {new Date(data.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                   
                  </div>
                  <div className="flex justify-end gap-3 items-center">
                    <div className="font-semibold text-gray-800">
                      Unclaimed Winnings Br {data.Tickets?.reduce((total: number, ticket: any) => total + (Number(ticket.win) || 0), 0).toFixed(2)}
                    </div>
                    <button
                      onClick={handleRedeem}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all flex items-center"
                    >
                      Redeem $
                    </button>
                  </div>
                </>
              )}

              {type === "cancel" && (
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-gray-800">
                    Total Stake Br {Number(totalStake).toFixed(2)}
                  </div>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-[#F0AD4E] text-white rounded-md hover:bg-[#ec971f] transition-all flex items-center"
                  >
                    Cancel <span className="ml-1">✓</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BetSlipTable;
