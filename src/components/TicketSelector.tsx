import { FaShuffle } from "react-icons/fa6"


export default function TicketSelector() {
    return (
        <div className='mid-row flex items-center content-center mt-2 gap-3'>
            <div className='bg-green-500 p-2 text-sm rounded-md flex items-center gap-3 rounded-br-md text-white'>QUICK PICK <span className='text-black rounded-md bg-gray-400'>
                <select>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
                        return <option key={index} className='bg-gray-500 text-white'>{item}</option>
                    })}
                </select>
            </span>
                <span><FaShuffle /></span></div>
            <div className='bg-amber-600 p-2 text-sm rounded-md rounded-br-md text-white'>HEADS
                <span className='text-white p-1 pl-2 pr-2 ml-16 bg-black rounded-md'>
                    2
                </span>
            </div>
            <div className='bg-red-400 p-2 text-sm rounded-md rounded-br-md text-white'>EVENS
                <span className='text-white p-1 pl-2 pr-2 ml-16 bg-black rounded-md'>
                    4
                </span>
            </div>
            <div className='bg-orange-500 p-2 text-sm rounded-md rounded-br-md text-white'>TAILS
                <span className='text-white p-1 pl-2 pr-2 ml-16 bg-black rounded-md'>
                    2
                </span>
            </div>
        </div>
    )
}