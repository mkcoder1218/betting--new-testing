import * as React from "react";
import { useCallback } from "react";
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
import ProgressCircular, { SmallProgressCircular } from "./ProgressCircular";
import FormStatus from "./FormStatus";
import {
  Ticket,
  printSelectedTickets,
  recallTickets,
} from "../features/slices/ticketSlice";
import { getCashierNames } from "../features/slices/cashierData";
import { getNetBalance } from "../features/slices/netBalance";
import { CircularProgress, Input } from "@mui/material";
import { SmartPlay } from "./svg/SmartPlay";
import { IoChevronBackOutline, IoReload } from "react-icons/io5";
import Result from "../ui/Result";
import { Jaguar } from "./svg/Jaguar";
import {
  GameData,
  Race,
  Entry,
  Market,
} from "../features/slices/RacingGameSlice";
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
import { updateUser } from "../features/slices/userSlice";

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
  width: "90%",
  margin: "auto",
  height: "78%",
  overflow: "auto",
  borderRadius: "5px",

  bgcolor: "background.paper",
  boxShadow: 24,
  p: 0,
};

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      className="w-full h-full overflow-auto"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// Add a console.log to track renders
const CashierOptionsComponent = React.memo(({
  open,
  handleClose,
}: CashierOptionsProps) => {
  console.log("CashierOptions rendering");

  const dispatch = useAppDispatch();
  // Optimize selectors by combining related state
  const { user, updateError, updateLoading } = useAppSelector((state) => ({
    user: state.user.user,
    updateError: state.user.updateError,
    updateLoading: state.user.updateLoading
  }));
  const cashierData = useAppSelector((state) => state.cashier);
  const summaryData = useAppSelector((state) => state.summary);
  const ticketList = useAppSelector((state) => state.ticket);
  const balanceState = useAppSelector((state) => state.balance);
  const gameResults = useAppSelector((state) => state.summary.eventResult);

  // Use useCallback for functions to prevent unnecessary re-renders

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [value, setValue] = React.useState(0);
  const [valueParent, setParent] = React.useState(0);
  const [gameNumber, setGameNumber] = React.useState();
  const [resultVisible, toggleResult] = React.useState(false);
  const [gameResult, setGameResult] = React.useState<GameData>();

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

  // State to control date picker visibility
  const [fromDatePickerOpen, setFromDatePickerOpen] = React.useState(false);
  const [toDatePickerOpen, setToDatePickerOpen] = React.useState(false);

  // Add state to track the position of the dragged modal
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  // Add ref for tracking if mouse is down
  const isDragging = React.useRef(false);
  // Add ref for tracking mouse offset from modal header
  const offset = React.useRef({ x: 0, y: 0 });
  // Add ref for the modal box
  const modalRef = React.useRef<HTMLDivElement>(null);
  // Add refs for the date picker inputs
  const fromDateInputRef = React.useRef<HTMLDivElement>(null);
  const toDateInputRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (user?.Cashier?.shopId) {
      dispatch(getCashierNames(user.Cashier.shopId));
      refreshNetBalance();
    }
  }, [dispatch, user?.Cashier?.shopId]);

  React.useEffect(() => {
    setErrorMessage(updateError || "");
  }, [updateError]);
  const handleFetchSummary = useCallback(() => {
    if (user?.Cashier) {
      dispatch(
        getSummaryData(
          from?.toISOString(),
          to?.toISOString(),
          user.Cashier.shopId,
          user.Cashier.id,
          user.Cashier.isSuperCashier || false
        )
      );
    }
  }, [dispatch, from, to, user?.Cashier]);
  const handleLoadEventResult = useCallback(() => {
    if (user?.Cashier?.shopId) {
      dispatch(
        getEventResult(
          from?.toISOString(),
          to?.toISOString(),
          gameNumber,
          user.Cashier.shopId
        )
      );
    }
  }, [dispatch, from, to, gameNumber, user?.Cashier?.shopId]);
  const getTicketList = useCallback(() => {
    if (user?.Cashier?.id) {
      dispatch(recallTickets([user.Cashier.id + ""]));
    }
  }, [dispatch, user?.Cashier?.id]);
  // Load data when the modal is opened
  React.useEffect(() => {
    if (open) {
      // Load summary data when modal opens
      handleFetchSummary();

      // If on the "Recall Bets" tab, load ticket list
      if (valueParent === 0 && value === 1) {
        getTicketList();
      }

      // If on the "Event Result Search" tab, load event results
      if (valueParent === 1) {
        handleLoadEventResult();
      }
    }
  }, [open, valueParent, value, handleFetchSummary, getTicketList, handleLoadEventResult]);

  // Set up drag handlers for the modal
  React.useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Check if click is on the header
      const header = document.querySelector(".cashier-options-header");
      if (header && header.contains(e.target as Node)) {
        isDragging.current = true;
        if (modalRef.current) {
          // Calculate the offset of the mouse within the element
          const rect = modalRef.current.getBoundingClientRect();
          offset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          };
        }
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        // Calculate new position
        const newX = e.clientX - offset.current.x;
        const newY = e.clientY - offset.current.y;
        setPosition({ x: newX, y: newY });
        e.preventDefault();
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    // Add event listeners
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Clean up event listeners
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const refreshNetBalance = useCallback(() => {
    if (user?.Cashier?.id && user?.Cashier?.shopId) {
      dispatch(
        getNetBalance(user.Cashier.id, user.Cashier.shopId)
      );
    }
  }, [dispatch, user?.Cashier?.id, user?.Cashier?.shopId]);

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
  const handleCashierChoose = useCallback((event: SelectChangeEvent) => {
    setCashier(event.target.value);

    if (event.target.value === "all") {
      setCashierName(cashierData.data?.map((item: any) => item.id));
    } else {
      setCashierName([event.target.value]);
    }
  }, [cashierData.data]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);

    // Load ticket list when "Recall Bets" tab is selected
    if (newValue === 1) {
      getTicketList();
    } else if (newValue === 0) {
      // Load summary data when "Cash summary" tab is selected
      handleFetchSummary();
    }
  };

  const handleParentTab = (event: React.SyntheticEvent, val: number) => {
    setParent(val);
    setValue(0);

    // Load appropriate data based on the selected parent tab
    if (val === 0) {
      // Load summary data when "Reports" tab is selected
      handleFetchSummary();
    } else if (val === 1) {
      // Load event results when "Event Result Search" tab is selected
      handleLoadEventResult();
    }
  };







  React.useEffect(() => {
    if (cashierData && cashierData.data) {
      const eb: any = { target: { value: "all", name: "event" } };
      handleCashierChoose(eb);
    }
  }, [cashierData, handleCashierChoose]);

  const printSummary = useCallback((item: CashierData) => {
    if (!user?.Cashier?.shopId) return;

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
      shopId: user.Cashier.shopId,
      isCopy: true,
    };

    printSummaryToBackend(dataToSend);
  }, [from, to, user?.Cashier?.shopId]);

  const handleSave = useCallback(() => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    } else if (user?.Cashier?.id) {
      // Proceed with saving the password
      setErrorMessage(""); // Clear any previous error message
      // ... handle saving the password logic here
      dispatch(
        updateUser(
          user.Cashier.id + "",
          currentPassword,
          confirmPassword
        )
      );
    }
  }, [newPassword, confirmPassword, currentPassword, dispatch, user?.Cashier?.id]);
  const printResult = useCallback((item: ResultData) => {
    let gameType = "";
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
      case "HarnessRacing":
        gameType = "HarnessRacing";
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
              .sort((a: string, b: string) => parseInt(a) - parseInt(b))
              .join(" ")
          : item.result.Race.Entries.map((results) => {
              return `${results.Draw}:${results.Name}`;
            }),
      Market:
        item.result.MarketResults.length > 0
          ? item.result.MarketResults.map((market) => {
              return `${market.MarketClassDescription}:${market.WinningSelections}`;
            })
          : "",
    };
    printResultToBackend(dataToSend);
  }, []);

  const printSelected = useCallback((item: Ticket) => {
    if (!user?.Cashier) return;

    const payload = {
      betslipId: item.id,
      shopId: user.Cashier.shopId,
      cashierCreateId: user.Cashier.id,
      isCopy: true,
    };

    printSelectedTickets(payload);
  }, [user?.Cashier]);

  const exportToExcel = useCallback((data: CashierData[] | null) => {
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
  }, [from, to]);

  return (
    <div>
      <Modal
      className=""
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            ...style,

          }}
          className='reedkas'
          ref={modalRef}
        >
          <div className="cashier-options-header  flex justify-between items-center p-2 bg-[#37b34a] cursor-default">
            <p className="text-white text-md">Cashier Options</p>
            <div
              onClick={handleClose}
              className="cursor-pointer hover:bg-white/20 opacity-70 transition-all duration-300 p-1 rounded-md "
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="options-content  bg-white p-6">
            <div
              className="flex items-center justify-end"
              style={{ justifyContent: "space-between" }}
            >
              {true && (
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
                  <div className="text-green-500 flex text-xl">
                    Cash Balance:{" "}
                    <p className="font-bold ">
                      Br.{"    "}
                      {balanceState.data && balanceState.data[0].netAmount}
                      .00
                    </p>
                  </div>
                )}
                <span
                  onClick={refreshNetBalance}
                  className="hover:opacity-50 transition-all"
                >
                  {/* {balanceState.loading ? (
                    <ProgressCircular />
                  ) : ( */}
                    <IoMdRefresh
                      className="text-green-600 pt-0 pb-0 pl-2 pr-2 border rounded-md ml-2 border-green-500"
                      size={36}
                    />
                  {/* )} */}
                </span>
              </div>
            </div>
            <Box sx={{ width: "100%" }} >
              <Box>
                <div className="flex mt-3 text-sm w-full justify-between  border-gray-200">
                  <div className="flex">
                    <div
                      className={`px-4 py-1 flex items-center cursor-pointer  rounded-t-sm font-light ${
                        valueParent === 0
                          ? "bg-green-600 text-gray-800"
                          : "bg-white text-gray-800 border-r border-l border-t border-green-300"
                      }`}
                      onClick={(e) => handleParentTab(e, 0)}
                    >
                      Reports
                    </div>
                    <div
                      className={`px-4 flex items-center max-w-fit py-1 cursor-pointer mx-1 rounded-t-sm font-light ${
                        valueParent === 1
                          ? "bg-green-600 text-gray-800"
                          : "bg-white text-gray-800 border-r border-l border-t border-green-300"
                      }`}
                      onClick={(e) => handleParentTab(e, 1)}
                    >
                      Event Result Search
                    </div>
                  </div>
                  <div
                    className={`px-4 py-1.5 flex items-center cursor-pointer mx-1 rounded-t-sm font-light ${
                      valueParent === 2
                        ? "bg-green-600 text-gray-800"
                        : "bg-white text-gray-800 border-r border-l border-t border-green-300"
                    }`}
                    onClick={(e) => handleParentTab(e, 2)}
                  >
                    Change Password
                  </div>
                </div>
              </Box>
              <div className="border border-green-300 bg-gradient-to-b from-green-200/5 to-white rounded-b-md">
                <CustomTabPanel value={valueParent} index={0}>
                  <Box
                    sx={{
                      borderBottom: 1,
                      p: 0,
                      m: 0,
                      borderColor: "divider",
                    }}
                  >
                    <div className="flex w-full ">
                      <div
                        className={`px-4 py-1 flex items-center cursor-pointer text-sm rounded-t-sm font-light ${
                          value === 0
                            ? "bg-green-600 text-gray-800"
                            : "bg-white text-gray-800 border-r border-l border-t border-green-300"
                        }`}
                        onClick={(e) => handleChange(e, 0)}
                      >
                        Cash summary
                      </div>
                      <div
                        className={`px-4 py-1 flex items-center cursor-pointer ml-1 text-sm  rounded-t-sm font-light ${
                          value === 1
                            ? "bg-green-600 text-gray-800"
                            : "bg-white text-gray-800 border-r border-l border-t border-green-300"
                        }`}
                        onClick={(e) => {
                          handleChange(e, 1);
                          getTicketList();
                        }}
                      >
                        Recall Bets
                      </div>
                    </div>
                  </Box>
                  <div className="border border-green-300 w-full p-4 rounded-b-md">
                    <div className="border bg-white rounded-sm">
                      {value === 0 && (
                        <div className="w-full">
                          <div id="date-picker-container" className="date-picker-form flex gap-4 p-2 px-4 items-end">
                            <div ref={fromDateInputRef}>
                              <p className="mb-1 text-sm font-md">From Date</p>
                              <div className="flex items-center relative">
                                <input
                                  type="text"
                                  value={
                                    from
                                      ? from.format("YYYY/MM/DD HH:mm:ss")
                                      : ""
                                  }
                                  className="border border-gray-200 font-light rounded-sm min-w-[400px] px-2 text-gray-400 text-sm py-0.5 w-full"
                                  readOnly
                                />
                                <div className="absolute right-0 rounded-r-sm flex items-center bg-gray-200 min-h-[95%] gap-1">
                                  <button
                                    className="text-gray-500 mx-0.5"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setFromDatePickerOpen(true);
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 text-green-500"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <rect
                                        x="3"
                                        y="4"
                                        width="18"
                                        height="18"
                                        rx="2"
                                        ry="2"
                                      ></rect>
                                      <line
                                        x1="16"
                                        y1="2"
                                        x2="16"
                                        y2="6"
                                      ></line>
                                      <line x1="8" y1="2" x2="8" y2="6"></line>
                                      <line
                                        x1="3"
                                        y1="10"
                                        x2="21"
                                        y2="10"
                                      ></line>
                                    </svg>
                                  </button>
                                  <button className="text-gray-500 mx-0.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 text-green-500"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                  </button>

                                </div>
                                {fromDatePickerOpen && (
                                  <div
                                    className="absolute z-50 bg-white shadow-lg rounded-md"
                                    style={{
                                      top: '100%',
                                      left: '0',
                                      width: '100%',
                                      marginTop: '2px',
                                      zIndex: 9999
                                    }}
                                  >
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <DatePicker
                                        open={fromDatePickerOpen}
                                        onClose={() => setFromDatePickerOpen(false)}
                                        value={from}
                                        onChange={(newValue) => {
                                          setFrom(newValue);
                                          setFromDatePickerOpen(false);
                                        }}
                                        format="YYYY/MM/DD HH:mm:ss"
                                        slots={{
                                          textField: () => null, // This hides the input field
                                        }}
                                        slotProps={{
                                          popper: {
                                            anchorEl: fromDateInputRef.current,
                                            placement: 'bottom-start',
                                            modifiers: [
                                              { name: 'preventOverflow', enabled: true },
                                              { name: 'flip', enabled: true }
                                            ]
                                          }
                                        }}
                                      />
                                    </LocalizationProvider>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div ref={toDateInputRef}>
                              <p className="mb-1 text-sm font-md ">To Date</p>
                              <div className="flex items-center relative">
                                <input
                                  type="text"
                                  value={
                                    to ? to.format("YYYY/MM/DD HH:mm:ss") : ""
                                  }
                                  className="border border-gray-200 font-light rounded-sm min-w-[400px] px-2 text-gray-400 text-sm py-0.5 w-full"
                                  readOnly
                                />
                                <div className="absolute right-0 rounded-r-sm flex items-center bg-gray-200 min-h-[95%] gap-1">
                                  <button
                                    className="text-gray-500 mx-0.5"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setToDatePickerOpen(true);
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 text-green-500"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <rect
                                        x="3"
                                        y="4"
                                        width="18"
                                        height="18"
                                        rx="2"
                                        ry="2"
                                      ></rect>
                                      <line
                                        x1="16"
                                        y1="2"
                                        x2="16"
                                        y2="6"
                                      ></line>
                                      <line x1="8" y1="2" x2="8" y2="6"></line>
                                      <line
                                        x1="3"
                                        y1="10"
                                        x2="21"
                                        y2="10"
                                      ></line>
                                    </svg>
                                  </button>
                                  <button className="text-gray-500 mx-0.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 text-green-500"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                  </button>
                                </div>
                                {toDatePickerOpen && (
                                  <div
                                    className="absolute z-50 bg-white shadow-lg rounded-md"
                                    style={{
                                      top: '100%',
                                      left: '0',
                                      width: '100%',
                                      marginTop: '2px',
                                      zIndex: 9999
                                    }}
                                  >
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <DatePicker
                                        open={toDatePickerOpen}
                                        onClose={() => setToDatePickerOpen(false)}
                                        value={to}
                                        onChange={(newValue) => {
                                          setTo(newValue);
                                          setToDatePickerOpen(false);
                                        }}
                                        format="YYYY/MM/DD HH:mm:ss"
                                        slots={{
                                          textField: () => null, // This hides the input field
                                        }}
                                        slotProps={{
                                          popper: {
                                            anchorEl: toDateInputRef.current,
                                            placement: 'bottom-start',
                                            modifiers: [
                                              { name: 'preventOverflow', enabled: true },
                                              { name: 'flip', enabled: true }
                                            ]
                                          }
                                        }}
                                      />
                                    </LocalizationProvider>
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* <div>
                          <p className="mb-0 text-sm font-bold">Event Number</p>
                          <input
                            value={gameNumber}
                            onChange={(e) => setGameNumber(e.target.value)}
                            maxLength={20}
                            type="text"
                            className="p-2 w-full mt-3 border border-slate-500 bg-white rounded-md"
                            placeholder="Event number"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleLoadEventResult();
                              }
                            }}
                            // ref={myInputRef}
                          />
                        </div> */}
                          </div>
                          <br />
                          <div className="flex p-2 px-4">
                            <button
                              onClick={handleFetchSummary}
                              className="py-1 px-2 text-sm bg-white border border-green-600 rounded-sm text-gray-600 flex items-center gap-0.5"
                            >
                              <span className="flex items-center justify-center w-5 h-5">
                                <IoReload
                                  className="text-green-600"
                                  size={14}
                                />
                              </span>
                              Refresh
                            </button>
                          </div>

                          <div className="mt-4 border-green-100 pt-2 overflow-y-auto max-h-[400px]">
                            <div className="w-full">
                              <div className="report-header flex px-2 justify-end mb-2">
                                <p className="text-sm text-gray-700">
                                  Report Date:{" "}
                                  {new Date().toLocaleDateString("en-GB")}{" "}
                                  {new Date().toLocaleTimeString("en-GB", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  })}
                                </p>
                              </div>

                              <table className="w-full text-xs">
                                <thead className="hover:bg-gray-100">
                                  <tr className="text-left border-b  border-gray-200">

                                    <th className="py-2 font-normal pl-14">
                                    </th>
                                    <th className="py-2 font-normal ">
                                      Retail User
                                    </th>
                                    <th className="py-2 font-normal">
                                      <div className="flex items-center gap-1">
                                        From Date
                                        <span className="text-green-600">
                                          ↓
                                        </span>
                                      </div>
                                    </th>
                                    <th className="py-2 font-normal">
                                      To Date
                                    </th>
                                    <th className="py-2 font-normal">
                                      Start Balance
                                    </th>
                                    <th className="py-2 font-normal">
                                      Deposits
                                    </th>
                                    <th className="py-2 font-normal">Bets</th>
                                    <th className="py-2 font-normal">
                                      Cancellations
                                    </th>
                                    <th className="py-2 font-normal">
                                      Redeemed
                                    </th>
                                    <th className="py-2 font-normal">
                                      Withdraws
                                    </th>
                                    <th className="py-2 font-normal">
                                      End Balance
                                    </th>

                                  </tr>
                                </thead>
                                <tbody>
                                  {summaryData.data &&
                                  summaryData.data.length > 0 ? (
                                    summaryData.data
                                      .filter((item) => item["Cashier.User.username"] != null && item["Cashier.User.username"] !== "")
                                      .map((item, index) => (
                                      <tr
                                        key={index}
                                        className={
                                          index % 2 === 0
                                            ? "bg-white hover:bg-gray-200"
                                            : "bg-gray-50"
                                        }
                                      >
                                         <td className="py-2  pl-5 px-1">
                                          <button
                                            onClick={() => printSummary(item)}
                                            className="text-green-600 border border-green-600 rounded-sm p-2 px-4  hover:text-green-800"
                                          >
                                            <FaPrint size={20} />
                                          </button>
                                        </td>
                                        <td className="py-2 px-1">
                                          {item["Cashier.User.username"]}
                                        </td>
                                        <td className="py-2 px-1">
                                          {from?.toDate().toDateString()}
                                        </td>
                                        <td className="py-2 px-1">
                                          {to?.toDate().toDateString()}
                                        </td>
                                        <td className="py-2 px-1">Br. 0.00</td>
                                        <td className="py-2 px-1">Br. 0.00</td>
                                        <td className="py-2 px-1">
                                          Br.{" "}
                                          {parseFloat(item.totalBets).toFixed(
                                            2
                                          )}
                                        </td>
                                        <td className="py-2 px-1">
                                          Br.{" "}
                                          {parseFloat(
                                            item.totalCancelAmount
                                          ).toFixed(2)}
                                        </td>
                                        <td className="py-2 px-1">
                                          Br.{" "}
                                          {parseFloat(
                                            item.totalRedeemAmount
                                          ).toFixed(2)}
                                        </td>
                                        <td className="py-2 px-1">Br. 0.00</td>
                                        <td className="py-2 px-1">
                                          Br.{" "}
                                          {parseFloat(item.netAmount).toFixed(
                                            2
                                          )}
                                        </td>

                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td
                                        colSpan={11}
                                        className="py-4 text-center text-gray-500"
                                      >
                                        No data available
                                      </td>
                                    </tr>
                                  )}
                                  {/* {summaryData.data &&
                                    summaryData.data.length > 0 && (
                                      <tr className="font-semibold border-t border-gray-300">
                                        <td
                                          colSpan={9}
                                          className="py-2 text-right pr-4"
                                        >
                                          Total End Balance:
                                        </td>
                                        <td colSpan={2} className="py-2">
                                          Br.{" "}
                                          {summaryData.data
                                            .reduce(
                                              (total, item) =>
                                                total +
                                                parseFloat(item.netAmount),
                                              0
                                            )
                                            .toFixed(2)}
                                        </td>
                                      </tr>
                                    )} */}
                                </tbody>
                              </table>

                              {summaryData.data &&
                                summaryData.data.length > 0 && (
                                  <div className="mt-4 border-t border-green-100 pt-2 flex justify-between items-center">
                                    <div className="flex items-center">
                                      <button className="w-6 h-6 flex items-center justify-center mx-1 text-gray-500">
                                        «
                                      </button>
                                      <button className="w-6 h-6 flex items-center justify-center mx-1 text-gray-500">
                                        ‹
                                      </button>
                                      <button className="w-6 h-6 flex items-center justify-center mx-1 text-green-600 font-semibold">
                                        1
                                      </button>
                                      <button className="w-6 h-6 flex items-center justify-center mx-1 text-gray-500">
                                        ›
                                      </button>
                                      <button className="w-6 h-6 flex items-center justify-center mx-1 text-gray-500">
                                        »
                                      </button>

                                      <div className="ml-2 flex items-center">
                                        <select className="border border-gray-300 rounded-md p-1 text-sm">
                                          <option>10</option>
                                          <option>25</option>
                                          <option>50</option>
                                        </select>
                                        <span className="ml-2 text-sm">
                                          items per page
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center">
                                      <span className="text-sm">
                                        Showing {summaryData.data.length} items
                                      </span>
                                      <button
                                        onClick={handleFetchSummary}
                                        className="ml-2 w-6 h-6 flex items-center justify-center border border-gray-300 rounded-md"
                                      >
                                        <IoReload size={14} />
                                      </button>
                                    </div>
                                  </div>
                                )}

                              {(!summaryData.data ||
                                summaryData.data.length === 0) &&
                                !summaryData.loading && (
                                  <div className="mt-4 border-t border-green-100 pt-2 flex justify-between items-center">
                                    <div className="flex items-center opacity-50">
                                      <button
                                        disabled
                                        className="w-6 h-6 flex items-center justify-center mx-1 text-gray-400"
                                      >
                                        «
                                      </button>
                                      <button
                                        disabled
                                        className="w-6 h-6 flex items-center justify-center mx-1 text-gray-400"
                                      >
                                        ‹
                                      </button>
                                      <button
                                        disabled
                                        className="w-6 h-6 flex items-center justify-center mx-1 text-green-600 font-semibold"
                                      >
                                        0
                                      </button>
                                      <button
                                        disabled
                                        className="w-6 h-6 flex items-center justify-center mx-1 text-gray-400"
                                      >
                                        ›
                                      </button>
                                      <button
                                        disabled
                                        className="w-6 h-6 flex items-center justify-center mx-1 text-gray-400"
                                      >
                                        »
                                      </button>

                                      <div className="ml-2 flex items-center">
                                        <select
                                          disabled
                                          className="border border-gray-300 rounded-md p-1 text-sm"
                                        >
                                          <option>10</option>
                                          <option>25</option>
                                          <option>50</option>
                                        </select>
                                        <span className="ml-2 text-sm">
                                          items per page
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center">
                                      <span className="text-sm">
                                        No items to display
                                      </span>
                                      <button
                                        onClick={handleFetchSummary}
                                        className="ml-2 w-6 h-6 flex items-center justify-center text-green-500 rounded-md"
                                      >
                                        <IoReload size={14} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>

                          {/* {summaryData.loading && (
                            <div className="w-full flex items-center p-4 justify-center">
                              <ProgressCircular />
                            </div>
                          )} */}
                          {summaryData.error !== null && (
                            <FormStatus
                              type="error"
                              content={summaryData.error}
                            />
                          )}
                        </div>
                      )}

                      {value === 1 && (
                        <div className="w-full">
                          <div className="p-3">
                            <div className="font-normal mb-2">
                              Retail User
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="select-container w-full mb-2">
                                <div className="relative min-w-fit max-w-[400px] text-gray-600">
                                  <select className="w-full py-0.5 text-sm  pl-3 pr-10 bg-gray-200 appearance-none border border-gray-300 rounded text-gray-600 focus:outline-none focus:border-green-500">
                                    <option>
                                      {user?.username || ""} ({user?.username || ""})
                                    </option>
                                    {/* {cashierState.data?.map((item) => {
                                      return (
                                        <option key={item.id} value={item.id}>
                                          {item.User.username.toLowerCase()} (
                                          {item.User.username})
                                        </option>
                                      );
                                    })} */}
                                  </select>
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg
                                      className="w-7 h-7 text-green-600"
                                      fill="#09b517"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M7 10l5 5 5-5z"/>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={getTicketList}
                              className="py-1 px-2 bg-white text-green-600 border border-green-500 rounded hover:bg-green-50 transition-colors flex items-center gap-1"
                            >
                              <IoMdRefresh className="text-green-600" size={14} />
                              <span className="text-sm">Refresh</span>
                            </button>
                          </div>

                          {/* {ticketList.loading && (
                            <div className="w-full flex items-center p-4 justify-center">
                              <ProgressCircular />
                            </div>
                          )} */}
                          {!ticketList.loading &&
                            ticketList.data.length < 1 && (
                              <div className="w-full text-center p-4 mt-4">
                                No Tickets found
                              </div>
                            )}
                          {!ticketList.loading &&
                            ticketList.data.length > 0 && (
                              <div className="w-full mt-0 overflow-y-auto max-h-[400px]">
                                <table className="w-full text-sm">
                                  <thead className="bg-white ">
                                    <tr className="text-left">
                                      <th className="py-1 px-3 font-normal text-gray-600">
                                        Retail User
                                      </th>
                                      <th className="py-1 px-3 font-normal text-gray-600">
                                        <div className="flex items-center gap-1">
                                          Date
                                          <span className="text-green-600 text-xs">
                                            ↓
                                          </span>
                                        </div>
                                      </th>
                                      <th className="py-1 px-3 font-normal text-gray-600">
                                        Stake
                                      </th>
                                      <th className="py-1 px-3 font-normal text-gray-600">
                                        Description
                                      </th>
                                      <th className="py-1 px-3 font-normal text-gray-600"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {ticketList.data.map((item) => {
                                      return (
                                        <tr
                                          key={item.id}
                                          className="even:bg-gray-50 odd:bg-white border-b"
                                        >
                                          <td className="py-2 px-3">
                                            {item.Cashier &&
                                              item.Cashier.User.username}
                                          </td>
                                          <td className="py-2 px-3">
                                            {`${new Date(
                                              item.createdAt
                                            ).getFullYear()}/${
                                              new Date(item.createdAt).getMonth() + 1
                                            }/${new Date(
                                              item.createdAt
                                            ).getDate()} ${new Date(
                                              item.createdAt
                                            ).toLocaleTimeString("en-US", {
                                              hour12: false,
                                            })}`}
                                          </td>
                                          <td className="py-2 px-3">
                                            {parseFloat(
                                              item.totalStake
                                            ).toFixed(2)}{" "}
                                            Br
                                          </td>
                                          <td className="py-2 px-3">
                                            {item.description}
                                          </td>
                                          <td className="py-2 px-3 text-center">
                                            <button
                                              onClick={() =>
                                                printSelected(item)
                                              }
                                              className="text-green-600 hover:text-green-500"
                                            >
                                              <FaPrint size={16} />
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </CustomTabPanel>
              </div>
              {valueParent === 1 && (
                <div className="border border-green-300 bg-gradient-to-b p-3 from-green-200/5 to-white rounded-b-md">
                  <div className="border">
                {resultVisible && gameResults && gameResult && (
                    <div className="right-flex pl-3 pr-3 w-full flex-grow ml-2 overflow-y-auto max-h-[500px]">
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
                        <Result
                          Icon={gameTypeSelector(gameResult.gameType)}
                          isSmall={true}
                          gameData={gameResult.result}
                          gameType={gameResult.gameType}
                        />
                      ) : gameResult.gameType === "SpinAndWin" ? (
                        <ResultforSpin gameData={gameResult.result} />
                      ) : (
                        ""
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

                {!resultVisible && (
                    <div className="w-full ">
                      <div className="flex flex-col bg-white rounded-sm ">
                        <div className="flex gap-5 mb-4 p-1 px-2">
                          <div className="flex flex-col">
                            <div className="mb-1 text-sm font-semibold">From Date</div>
                            <div className="flex items-center relative">
                              <input
                                type="text"
                                value={from ? from.format("YYYY/MM/DD HH:mm:ss") : ""}
                                className="border border-gray-300 rounded-sm w-[240px] px-2  text-sm py-1"
                                readOnly
                              />
                              <div className="absolute right-0 rounded-r-sm flex items-center bg-gray-200 h-full px-2">
                                <button
                                  className="text-gray-500 mx-0.5"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const datePickerElement = document.getElementById('from-date-picker');
                                    if (datePickerElement) {
                                      const inputElement = datePickerElement.querySelector('input');
                                      if (inputElement) {
                                        inputElement.click();
                                      }
                                    }
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-green-500"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                  </svg>
                                </button>
                                <button className="text-gray-500 mx-0.5">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-green-500"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                  </svg>
                                </button>
                              </div>
                              <div className="absolute opacity-0 pointer-events-auto" id="from-date-picker">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DatePicker
                                    value={from}
                                    onChange={(newValue) => setFrom(newValue)}
                                    format="YYYY/MM/DD HH:mm:ss"
                                    slotProps={{ textField: { size: 'small' } }}
                                  />
                                </LocalizationProvider>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <div className="mb-1 text-sm font-semibold">To Date</div>
                            <div className="flex items-center relative">
                              <input
                                type="text"
                                value={to ? to.format("YYYY/MM/DD HH:mm:ss") : ""}
                                className="border border-gray-300 rounded-sm w-[240px] px-2  text-sm py-1"
                                readOnly
                              />
                              <div className="absolute right-0 rounded-r-sm flex items-center bg-gray-200 h-full px-2">
                                <button
                                  className="text-gray-500 mx-0.5"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const datePickerElement = document.getElementById('to-date-picker');
                                    if (datePickerElement) {
                                      const inputElement = datePickerElement.querySelector('input');
                                      if (inputElement) {
                                        inputElement.click();
                                      }
                                    }
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-green-500"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                  </svg>
                                </button>
                                <button className="text-gray-500 mx-0.5">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-green-500"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                  </svg>
                                </button>
                              </div>
                              <div className="absolute opacity-0 pointer-events-auto" id="to-date-picker">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DatePicker
                                    value={to}
                                    onChange={(newValue) => setTo(newValue)}
                                    format="YYYY/MM/DD HH:mm:ss"
                                    slotProps={{ textField: { size: 'small' } }}
                                  />
                                </LocalizationProvider>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <div className="mb-1 text-sm font-semibold">Event No</div>
                          <input
                              type="text"
                            value={gameNumber}
                            onChange={(e) => setGameNumber(e.target.value)}
                              className="border border-gray-300 rounded-sm w-[240px] px-2 text-gray-600 text-sm py-1"
                              placeholder="Event No"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleLoadEventResult();
                              }
                            }}
                          />
                        </div>
                      </div>

                        <div className="flex gap-2 mb-4 p-1 px-2">
                        <button
                          onClick={handleLoadEventResult}
                            className="py-1 px-2 bg-white flex items-center gap-1 border border-green-500 text-green-500 rounded-sm hover:bg-green-50 transition-colors"
                          >
                            <IoMdRefresh size={14} />
                            <span className="text-sm font-normal">Refresh</span>
                        </button>

                          <button
                            onClick={() => exportToExcel(summaryData.data)}
                            className="py-1 px-2 bg-white flex items-center gap-1 border border-green-500 text-green-500 rounded-sm hover:bg-green-50 transition-colors"
                            disabled={!summaryData.data || summaryData.data.length === 0}
                          >
                            <FaRegFileLines size={14} />
                            <span className="text-sm font-normal">Export To Excel</span>
                          </button>
                      </div>
{/*
                      {summaryData.loading && (
                        <div className="w-full flex items-center p-4 justify-center">
                          <ProgressCircular />
                        </div>
                      )} */}

                      {/* {summaryData.error !== null && (
                        <FormStatus type="error" content={summaryData.error} />
                      )} */}

                      {gameResults && gameResults.length < 0 && (
                        <div className="w-full text-center p-4 mt-4">
                            No events found
                        </div>
                      )}

                        {!resultVisible && gameResults && gameResults.length > 0 && (
                          <div className="w-full mt-4 overflow-y-auto max-h-[400px]">
                            <table className="w-full text-sm border-collapse">
                              <thead>
                                <tr className="text-left  hover:bg-gray-300">
                                  <th className="py-2 px-3 pl-10 font-normal justify-between flex  text-gray-600">Game
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path d="M19 5H5L12 13.4L19 5Z" fill="green"/>
<path d="M12 13.4L19 5H5L12 13.4ZM12 13.4V19" stroke="green" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg></th>
                                  <th className="py-2 px-3 font-normal text-gray-600 "><div className="flex justify-between min-w-fit"> Feed ID
                                     <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path d="M19 5H5L12 13.4L19 5Z" fill="green"/>
<path d="M12 13.4L19 5H5L12 13.4ZM12 13.4V19" stroke="green" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg></div></th>
                                  <th className="py-2 px-3 font-normal text-gray-600"><div className="flex justify-between">Event No  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
<path d="M19 5H5L12 13.4L19 5Z" fill="green"/>
<path d="M12 13.4L19 5H5L12 13.4ZM12 13.4V19" stroke="green" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg></div></th>
                                  <th className="py-2 px-3 font-normal text-gray-600">
                                    <div className="flex items-center gap-1">
                                      Date
                                      <span className="text-green-600">↓</span>
                                    </div>
                                  </th>
                                  <th className="py-2 px-3 font-normal text-gray-600 text-center" style={{ width: "80px" }}></th>
                                </tr>
                              </thead>
                              <tbody>
                                {gameResults.map((item) => (
                                  <tr key={item.id} className="even:bg-gray-100  hover:bg-gray-300 odd:bg-white font-light text-gray-400  overflow-y-auto ">
                                    <td className="py-3 pl-10 border-l ">{item.gameType}</td>
                                    <td className="py-2 px-3 border-l ">{item?.gameData?.FeedId || "-"}</td>
                                    <td className="py-2 px-3 border-l ">
                                      {item.gameData?.Number || item.gamenumber}
                                    </td>
                                    <td className="py-2 px-3 max-w-fit border-l ">
                                      {moment(item.startTime).format("YYYY/MM/DD HH:mm:ss")}
                                    </td>
                                    <td className="py-2 px-1 text-start -pl-10 min-w-[200px] flex items-start justify-start gap-3">
                                      <button
                                              onClick={() => {
                                                toggleResult(true);
                                                setGameResult(item);
                                              }}
                                        className="text-green-500 p-1 border-green-500 border px-5 p-2 hover:bg-green-50 rounded"
                                      >
                                        <FaEye size={16} />
                                      </button>
                                      <button
                                              onClick={() =>
                                                printResult({
                                                  result: item.result as any,
                                                  cashierName: user?.username + "",
                                                  shopName:
                                                    cashierData.data && cashierData.data.length > 0
                                                      ? cashierData.data[0].Shop?.name + ""
                                                      : "",
                                                  gameTime: item.startTime,
                                                  eventId: item.gamenumber?.toString() || "",
                                                  Game: item.gameType,
                                                  formattedTime: moment(item.startTime).format("YYYY/MM/DD HH:mm:ss"),
                                                  date: moment(item.startTime).toDate().toDateString(),
                                                })
                                              }
                                        className="text-green-500 border-green-500  border px-5 p-2 hover:bg-green-50 rounded"
                                      >
                                        <FaPrint size={16} />
                                      </button>
                                        </td>
                                      </tr>
                                ))}
                              </tbody>
                            </table>

                            <div className="flex justify-between items-center mt-4 text-sm">
                              <div className="flex items-center">
                                <button className="w-6 h-6 flex items-center justify-center text-gray-500">«</button>
                                <button className="w-6 h-6 flex items-center justify-center text-gray-500">‹</button>
                                <button className="w-6 h-6 flex items-center justify-center text-green-600 font-semibold">1</button>
                                <button className="w-6 h-6 flex items-center justify-center text-gray-500">›</button>
                                <button className="w-6 h-6 flex items-center justify-center text-gray-500">»</button>

                                <select className="ml-2 border border-gray-300 rounded px-1 py-0.5 text-xs">
                                  <option>10</option>
                                  <option>20</option>
                                  <option>50</option>
                                </select>
                                <span className="ml-1">items per page</span>
                          </div>

                              <div className="text-sm">
                                1 - 10 of {gameResults ? gameResults.length : 0} items
                        <button
                                  onClick={handleLoadEventResult}
                                  className="ml-2 w-6 h-6 border border-gray-300 rounded flex items-center justify-center"
                        >
                                  <IoReload size={12} />
                        </button>
                      </div>
                            </div>
                        </div>
                      )}

                        {!resultVisible && (!gameResults || gameResults.length === 0) && !summaryData.loading && (
                        <div className="w-full text-center p-4 mt-4">
                            No events found
                        </div>
                      )}
                                      </div>
                        </div>
                      )}
                     </div>
                  </div>
                )}
              <CustomTabPanel value={valueParent} index={2}>
                <div style={{ width: "30%" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      marginBottom: "1%",
                    }}
                  >
                    <p style={{ width: "50%" }}>Current Password</p>
                    <input
                      type="password"
                      placeholder="Current password"
                      style={{ border: "1px solid #ccc" }}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      marginBottom: "1%",
                    }}
                  >
                    <p style={{ width: "50%" }}>New Password</p>
                    <input
                      type="password"
                      placeholder="New password"
                      style={{ border: "1px solid #ccc" }}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      marginBottom: "1%",
                    }}
                  >
                    <p style={{ width: "50%" }}>Confirm Password</p>
                    <input
                      type="password"
                      placeholder="Confirm password"
                      style={{ border: "1px solid #ccc" }}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  {errorMessage && (
                    <div style={{ color: "red", marginBottom: "1%" }}>
                      {errorMessage}
                    </div>
                  )}

                  <button
                    onClick={handleSave}
                    className="p-2 text-sm bg-green-600 rounded-md text-white flex items-center gap-2"
                  >
                    {updateLoading ? (
                      <>
                        <SmallProgressCircular /> Loading...
                      </>
                    ) : (
                      "Update Password"
                    )}
                    <span></span>
                  </button>
                </div>
              </CustomTabPanel>
            </Box>
          </div>
        </Box>
      </Modal>
    </div>
  );
});

export default CashierOptionsComponent;
