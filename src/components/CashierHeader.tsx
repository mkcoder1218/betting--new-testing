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
        <div className='header-container bg-white shadow-md shadow-gray-400 items-start pl-4 pr-4 flex justify-between'>
            <div className='text-md pt-2 text-green-600 text-nowrap font-bold'>
                Retail Logo
            </div>
            <div className='flex gap-4 justify-center w-full p-2 pb-0'>
                <button style={{ backgroundColor: "#37B34A" }} onClick={handleOpen} className='p-2 text-white rounded-md'>
                    Cashier Options
                </button>
                <button onClick={() => openCancelRedeem("cancel")} className='my-cancel-btn p-2 flex items-center gap-1 text-white rounded-md'>
                    <span className='pl-2'>Cancel</span>
                    <TiCancel size={20} />
                </button>
                <button onClick={() => openCancelRedeem("redeem")} className='p-2 flex items-center gap-1 bg-green-600 text-white rounded-md'>
                    <span className='pl-2'>Redeem</span>
                    <TfiMoney size={18} />
                </button>
            </div>
            <div className='flex items-end flex-col gap-0 justify-end'>
                <p className='text-xs mt-2'>{date.toLocaleDateString()} {date.toLocaleTimeString()}</p>
                <div className='w-80 mb-2 flex justify-end items-center'>
                    <p>{userData.user?.username}</p>
                    <a onClick={logout} className='ml-4 text-green-600 rounded-md hover:bg-red-500 cursor-pointer' href="#">Logout</a>
                </div>

            </div>
        </div>
    )
}