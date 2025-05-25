import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { MdOutlineCancel, MdOutlineKeyboardBackspace } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  getTicketsToCancel,
  getTicketsToRedeem,
} from "../features/slices/betData";
import ProgressCircular from "./ProgressCircular";
import FormStatus from "./FormStatus";
import BetSlipTable from "./BetSlipTable";
import { CheckCircle } from "@mui/icons-material";
import { BsXCircle } from "react-icons/bs";

interface RedeemTicketProps {
  open: boolean;
  type: string;
  handleClose: () => void;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  margin: "auto",
  minHeight: "500px", // Initial height for header
  maxHeight: "700px",
  overflow: "hidden", // Changed from auto to hidden for animation
  borderRadius: "5px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 0,
};

export default function RedeemTicket({
  open,
  handleClose,
  type,
}: RedeemTicketProps) {
  const dispatch = useAppDispatch();
  const [betslip, setSlip] = useState("");
  const [eventType, toggleEvent] = useState("change");
  const userData = useAppSelector((state) => state.user);
  const betSlipData = useAppSelector((state) => state.betData);
  const myInputRef = useRef<HTMLInputElement>(null);

  const handleInput = (input: number | string | null, action: string) => {
    if (action === "add" && typeof input === "number" && betslip.length <= 20) {
      setSlip((prevEl) => prevEl + input.toString());
    } else if (action === "add" && input === "L" && betslip.length <= 20) {
      setSlip((prevEl) => prevEl + "L");
    }

    if (action === "remove") {
      const values = betslip.split("");
      values.pop();
      let newVal = values.join("");
      setSlip(newVal);
    }

    if (action === "removeAll") {
      setSlip("");
    }
  };

  const handleEnter = () => {
    if (betslip === "") {
      return;
    }

    if (type === "cancel") {
      dispatch(getTicketsToCancel(parseInt(betslip)));
    } else {
      dispatch(
        getTicketsToRedeem(
          parseInt(betslip),
          userData.user?.Cashier.shopId + ""
        )
      );
    }

    setSlip("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSlip(event.target.value.replace("*", ""));
    toggleEvent(event.type);
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (myInputRef.current) {
          myInputRef.current.focus();
        }
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (eventType === "change") return;

      if (!isNaN(parseInt(event.key))) {
        setSlip((prevValue) => prevValue + event.key);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div>
      <Modal
        onTransitionEnter={() => {
          myInputRef.current?.focus();
        }}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="reedem-open-animation">
          <div className="cashier-options-header flex justify-between items-center p-2 bg-[#37b34a] rounded-tl-sm rounded-tr-sm">
            <p className="text-white font-light text-md ">
              {type === "redeem" ? "Redeem Betslip" : "Cancel Betslip"}
            </p>
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
          <div className="options-content w-full bg-white p-6  overflow-y-auto" style={{ maxHeight: "440px" }}>
          {betSlipData.message && betSlipData.message !== "success" && (
                  <div className="w-full p-0 flex items-start justify-center">
                  <div className="w-full flex items-center justify-between p-2 bg-green-600 rounded-md">
                    <div className="flex gap-1">
                    <CheckCircle className="text-white border-white bg-transparent" />
                    <p className="text-white ml-2">{betSlipData.message}</p>
                    </div>
                    <BsXCircle/>
                  </div>
                  </div>
                )}
            <Box>
              <div className="flex">
                <div className="w-1/3">
                  <div className="w-full">
                    <p className="text-green-500">Enter betslip code or scan</p>
                    <input
                      value={betslip}
                      onChange={handleChange}
                      maxLength={20}
                      type="text"
                      className="p-2 w-full mt-3 border border-slate-500 bg-white rounded-md"
                      ref={myInputRef}
                    />
                  </div>

                  {/* Custom Number Pad */}
                  <div className="mt-4">
                    <div className="grid grid-cols-3 gap-2">
                      {/* First row */}
                      {[1, 2, 3].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleInput(num, "add")}
                          className="p-2 text-center bg-green-500 text-white rounded-md"
                        >
                          {num}
                        </button>
                      ))}

                      {/* Second row */}
                      {[4, 5, 6].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleInput(num, "add")}
                          className="p-2 text-center bg-green-500 text-white rounded-md"
                        >
                          {num}
                        </button>
                      ))}

                      {/* Third row */}
                      {[7, 8, 9].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleInput(num, "add")}
                          className="p-2 text-center bg-green-500 text-white rounded-md"
                        >
                          {num}
                        </button>
                      ))}

                      {/* Fourth row */}
                      <button
                        onClick={() => handleInput("L", "add")}
                        className="p-2 text-center bg-green-500 text-white rounded-md"
                      >
                        L
                      </button>
                      <button
                        onClick={() => handleInput(0, "add")}
                        className="p-2 text-center bg-green-500 text-white rounded-md"
                      >
                        0
                      </button>
                      <button
                        onClick={() => handleInput(null, "remove")}
                        className="p-2 flex items-center justify-center text-center bg-green-500 text-white rounded-md"
                      >
                        <MdOutlineKeyboardBackspace size={24} />
                      </button>
                    </div>

                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => handleInput(null, "removeAll")}
                        className="px-4 py-2 bg-slate-200 rounded-md"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleEnter}
                        className="px-4 py-2 bg-green-500 text-white rounded-md"
                      >
                        Enter
                      </button>
                    </div>
                  </div>
                </div>
                {betSlipData.loading && (
                  <div className="w-full flex items-center justify-center">
                    <ProgressCircular />
                  </div>
                )}
                {betSlipData.error && (
                  <div className="w-3/4 p-0 flex items-start justify-center">
                    <p className="text-gray-600">{betSlipData.error}</p>
                  </div>
                )}
               
                {!betSlipData.loading && betSlipData.data && (
                  <BetSlipTable data={betSlipData.data} type={type} />
                )}
              </div>
            </Box>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
