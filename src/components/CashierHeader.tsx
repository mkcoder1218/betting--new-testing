import { GiConfirmed } from "react-icons/gi";
import { TiCancel } from "react-icons/ti";
import { TfiMoney } from "react-icons/tfi";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { useEffect, useState } from "react";
import { logoutUser } from "../features/slices/userSlice";
import { clearBetData } from "../features/slices/betData";

interface CashierHeaderOptions {
    handleOpen: () => void;
    handleRedeemOpen: () => void;
    handleCancelRedeem: (val: string) => void
}

export default function CashierHeader({ handleOpen, handleRedeemOpen, handleCancelRedeem }: CashierHeaderOptions) {
    const userData = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timerID = setInterval(() => tick(), 1000);
        return () => {
            clearInterval(timerID);
        };
    }, []);

    function tick() {
        setDate(new Date());
    }

    const logout = () => {
        dispatch(logoutUser());
    }

    const openCancelRedeem = (val: string) => {
        handleCancelRedeem(val);
        handleRedeemOpen();
        dispatch(clearBetData());
    }

    return (
      <div className="header-container bg-white items-start pl-4 pr-4 flex justify-between">
        <div className="text-xl font-thin font-sans pt-1 text-green-500 text-nowrap -mt-2 ">
          Retail Logo
        </div>
        <div className="flex gap-2 justify-center w-full p-2 pb-0">
          <button
            style={{ backgroundColor: "#37B34A", borderRadius: "3px" }}
            onClick={handleOpen}
            className="p-2 min-w-28 max-h-8 flex justify-center font-light items-center text-white rounded-sm"
          >
            Cashier Options
          </button>
          <button
            onClick={() => openCancelRedeem("cancel")}
            style={{ borderRadius: "3px" }}
            className="my-cancel-btn min-w-28 max-h-8 justify-center flex items-center gap-1 text-white rounded-sm"
          >
            <span className="pl-2">Cancel</span>
            <TiCancel size={20} />
          </button>
          <button
            onClick={() => openCancelRedeem("redeem")}
            style={{ borderRadius: "3px", backgroundColor: "#5cb85c" }}
            className="min-w-28 max-h-12 flex justify-center items-center gap-1 text-white rounded-sm"
          >
            <span className="pl-2">Redeem</span>
            <TfiMoney
              size={15}
              className="font-bold"
              style={{ fontWeight: 400 }}
            />
          </button>
        </div>
        <div className="flex items-end flex-col gap-0 justify-end">
          <p
            className="text-xs font-thin mt-2"
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            }}
          >
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </p>
          <div className="w-80 mb-2 flex justify-end font-thin font-custom items-center">
            <p
              className=" text-sm"
              style={{
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              }}
            >
              {userData.user?.username}
            </p>
            <p
              className="text-sm"
              style={{
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              }}
            >
              ({userData.user?.username})
            </p>
            <a
              onClick={logout}
              className="ml-4 text-green-600 rounded-md hover:bg-red-500 cursor-pointer"
              href="#"
              style={{
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              }}
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    );
}