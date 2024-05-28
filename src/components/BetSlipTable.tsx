import { IoIosPrint } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { BetSlip, cancelTicket, redeemTicket } from "../features/slices/betData";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { useEffect } from "react";

interface ActionType {
    type: string,
    data: BetSlip
}

const BetSlipTable = ({ type, data }: ActionType) => {

    const dispatch = useAppDispatch();
    const gameState = useAppSelector(state => state.game.game?.gamenumber);
    const userData = useAppSelector(state => state.user);
    const gameNumber = data.Tickets?.map((items) => items.Game.gamenumber);
    const totalStake = data.Tickets?.reduce((a, b) => a + parseInt(b?.stake), 0)

    const handleCancel = () => {
        dispatch(cancelTicket(gameNumber?.[0], parseInt(data?.betSlipNumber), userData.user?.Cashier.id));
    }

    const handleRedeem = () => {
        dispatch(redeemTicket(userData.user?.Cashier.id, parseInt(data?.betSlipNumber)));
    }

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
                                {data.betSlipNumber}
                            </td>
                            <td className="px-3 py-3">
                                {data.maxWin} Br.
                            </td>
                            <td className="px-3 py-3">
                                {new Date(data.createdAt).toDateString()}
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
                        {data.Tickets?.map((item) => {
                            return <tr key={item.id} className="bg-white border-b">
                                {type === "redeem" && <td scope="row" className="px-1 flex gap-4 py-2">
                                    <FaEye className="text-green-500 border-2 border-green-300 rounded-md p-1 cursor-pointer" size={40} />
                                    <IoIosPrint className="text-green-500 border-2 border-green-300 rounded-md p-1 cursor-pointer" size={40} />
                                </td>}
                                <td scope="row" className="px-3 py-2">
                                    {data.betSlipNumber}
                                </td>
                                <td className="px-3 py-2">
                                    Keno
                                </td>
                                <td className="px-3 py-2">
                                    {item.Game.gamenumber}
                                </td>
                                <td scope="row" className="px-3 py-2">
                                    {item.win > 0 ? "Win" : "Lost"}
                                </td>
                                <td className="px-3 py-2">
                                    {(!item.nums.includes(-2) && !item.nums.includes(-4) && !item.nums.includes(-6)) && item.nums.join(", ")}
                                    {item.nums.includes(-2) && 'Heads'}
                                    {item.nums.includes(-4) && 'Evens'}
                                    {item.nums.includes(-6) && 'Tails'}
                                </td>
                                <td className="px-3 py-2">
                                    {item.win && item.win > 0 ? item.win.toFixed(2) : 0.00} Br
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            <div className="bet-footer">
                <div className="flex justify-between text-sm items-center p-3">
                    <div>
                        {new Date(data.createdAt).toLocaleDateString()} A.M
                    </div>
                    <div className="mr-6">
                        {data.Tickets?.reduce((a, b) => a + b?.win, 0).toFixed(2)} Br
                    </div>
                </div>
                <div className="flex items-center justify-end mt-3">
                    {type === "redeem" ? <div className="font-bold text-l">Not a Winning Ticket</div> : <div className="font-bold text-l">Total Stake Br. {totalStake?.toFixed(2)}</div>}
                    {type === "redeem" ? <button onClick={handleRedeem} className="ml-3 px-4 py-2 bg-green-600 text-white rounded-md">
                        Redeem $
                    </button> : <button onClick={handleCancel} className="ml-3 px-4 py-2 bg-orange-600 text-white rounded-md">
                        Cancel $
                    </button>}
                </div>
            </div>
        </div>
    )
}

export default BetSlipTable