import { useAppDispatch, useAppSelector } from "../features/hooks";
import { Ticket, clearBetSlip, removeFromBetSlip, updateBetSlipItem, updateStakeForAllTickets } from "../features/slices/pickerSlice";


export default function BetSlip() {
    const dispatch = useAppDispatch();
    const betState = useAppSelector(state => state.picker);

    const removeItemFromSlip = (item: Ticket) => {
        dispatch(removeFromBetSlip(item));
    }

    const changeIndividualSlipStake = (index: number, stake: number) => {
        dispatch(updateBetSlipItem({ index, changes: { stake: stake } }))
    }

    const updateStakeAll = (stake: number) => {
        dispatch(updateStakeForAllTickets(stake));
    }

    const clearSlip = () => {
        dispatch(clearBetSlip());
    }

    return (
        <div className='right basis-2/5 flex items-center flex-col'>
            <div className='text-l text-orange-500 font-bold flex items-center justify-center text-center'>
                Betslip
            </div>

            <div className='right-slip-content w-full flex flex-col items-center p-4'>
                <div className="slip-right-head flex items-center justify-center bg-orange-500 rounded-md p-1">
                    <div className="left bg-orange-500 p-1 pr-2 pl-2 text-sm text-white rounded-md">
                        SINGLE
                    </div>
                    <div className="left bg-black p-1 pr-2 pl-2 text-sm text-white rounded-md">
                        MULTIPLES
                    </div>
                </div>

                {betState.betSlip.length > 0 && betState.betSlip.map((item, index) => {
                    return <div key={index} className="selected-nums-con w-3/4 bg-gray-500 rounded-md p-1 mt-2 text-white">
                        <div className="flex justify-between items-center">
                            <p className='text-xs flex items-center'><span className='rounded-xl h-5 w-5 flex items-center justify-center border-2 mr-2'>8</span> Win</p>
                            <span onClick={() => removeItemFromSlip(item)} className="rounded-full h-4 flex items-center justify-center w-4 border border-slate-200 text-white font-bold cursor-pointer">X</span>
                        </div>
                        <p className='text-xs'>{item.selected.join(", ")} <span className='bg-amber-600 p-1 text-white rounded-lg text-xs'>{item.multiplier}</span></p>
                        <p className='text-xs'>2024/10/10 10:22:20 ID|5463</p>
                        <div className="inc-dec mt-1 flex bg-white items-center justify-between flex-shrink-0">
                            <div onClick={() => changeIndividualSlipStake(index, item.stake + 10)} className='text-white hover:bg-gray-500 cursor-pointer transition-all h-6 w-6 justify-center inc bg-slate-700 rounded-sm flex items-center p-1'>
                                +
                            </div>
                            <div className='num text-black'>
                                {item.stake}
                            </div>
                            <div onClick={() => changeIndividualSlipStake(index, item.stake >= 20 ? item.stake - 10 : 10)} className='text-white hover:bg-gray-500 cursor-pointer transition-all h-6 w-6 justify-center dec bg-slate-700 rounded-sm flex items-center p-1'>
                                -
                            </div>
                        </div>
                        <p className='text-white text-xs text-center mt-1'>TO WIN Br. {item.stake * item.multiplier}</p>
                    </div>

                })}

                {betState.betSlip.length > 0 && <>

                    <div className='btn-container-bet mt-1 flex gap-2 justify-stretch w-3/4 items-center'>
                        <button onClick={() => updateStakeAll(10)} className='bg-green-600 hover:opacity-75 transition-all flex-grow p-2 rounded-md text-white'>10 <span className='ml-3'>$</span> </button>
                        <button onClick={() => updateStakeAll(20)} className='bg-pink-600 hover:opacity-75 transition-all flex-grow p-2 rounded-md text-white'>20 <span className='ml-3'>$</span> </button>
                        <button onClick={() => updateStakeAll(50)} className='bg-blue-600 hover:opacity-75 transition-all flex-grow p-2 rounded-md text-white'>50 <span className='ml-3'>$</span> </button>
                        <button onClick={() => updateStakeAll(100)} className='bg-blue-400 hover:opacity-75 transition-all flex-grow p-2 rounded-md text-white'>100 <span className='ml-3'>$</span> </button>
                    </div>
                    <div className="amounts mt-2 w-3/4 text-black">
                        <div className='text-lg mt-1 flex justify-between items-center'>
                            <p>TOTAL STAKE</p>
                            <p>{betState.totalStake} BR</p>
                        </div>
                        <div className='text-lg mt-1 flex justify-between items-center'>
                            <p>TOTAL "TO WIN"</p>
                            <p>{betState.totalToWin} BR</p>
                        </div>
                    </div>
                    <div className='confirm-cancel w-3/4 gap-1 text-white mt-2 flex justify-between items-center'>
                        <button onClick={clearSlip} className='p-3 flex-grow hover:opacity-75 transition-opacity bg-red-500'>CANCEL</button>
                        <button className='p-3 flex-grow hover:opacity-75 transition-opacity basis-3/4 bg-green-500'>PLACE BET</button>
                    </div>
                </>}

            </div>


        </div>
    );
}