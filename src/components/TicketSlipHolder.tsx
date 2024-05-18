import { RiDeleteBin6Line } from "react-icons/ri"
import SlipItem from "./SlipItem"
import { useAppDispatch, useAppSelector } from "../features/hooks"
import { clearNumbers } from "../features/slices/pickerSlice";

export default function TicketSlipHolder() {
    const pickedNumbers = useAppSelector(state => state.picker.selected);
    const dispatch = useAppDispatch();

    const clearList = () => {
        dispatch(clearNumbers());
    }

    return (
        <div className="picker-right-slip mr-2 mt-2">
            {pickedNumbers.length > 0 && <>
                <button onClick={clearList} className='flex items-center gap-3 bg-red-500 text-white rounded-md p-2'>CLEAR <span><RiDeleteBin6Line /></span> </button>
                <button className='p-3 rounded-md bg-green-600 text-white text-lg mt-2'>
                    ADD TO BETSLIP
                </button>
                <div className="slip-container w-80 mt-3 flex flex-col flex-shrink-0">
                    <div className='slip-head bg-amber-500 text-sm bg-amber-500 p-2'>
                        HIGHEST PAYOUT FROM 7
                    </div>
                    {pickedNumbers.map((item, index) => {
                        return <SlipItem selected={item} maxWin={item * 3} key={index} />
                    })}

                    <div className='slip-footer pl-10 pr-10 text-black flex justify-between items-center p-1.5'>
                        <span>Hits</span>
                        <span>Wins</span>
                    </div>
                </div>
            </>}
        </div>
    )
}