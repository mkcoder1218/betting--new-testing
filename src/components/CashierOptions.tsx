import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import dayjs, { Dayjs } from "dayjs";
import * as XLSX from "xlsx";
import moment from "moment";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MdOutlineCancel } from "react-icons/md";
import { IoIosPrint, IoMdRefresh } from "react-icons/io";
import { FaPrint } from "react-icons/fa";
import { FaEye, FaRegFileLines } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  CashierData,
  ResultData,
  getEventResult,
  getSummaryData,
  printResultToBackend,
  printSummaryToBackend,
} from "../features/slices/summarySlice";
import ProgressCircular from "./ProgressCircular";
import FormStatus from "./FormStatus";
import {
  Ticket,
  printSelectedTickets,
  recallTickets,
} from "../features/slices/ticketSlice";
import { getCashierNames } from "../features/slices/cashierData";
import { getNetBalance } from "../features/slices/netBalance";
import { Input } from "@mui/material";
import { SmartPlay } from "./svg/SmartPlay";
import { IoChevronBackOutline } from "react-icons/io5";
import Result from "../ui/Result";
import { Jaguar } from "./svg/Jaguar";
import { GameData, Race, Entry, Market } from '../features/slices/RacingGameSlice';
import { RootResultInterface } from "../config/types";
import HorseRun from "../pages/HorseRun";
import { Bicycle } from "./svg/Bicycle";
import Hockey from "./svg/Hockey";
import { F1 } from "./svg/F1";
import { CarRacing } from "./svg/CarRacing";
import { DogWithVideo } from "./svg/DogWithVideo";
import { Garri } from "./svg/Garri";
import { DashingDerby } from "./svg/DashingDerby";
import { HorseJump } from "./svg/HorseJump";
import ResultforSpin from "../ui/ResultforSpin";

interface CashierOptionsProps {
  open: boolean;
  handleClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const style = {
  position: "absolute" as "absolute",
  top: "55%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "86%",
  margin: "auto",
  height: "80%",
  overflow: "auto",
  borderRadius: "10px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 0,
};

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      className="w-full"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function CashierOptions({
  open,
  handleClose,
}: CashierOptionsProps) {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user);
  const cashierData = useAppSelector((state) => state.cashier);
  const summaryData = useAppSelector((state) => state.summary);
  const ticketList = useAppSelector((state) => state.ticket);
  const balanceState = useAppSelector((state) => state.balance);
  const [value, setValue] = React.useState(0);
  const [valueParent, setParent] = React.useState(0);
  const [gameNumber, setGameNumber] = React.useState();
  const [resultVisible, toggleResult] = React.useState(false);
  const [gameResult, setGameResult] = React.useState<GameData>();
  const gameResults = useAppSelector((state) => {
    return state.summary.eventResult;
  });
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [to, setTo] = React.useState<Dayjs | null>(
    dayjs(tomorrow.toDateString())
  );
  const [from, setFrom] = React.useState<Dayjs | null>(
    dayjs(new Date().toDateString())
  );
  const [cashierName, setCashierName] = React.useState<string[] | undefined>(
    []
  );
  const [cashierNameVal, setCashier] = React.useState("all");
  const cashierState = useAppSelector((state) => state.cashier);

  React.useEffect(() => {
    dispatch(getCashierNames(userData.user?.Cashier.shopId));
    dispatch(getNetBalance(userData.user?.Cashier.id));
  }, []);

