import { GiConfirmed } from "react-icons/gi";
import { TiCancel } from "react-icons/ti";

interface CashierHeaderOptions {
    handleOpen: () => void;
    handleRedeemOpen: () => void;
}

export default function CashierHeader({ handleOpen, handleRedeemOpen }: CashierHeaderOptions) {
    return (
        <div className='header-container bg-slate-200 items-center pl-4 pr-4 flex justify-between'>
            <div className='text-xl text-black font-bold'>
                CASHIER
            </div>
            <div className='flex gap-4 justify-center w-full p-4'>
                <button onClick={handleOpen} className='p-2 bg-green-600 text-white rounded-md'>
                    Cashier Options
                </button>
                <button onClick={handleRedeemOpen} className='p-2 flex items-center gap-1 bg-blue-800 text-white rounded-md'>
                    <span className='pl-2'>Redeem</span>
                    <GiConfirmed size={20} />
                </button>
                <button className='p-2 flex items-center gap-1 bg-yellow-600 text-white rounded-md'>
                    <span className='pl-2'>Cancel</span>
                    <TiCancel size={20} />
                </button>
            </div>
            <div className='flex items-center justify-center'>
                <div className='w-80 flex justify-end flex-col items-end'>
                    <p>cashier.one</p>
                    <p className='text-xs'>2024-10-10 10:40:10 P.M</p>
                </div>
                <a className='ml-4 bg-red-400 p-2 text-white rounded-md hover:bg-red-500 cursor-pointer' href="#">Logout</a>
            </div>
        </div>
    )
}