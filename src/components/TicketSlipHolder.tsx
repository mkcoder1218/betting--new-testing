import { RiDeleteBin6Line } from "react-icons/ri"
import SlipItem from "./SlipItem"


export default function TicketSlipHolder() {
    return (
        <div className="picker-right-slip mr-2 mt-2">
            <button className='flex items-center gap-3 bg-red-500 text-white rounded-md p-2'>CLEAR <span><RiDeleteBin6Line /></span> </button>
            <button className='p-3 rounded-md bg-green-600 text-white text-lg mt-2'>
                ADD TO BETSLIP
            </button>
            <div className="slip-container w-80 mt-3 flex flex-col flex-shrink-0">
                <div className='slip-head bg-amber-500 text-sm bg-amber-500 p-2'>
                    HIGHEST PAYOUT FROM 7
                </div>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => {
                    return <SlipItem selected={item} maxWin={item * 3} key={index} />
                })}

                <div className='slip-footer pl-10 pr-10 text-black flex justify-between items-center p-1.5'>
                    <span>Hits</span>
                    <span>Wins</span>
                </div>
            </div>
        </div>
    )
}