  const refreshNetBalance = () => {
    dispatch(getNetBalance(userData.user?.Cashier.id));
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
  const handleCashierChoose = (event: SelectChangeEvent) => {
    setCashier(event.target.value);

    if (event.target.value === "all") {
      setCashierName(cashierState.data?.map((item) => item.id));
    } else {
      setCashierName([event.target.value]);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleParentTab = (event: React.SyntheticEvent, val: number) => {
    setParent(val);
    setValue(0);
  };

  const handleFetchSummary = () => {
    dispatch(
      getSummaryData(
        from?.toISOString(),
        to?.toISOString(),
        userData.user?.Cashier.shopId
      )
    );
  };

  const handleLoadEventResult = () => {
    dispatch(
      getEventResult(
        from?.toISOString(),
        to?.toISOString(),
        gameNumber,
        userData.user?.Cashier.shopId
      )
    );
  };

  const getTicketList = () => {
    dispatch(recallTickets(cashierName));
  };

  React.useEffect(() => {
    getTicketList();
  }, [cashierName]);
  React.useEffect(() => {
    if (cashierState && cashierState.data) {
      const eb: any = { target: { value: "all", name: "event" } };
      handleCashierChoose(eb);
    }
  }, [cashierState]);

  const printSummary = (item: CashierData) => {
    const dataToSend = {
      cashierName: item["Cashier.User.username"],
      from: from?.toDate().toDateString(),
      to: to?.toDate().toDateString(),
      startBalance: 0.0,
      deposits: 0.0,
      bets: item.totalBets,
      cancellations: item.totalCancelAmount,
      redeemed: item.totalRedeemAmount,
      withdraws: 0.0,
      endBalance: item.netAmount,
      shopId: userData.user?.Cashier.shopId,
      isCopy: true,
    };

    printSummaryToBackend(dataToSend);
  };

  const printResult = (item: ResultData) => {
    console.log("itemresult", item);
    let gameType=''
 switch (item.Game) {
   case "SpeedSkating":
     gameType = "Speed Skating";
     break;
   case "SpinAndWin":
     gameType = "Spin And Win";
     break;
   case "Dashing Derby":
     gameType = "Horse Racing";
     break;
   case "MotorRacing":
     gameType = "MotorRacing";
     break;
   case "PlatinumHounds":
     gameType = "GrayHound Racing";
     break;
   case "CycleRacing":
     gameType = "Track Racing";
     break;
   case "PreRecRealDogs":
     gameType = "GREYHOUND RACING";
     break;
   case "SingleSeaterMotorRacing":
     gameType = "SS MOTOR RACING";
     break;
   case "SteepleChase":
     gameType = "SteepleChaseRacing";
     break;
   default:
     gameType = "Keno";
 }
    const dataToSend = {
      cashierName: item.cashierName,
      shopName: item.shopName,
      date: item.date,
      Game: gameType,
      eventId: item.result.EventNumber,
      gameTime: item.gameTime,
      formattedTime: moment(item.gameTime).format("YYYY/MM/DD hh:mm:ss"),
      result:
        item.Game === "SmartPlayKeno" || item.Game === "SpinAndWin"
          ? item.result.MarketResults[0].WinningSelections.slice()
              .sort((a, b) => parseInt(a) - parseInt(b))
              .join(" ")
          : item.result.Race.Entries.map((results, index) => {
              return `${results.Draw}:${results.Name}`;
            }),
      Market:
        item.result.MarketResults.length > 0 ? item.result.MarketResults.map(market => {
          return `${market.MarketClassDescription}:${market.WinningSelections}`;
        }) : "",
    };
    printResultToBackend(dataToSend);
  };

  const printSelected = (item: Ticket) => {
    const payload = {
      betslipId: item.betSlipId,
      shopId: userData.user?.Cashier.shopId,
      cashierCreateId: userData.user?.Cashier.id,
      isCopy: true,
    };
    console.log("payload:", payload);
    printSelectedTickets(payload);
  };

  const exportToExcel = (data: CashierData[] | null) => {
    if (!data) {
      return;
    }

    let newData = [];

    for (let item of data) {
      const newReport = {
        RetailUser: item["Cashier.User.username"],
        ["From Date"]: from?.toDate().toDateString(),
        ["To Date"]: to?.toDate().toDateString(),
        ["Start Balance"]: `Br.0.00`,
        ["Deposits"]: `Br. 0.00`,
        ["Bets"]: `Br. ${parseInt(item.totalBets).toFixed(2)}`,
        ["Cancellations"]: `Br. ${parseInt(item.totalCancelAmount).toFixed(2)}`,
        ["Redeemed"]: `Br. ${parseInt(item.totalRedeemAmount).toFixed(2)}`,
        ["Withdraws"]: `Br. 0.00`,
        ["End Balance"]: `Br. ${parseInt(item.netAmount).toFixed(2)}`,
      };

      newData.push(newReport);
    }

    const totalEndBalance = data.reduce((a, b) => a + parseInt(b.netAmount), 0);
    newData.push({
      RetailUser: "",
      ["From Date"]: "",
      ["To Date"]: "",
      ["Start Balance"]: "",
      ["Deposits"]: ``,
      ["Bets"]: ``,
      ["Cancellations"]: ``,
      ["Redeemed"]: ``,
      ["Withdraws"]: `Total End Balance`,
      ["End Balance"]: `Br. ${totalEndBalance.toFixed(2)}`,
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(newData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Summary Report");
    XLSX.writeFile(
      workbook,
      `Summary Report ${from?.toDate().toDateString()} - ${to
        ?.toDate()
        .toDateString()}.xlsx`
    );
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="cashier-options-header flex justify-between items-center p-3 bg-green-500">
            <p className="text-white text-md">Cashier Options</p>
            <MdOutlineCancel
              onClick={handleClose}
              size={24}
              className="text-black"
            />
          </div>
          <div className="options-content bg-white p-6">
            <div
              className="flex items-center justify-end"
              style={{ justifyContent: "space-between" }}
            >
              {!balanceState.loading && (
                <div className="text-green-500 text-lg">
                  {/* {cashierState.data &&
                    cashierState.data[0] &&
                    `Credit Balance: Br. ${
                      balanceState.data && balanceState.data[0].creditAmount
                    }`}{" "} */}
                </div>
              )}
              <div className="flex">
                {!balanceState.loading && (
                  <div className="text-green-500 text-lg">
                    Balance: Br.{"    "}
                    {balanceState.data && balanceState.data[0].netAmount}
                    .00
                  </div>
                )}
                <span
                  onClick={refreshNetBalance}
                  className="hover:opacity-50 transition-all"
                >
                  <IoMdRefresh
                    className="text-green-600 pt-0 pb-0 pl-2 pr-2 border rounded-md ml-2 border-green-500"
                    size={36}
                  />
                </span>
              </div>
            </div>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={valueParent}
                  onChange={handleParentTab}
                  aria-label="tickets tab"
                >
                  <Tab
                    label="Report"
                    style={{
                      textTransform: "unset",
                      color: valueParent === 0 ? "#FFFFFF" : "#000000",
                    }}
                    {...a11yProps(0)}
                  />
                  <Tab
                    label="Event Result Search"
                    style={{
                      textTransform: "unset",
                      color: valueParent === 1 ? "#FFFFFF" : "#000000",
                    }}
                    {...a11yProps(1)}
                  />
                </Tabs>
              </Box>

              <Box sx={{ borderBottom: 1, p: 0, borderColor: "divider" }}>
                <div className={`border h-full border-green-500 w-full `}>
                  <CustomTabPanel value={valueParent} index={0}>
                    <Box
                      sx={{
                        borderBottom: 1,
                        p: 0,
                        m: 0,
                        borderColor: "divider",
                      }}
                    >
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="tickets tab"
                      >
                        <Tab
                          label="Summary"
                          style={{
                            textTransform: "unset",
                            color: value === 0 ? "#FFFFFF" : "#000000",
                          }}
                          {...a11yProps(0)}
                        />
                        <Tab
                          label="Recall Bets"
                          style={{
                            textTransform: "unset",
                            color: value === 1 ? "#FFFFFF" : "#000000",
                          }}
                          {...a11yProps(1)}
                        />
                      </Tabs>
                    </Box>
                    <div className="border mt-4 border-green-500 w-full rounded-md">
                      <CustomTabPanel value={value} index={0}>
                        <div className="date-picker-form flex gap-4 items-end">
                          <div>
                            <p className="mb-0 text-sm font-bold">From Date</p>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer
                                components={["DatePicker", "DatePicker"]}
                              >
                                <DatePicker
                                  value={from}
                                  onChange={(newValue) => setFrom(newValue)}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </div>
                          <div>
                            <p className="mb-0 text-sm font-bold">To Date</p>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer
                                components={["DatePicker", "DatePicker"]}
                              >
                                <DatePicker
                                  value={to}
                                  onChange={(newValue) => setTo(newValue)}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </div>
                          <button
                            onClick={handleFetchSummary}
                            className="p-2 text-sm bg-green-600 rounded-md text-white flex items-center gap-2"
                          >
                            Refresh{" "}
                            <span>
                              <IoMdRefresh className="text-white" size={16} />
                            </span>
                          </button>
                          {summaryData.data && summaryData.data.length > 0 && (
                            <button
                              onClick={() => exportToExcel(summaryData?.data)}
                              className="p-2 text-sm bg-green-600 rounded-md text-white flex items-center gap-2"
                            >
                              Export to Excel
                              <span>
                                <FaRegFileLines
                                  className="text-white"
                                  size={16}
                                />
                              </span>
                            </button>
                          )}
                        </div>
                        {summaryData.loading && (
                          <div className="w-full flex items-center p-4 justify-center">
                            <ProgressCircular />
                          </div>
                        )}
                        {summaryData.error !== null && (
                          <FormStatus
                            type="error"
                            content={summaryData.error}
                          />
                        )}
                        {!summaryData.data ||
                          (summaryData.data?.length < 0 && (
                            <div className="w-full text-center p-4 mt-4">
                              No Tickets found
                            </div>
                          ))}
                        {summaryData.data !== null &&
                          summaryData.data.length > 0 && (
                            <div className="summary-content w-full mt-4">
                              <table className="w-full table-fixed">
                                <thead className="border-2 border-slate-300 bg-white">
                                  <tr className="text-sm p-2 table-row">
                                    <th className="border p-2 border-slate-400">
                                      Print
                                    </th>
                                    <th className="border border-slate-400">
                                      Cashier Name
                                    </th>
                                    <th className="border border-slate-400">
                                      From Date
                                    </th>
                                    <th className="border border-slate-400">
                                      To Date
                                    </th>
                                    <th className="border border-slate-400">
                                      Tickets
                                    </th>
                                    <th className="border border-slate-400">
                                      Bets
                                    </th>
                                    <th className="border border-slate-400">
                                      Redeemed
                                    </th>
                                    <th className="border border-slate-400">
                                      Cancelled
                                    </th>
                                    <th className="border border-slate-400">
                                      Net Balance
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {summaryData.data.map((item) => {
                                    return (
                                      <tr
                                        key={item.cashierCreateId}
                                        className="text-center text-sm p-2 "
                                      >
                                        <td
                                          onClick={() => printSummary(item)}
                                          className="border border-slate-400"
                                        >
                                          <span className="flex items-center justify-center cursor-pointer">
                                            <FaPrint
                                              size={20}
                                              className="text-orange-500 hover:text-orange-300 transition-all"
                                            />
                                          </span>
                                        </td>
                                        <td className="border border-slate-400 p-2">
                                          {item["Cashier.User.username"]}
                                        </td>
                                        <td className="border border-slate-400 p-2">
                                          {from?.toDate().toLocaleDateString()}
                                        </td>
                                        <td className="border border-slate-400 p-2">
                                          {to?.toDate().toLocaleDateString()}
                                        </td>
                                        <td className="border border-slate-400 p-2">
                                          {item.totalTickets}
                                        </td>
                                        <td className="border border-slate-400 p-2">
                                          {parseFloat(item.totalBets).toFixed(
                                            2
                                          )}{" "}
                                          Br.
                                        </td>
                                        <td className="border border-slate-400 p-2">
                                          {item.redeemCount}
                                        </td>
                                        <td className="border border-slate-400 p-2">
                                          {item.cancelCount}
                                        </td>
                                        <td className="border border-slate-400 p-2">
                                          {parseInt(item.netAmount).toFixed(2)}{" "}
                                          Br.
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                      </CustomTabPanel>
                      <CustomTabPanel value={value} index={1}>
                        <div className="cashier-box">
                          <div className="font-bold">Retail User</div>
                          <div className="select-container">
                            {cashierState.data && (
                              <FormControl
                                sx={{ mt: 1, mb: 2, p: 0, minWidth: 260 }}
                                size="small"
                              >
                                <Select
                                  labelId="demo-select-small-label"
                                  id="demo-select-small"
                                  onChange={handleCashierChoose}
                                  value={cashierNameVal}
                                  defaultValue="all"
                                >
                                  <MenuItem value={"all"}>All</MenuItem>
                                  {cashierState.data?.map((item) => {
                                    return (
                                      <MenuItem key={item.id} value={item.id}>
                                        {item.User.username.toLocaleLowerCase()}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            )}
                          </div>
                        </div>
                        <div className="date-picker-form flex gap-6 items-end">
                          <button
                            onClick={getTicketList}
                            className="p-1 mb-2 bg-green-500 rounded-md text-white flex items-center gap-2"
                          >
                            Refresh
                            <span>
                              <IoMdRefresh className="text-white" size={20} />
                            </span>
                          </button>
                        </div>

                        {ticketList.loading && (
                          <div className="w-full flex items-center p-4 justify-center">
                            <ProgressCircular />
                          </div>
                        )}
                        {/* {ticketList.error && <FormStatus type='error' content={ticketList.error} />} */}
                        {!ticketList.loading && ticketList.data.length < 1 && (
                          <div className="w-full text-center p-4 mt-4">
                            No Tickets found
                          </div>
                        )}
                        {!ticketList.loading && ticketList.data.length > 0 && (
                          <div className="summary-content  max-h-80  overflow-scroll w-full mt-4">
                            <table className="w-full  table-fixed">
                              <thead className="border-2">
                                <tr className="text-sm text-left p-4 table-row">
                                  <th className="p-2">Retail User</th>
                                  <th className="p-2">Date</th>
                                  <th className="p-2">Stake</th>
                                  <th className="p-2">Description</th>
                                  <th className="p-2"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {ticketList.data.map((item) => {
                                  return (
                                    <tr
                                      key={item.id}
                                      className="even:bg-gray-200 odd:bg-white text-start text-sm p-2 border-l-slate-300"
                                    >
                                      <td className="border border-l-slate-400 p-2">
                                        {item.BetSlip.Cashier.User.username}
                                      </td>
                                      <td className="border border-l-slate-400 p-2">
                                        {`${new Date(
                                          item.createdAt
                                        ).getFullYear()}/${
                                          new Date(item.createdAt).getMonth() +
                                          1
                                        }/${new Date(
                                          item.createdAt
                                        ).getDate()} ${new Date(
                                          item.createdAt
                                        ).toLocaleTimeString("en-US", {
                                          hour12: false,
                                        })}`}
                                      </td>
                                      <td className="border border-l-slate-400 p-2">
                                        {parseFloat(item.stake).toFixed(2)} Br
                                      </td>
                                      <td className="border border-l-slate-400 pl-5 p-2">
                                        {`${item.gameType}-${item.Game.gameData.Number}`}
                                      </td>
                                      <td
                                        onClick={() => printSelected(item)}
                                        className="border border-l-slate-400 p-2"
                                      >
                                        <div className="border justify-center">
                                          <FaPrint
                                            size={20}
                                            className="text-green-600 hover:text-green-300 transition-all"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </CustomTabPanel>
                    </div>
                  </CustomTabPanel>
                  <CustomTabPanel value={valueParent} index={1}>
                    {resultVisible && gameResults && gameResult && (
                      <div className="right-flex pl-3 pr-3 w-full flex-grow ml-2">
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

                          {gameResult.gameType !== "SmartPlayKeno" && gameResult.gameType !== 'SpinAndWin' ? (
                           
                            <Result
                              Icon={gameTypeSelector(gameResult.gameType)}
                              isSmall={true}
                              gameData={gameResult.result}
                              gameType={gameResult.gameType}
                            />
                          ) : gameResult.gameType==='SpinAndWin'?<ResultforSpin gameData={gameResult.result} />:''}

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
                    {!resultVisible && (
                      <div className="border border-green-500 w-full">
                        <CustomTabPanel value={value} index={0}>
                          <div className="date-picker-form flex gap-4 items-end">
                            <div>
                              <p className="mb-0 text-sm font-bold">
                                From Date
                              </p>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer
                                  components={["DatePicker", "DatePicker"]}
                                >
                                  <DatePicker
                                    value={from}
                                    onChange={(newValue) => setFrom(newValue)}
                                  />
                                </DemoContainer>
                              </LocalizationProvider>
                            </div>
                            <div>
                              <p className="mb-0 text-sm font-bold">To Date</p>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer
                                  components={["DatePicker", "DatePicker"]}
                                >
                                  <DatePicker
                                    value={to}
                                    onChange={(newValue) => setTo(newValue)}
                                  />
                                </DemoContainer>
                              </LocalizationProvider>
                            </div>
                            <div>
                              <p className="mb-0 text-sm font-bold">
                                Event Number
                              </p>
                              <input
                                value={gameNumber}
                                onChange={(e) => setGameNumber(e.target.value)}
                                maxLength={20}
                                type="text"
                                className="p-2 w-full mt-3 border border-slate-500 bg-white rounded-md"
                                placeholder="Event number"
                                // ref={myInputRef}
                              />
                            </div>
                          </div>
                          <br />
                          <div className="flex">
                            <button
                              onClick={handleLoadEventResult}
                              className="p-2 text-sm bg-green-600 rounded-md text-white flex items-center gap-2"
                            >
                              Refresh{" "}
                              <span>
                                <IoMdRefresh className="text-white" size={16} />
                              </span>
                            </button>
                            {summaryData.data &&
                              summaryData.data.length > 0 && (
                                <button
                                  onClick={() =>
                                    exportToExcel(summaryData?.data)
                                  }
                                  className="p-2 text-sm bg-green-600 rounded-md text-white flex items-center gap-2"
                                >
                                  Export to Excel
                                  <span>
                                    <FaRegFileLines
                                      className="text-white"
                                      size={16}
                                    />
                                  </span>
                                </button>
                              )}
                          </div>
                          {summaryData.loading && (
                            <div className="w-full flex items-center p-4 justify-center">
                              <ProgressCircular />
                            </div>
                          )}
                          {summaryData.error !== null && (
                            <FormStatus
                              type="error"
                              content={summaryData.error}
                            />
                          )}
                          {gameResults && gameResults.length < 0 && (
                            <div className="w-full text-center p-4 mt-4">
                              No Tickets found
                            </div>
                          )}

                          {!resultVisible &&
                            gameResults &&
                            gameResults.length > 0 && (
                              <div className="summary-content w-full mt-4">
                                <table className="w-full  table-fixed">
                                  <thead className="border-2 border-slate-300 bg-white">
                                    <tr className="text-sm p-2 table-row">
                                      <th className="border p-2 border-slate-400">
                                        Print
                                      </th>
                                      <th className="border border-slate-400">
                                        Game
                                      </th>
                                      <th className="border border-slate-400">
                                        From Date
                                      </th>
                                      <th className="border border-slate-400">
                                        To Date
                                      </th>
                                      <th className="border border-slate-400">
                                        GameNumber
                                      </th>

                                      <th className="border border-slate-400">
                                        Date
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {gameResults &&
                                      gameResults.map((item) => {
                                        return (
                                          <tr
                                            key={item.id}
                                            className="text-center text-sm p-2 "
                                          >
                                            <td
                                              // onClick={() => printSummary(item)}
                                              className="border border-slate-400"
                                            >
                                              <span className="flex items-center justify-center cursor-pointer">
                                                <FaEye
                                                  onClick={() => {
                                                    toggleResult(true);
                                                    setGameResult(item);
                                                  }}
                                                  className="text-green-500 border-2 bg-white border-green-300 rounded-md p-1 cursor-pointer"
                                                  size={40}
                                                />
                                                <IoIosPrint
                                                  onClick={() =>
                                                    printResult({
                                                      result: item.result,
                                                      cashierName:
                                                        userData.user
                                                          ?.username + "",
                                                      shopName:
                                                        cashierData.data &&
                                                        cashierData.data
                                                          .length > 0
                                                          ? cashierData.data[0]
                                                              .Shop?.name + ""
                                                          : "",
                                                      gameTime: item.startTime,
                                                      eventId: item.gamenumber,
                                                      Game: item.gameType,
                                                      formattedTime: "",
                                                      date: moment(),
                                                    })
                                                  }
                                                  className="text-green-500 border-2 bg-white border-green-300 rounded-md p-1 cursor-pointer"
                                                  size={40}
                                                />
                                              </span>
                                            </td>
                                            <td className="border border-slate-400 p-2">
                                              {item.gameType}
                                            </td>
                                            <td className="border border-slate-400 p-2">
                                              {from
                                                ?.toDate()
                                                .toLocaleDateString()}
                                            </td>
                                            <td className="border border-slate-400 p-2">
                                              {to
                                                ?.toDate()
                                                .toLocaleDateString()}
                                            </td>
                                            <td className="border border-slate-400 p-2">
                                              {item.gamenumber === 0
                                                ? item.gameData.Number
                                                : item.gamenumber}
                                            </td>

                                            <td className="border border-slate-400 p-2">
                                              {moment(item.startTime).format(
                                                "DD/MM/YYYY hh:mm:ss"
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                          <div className="cashier-box">
                            <div className="font-bold">Retail User</div>
                            <div className="select-container">
                              {cashierState.data && (
                                <FormControl
                                  sx={{ mt: 1, mb: 2, p: 0, minWidth: 260 }}
                                  size="small"
                                >
                                  <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    onChange={handleCashierChoose}
                                    value={cashierNameVal}
                                    defaultValue="all"
                                  >
                                    <MenuItem value={"all"}>All</MenuItem>
                                    {cashierState.data?.map((item) => {
                                      return (
                                        <MenuItem key={item.id} value={item.id}>
                                          {item.User.username.toLocaleLowerCase()}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                              )}
                            </div>
                          </div>
                          <div className="date-picker-form flex gap-6 items-end">
                            <button
                              onClick={getTicketList}
                              className="p-1 mb-2 bg-green-500 rounded-md text-white flex items-center gap-2"
                            >
                              Refresh
                              <span>
                                <IoMdRefresh className="text-white" size={20} />
                              </span>
                            </button>
                          </div>

                          {ticketList.loading && (
                            <div className="w-full flex items-center p-4 justify-center">
                              <ProgressCircular />
                            </div>
                          )}
                          {!ticketList.loading &&
                            ticketList.data.length < 1 && (
                              <div className="w-full text-center p-4 mt-4">
                                No Tickets found
                              </div>
                            )}
                          {!ticketList.loading &&
                            ticketList.data.length > 0 && (
                              <div
                                className="summary-content  max-h-80  overflow-scroll w-full mt-4"
                                style={{ width: "100%", display: "block" }}
                              >
                                <table className="w-full  table-fixed w-full">
                                  <thead className="border-2">
                                    <tr className="text-sm text-left p-4 table-row flex">
                                      <th className="p-2">Retail User</th>
                                      <th className="p-2">Date</th>
                                      <th className="p-2">Stake</th>
                                      <th className="p-2">Description</th>
                                      <th className="p-2"></th>
                                    </tr>
                                  </thead>
                                  <tbody className="flex">
                                    {ticketList.data.map((item) => {
                                      return (
                                        <tr
                                          key={item.id}
                                          className="even:bg-gray-200 odd:bg-white text-start text-sm p-2 border-l-slate-300"
                                        >
                                          <td className="border border-l-slate-400 p-2">
                                            {item.BetSlip.Cashier.User.username}
                                          </td>
                                          <td className="border border-l-slate-400 p-2">
                                            {`${new Date(
                                              item.createdAt
                                            ).getFullYear()}/${
                                              new Date(
                                                item.createdAt
                                              ).getMonth() + 1
                                            }/${new Date(
                                              item.createdAt
                                            ).getDate()} ${new Date(
                                              item.createdAt
                                            ).toLocaleTimeString("en-US", {
                                              hour12: false,
                                            })}`}
                                          </td>
                                          <td className="border border-l-slate-400 p-2">
                                            {parseFloat(item.stake).toFixed(2)}{" "}
                                            Br
                                          </td>
                                          <td className="border border-l-slate-400 p-2">
                                            {`Single, Keno-${item.Game.gamenumber}`}
                                          </td>
                                          <td
                                            onClick={() => printSelected(item)}
                                            className="border border-l-slate-400 p-2"
                                          >
                                            <div className="border justify-center">
                                              <FaPrint
                                                size={20}
                                                className="text-green-600 hover:text-green-300 transition-all"
                                              />
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                        </CustomTabPanel>
                      </div>
                    )}
                  </CustomTabPanel>
                </div>
              </Box>
            </Box>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
