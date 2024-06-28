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

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MdOutlineCancel } from "react-icons/md";
import { IoMdRefresh } from "react-icons/io";
import { FaPrint } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  CashierData,
  getSummaryData,
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
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "86%",
  margin: "auto",
  height: "660px",
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
  const summaryData = useAppSelector((state) => state.summary);
  const ticketList = useAppSelector((state) => state.ticket);
  const balanceState = useAppSelector((state) => state.balance);
  const [value, setValue] = React.useState(0);
  const [valueParent, setParent] = React.useState(0);
  const [to, setTo] = React.useState<Dayjs | null>(
    dayjs(new Date().toDateString())
  );
  const [from, setFrom] = React.useState<Dayjs | null>(
    dayjs(new Date().toDateString())
  );
  const [cashierName, setCashierName] = React.useState<string[] | undefined>(
    []
  );
  const [cashierNameVal, setCashier] = React.useState("");
  const cashierState = useAppSelector((state) => state.cashier);

  React.useEffect(() => {
    dispatch(getCashierNames(userData.user?.Cashier.shopId));
    dispatch(getNetBalance(userData.user?.Cashier.shopId));
  }, []);

  const refreshNetBalance = () => {
    dispatch(getNetBalance(userData.user?.Cashier.shopId));
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

  const getTicketList = () => {
    dispatch(recallTickets(cashierName));
  };

  React.useEffect(() => {
    getTicketList();
    console.log(cashierName);
  }, [cashierName]);

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
      isCopy: true
    };

    printSummaryToBackend(dataToSend);
  };

  const printSelected = (item: Ticket) => {
    const payload = {
      betslipId: item.betSlipId,
      shopId: userData.user?.Cashier.shopId,
      cashierCreateId: userData.user?.Cashier.id
    };

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
            <div className="flex items-center justify-end">
              {!balanceState.loading && (
                <div className="text-green-500 text-lg">
                  {cashierState.data &&
                    cashierState.data[0] &&
                    `Credit Balance: Br. ${cashierState.data[0].Shop?.depositBalance} | `}{" "}
                  Balance: Br.{"    "}
                  {balanceState.data &&
                    parseInt(balanceState.data[0].netAmount) > 0
                    ? balanceState.data[0].netAmount
                    : 0}
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
                <div className="border mt-4 border-green-500 w-full rounded-md">
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
                              <table className="w-full table table-fixed">
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
                            <table className="w-full table table-fixed">
                              <thead className="border-2">
                                <tr className="text-sm text-left p-4 table-row">
                                  <th className="p-2">Game Number</th>
                                  <th className="p-2">Retail User</th>
                                  <th className="p-2">Player Numbers</th>
                                  <th className="p-2">Net Stake</th>
                                  <th className="p-2">Win</th>
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
                                      <td className="border border-l-slate-400 p-3">
                                        {item.Game.gamenumber}
                                      </td>
                                      <td className="border border-l-slate-400 p-2">
                                        {item.BetSlip.Cashier.User.username}
                                      </td>
                                      <td className="border border-l-slate-400 p-2">
                                        {item.nums &&
                                          !item.nums.includes(-2) &&
                                          !item.nums.includes(-4) &&
                                          !item.nums.includes(-6) &&
                                          item?.nums}
                                        {item.nums.includes(-2) && "Heads"}
                                        {item.nums.includes(-4) && "Evens"}
                                        {item.nums.includes(-6) && "Tails"}
                                      </td>
                                      <td className="border border-l-slate-400 p-2">
                                        {parseFloat(item.stake).toFixed(2)} Br
                                      </td>
                                      <td className="border border-l-slate-400 p-2">
                                        {item.win ? item.win.toFixed(2) : 0.0}{" "}
                                        Br.
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
                    <div>Events Here</div>
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
