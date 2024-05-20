import { IoIosPrint } from "react-icons/io";
import { FaEye } from "react-icons/fa";

interface ActionType {
    type: string
}

const BetSlipTable = ({ type }: ActionType) => {
    return (
        <div className='right-flex pl-3 pr-3 flex-grow border-l-2 border-slate-200 ml-6'>
            <div className='slip-header text-green-600 font-semibold text-xl'>
                Betslip
            </div>
            <div className="slip-container mt-3 relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="text-xs border-b-2 border-t-2 border-slate-300 uppercase bg-gray-50">
                        <tr >
                            <th scope="col" className="px-3 py-3">
                                Number
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Max Win
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white border-b">
                            <td scope="row" className="px-3 py-3">
                                8172878
                            </td>
                            <td className="px-3 py-3">
                                40,000.00 Br
                            </td>
                            <td className="px-3 py-3">
                                2024-10-12 10:10:00 A.M
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='slip-header text-green-600 font-semibold text-xl'>
                Bets
            </div>
            <div className="slip-container mt-3 relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="text-xs border-b-2 border-t-2 border-slate-300 text-gray-700 uppercase bg-gray-50">
                        <tr>
                            {type === "redeem" && <th colSpan={1} scope="col" className="px-6 col-span-4 py-3">
                                Actions
                            </th>}
                            <th scope="col" className="px-3 py-3">
                                Bet ID
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Game
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Event No
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Market
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Selection
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Win
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white border-b">
                            {type === "redeem" && <td scope="row" className="px-1 flex gap-4 py-2">
                                <FaEye className="text-green-500 border-2 border-green-300 rounded-md p-1 cursor-pointer" size={40} />
                                <IoIosPrint className="text-green-500 border-2 border-green-300 rounded-md p-1 cursor-pointer" size={40} />
                            </td>}
                            <td scope="row" className="px-3 py-2">
                                8172878
                            </td>
                            <td className="px-3 py-2">
                                Keno
                            </td>
                            <td className="px-3 py-2">
                                918298
                            </td>
                            <td scope="row" className="px-3 py-2">
                                Win
                            </td>
                            <td className="px-3 py-2">
                                4,23,42,11,23
                            </td>
                            <td className="px-3 py-2">
                                0.00 Br
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="bet-footer">
                <div className="flex justify-between text-sm items-center p-3">
                    <div>
                        2024-10-14 11:12:00 A.M
                    </div>
                    <div className="mr-6">
                        0.00 Br
                    </div>
                </div>
                <div className="flex items-center justify-end mt-3">
                    {type === "redeem" ? <div className="font-bold text-l">Not a Winning Ticket</div> : <div className="font-bold text-l">Total Stake Br. 50.00</div>}
                    {type === "redeem" ? <button className="ml-3 px-4 py-2 bg-green-600 text-white rounded-md">
                        Redeem $
                    </button> : <button className="ml-3 px-4 py-2 bg-orange-600 text-white rounded-md">
                        Cancel $
                    </button>}
                </div>
            </div>
        </div>
    )
}

export default BetSlipTable