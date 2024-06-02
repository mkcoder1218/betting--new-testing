import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { Ticket, clearBetSlip, clearNumbers, removeFromBetSlip, updateBetSlipItem, updateStakeForAllTickets } from "../features/slices/pickerSlice";
import { createBetSlipAndTicket, getLastBetSlip } from "../features/slices/betSlip";
import ProgressCircular from "./ProgressCircular";
import FormStatus from "./FormStatus";
import { BsCheck2All } from "react-icons/bs";

export default function BetSlip() {
    const dispatch = useAppDispatch();
    const betState = useAppSelector(state => state.picker);
    const gameState = useAppSelector(state => state.game);
    const userState = useAppSelector(state => state.user);
    const oddState = useAppSelector(state => state.odd);
    const betSlipState = useAppSelector(state => state.betSlip);
    const [statusVisible, setStatusVisible] = useState(false);
    const currentDate = new Date().getTime();
    const [expired, setExpired] = useState(false);

    // Check every second for the expiry of the current game and clear from betslip if it did. And try to fetch the last game every 5 seconds if no game exists currently
    useEffect(() => {
        const timer = setInterval(() => {
            for (let ticket of betState.betSlip) {
                if (currentDate > ticket.expiry) {
                    setExpired(true);
                    break;
                }
            }
        }, 1000)

        if (expired) {
            setExpired(false);

            setTimeout(() => {
                clearSlip();
            }, 3000);
        }
        return () => clearInterval(timer)
    });

    const toggleStatus = (val: boolean) => {
        setStatusVisible(val);
    }

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
        dispatch(clearNumbers());
    }

    const handleCreateTicket = () => {
        refreshBetSlipNumber();

        let newBetSlipNumber = betSlipState.data ? parseInt(betSlipState.data?.betSlipNumber) + 1 : generateRandomNumber();
        let newTicketToSend = [];

        for (let ticket of betState.betSlip) {
            let ticketItem = {
                toWin: ticket.toWin,
                stake: ticket.stake,
                maxWin: ticket.multiplier * ticket.stake,
                nums: ticket.selected,
                gameId: gameState.game?.id,
                oddId: oddState.odd?.id
            }

            newTicketToSend.push(ticketItem);
        }

        const minWin = Math.min(...newTicketToSend.map((item) => item.toWin * item.stake))
        const maxWin = newTicketToSend.reduce((a, b) => a + b.maxWin, 0)

        const requestPayload = {
            minWin: minWin,
            maxWin: betState.totalToWin,
            betSlipNumber: newBetSlipNumber,
            cashierCreateId: userState.user?.Cashier.id,
            shopId: userState.user?.Cashier.shopId,
            ticketData: newTicketToSend
        }

        // return;
        dispatch(createBetSlipAndTicket(requestPayload, refreshBetSlipNumber, clearSlip, toggleStatus, clearNumberSelection));
    }

    const clearNumberSelection = () => {
        dispatch(clearNumbers());
    }

    const refreshBetSlipNumber = () => {
        dispatch(getLastBetSlip());
    }

    function generateRandomNumber() {
        const randomNumber = Math.floor(Math.random() * 1000000000);

        let randomNumberString = randomNumber.toString();

        randomNumberString = randomNumberString.padStart(9, '0');

        return randomNumberString;
    }

    return (
        <div style={{ flexBasis: "23%" }} className='right relative ml-20 flex items-center flex-col drop-shadow-md shadow-md shadow-gray-400'>
            <div className='text-l text-green-600 font-bold flex items-center justify-center text-center'>
                Betslip
            </div>

            <div className='right-slip-content w-full flex flex-col items-center mt-2'>
                <div className="slip-right-head flex items-center justify-center bg-green-500 rounded-sm p-1">
                    <div className="left cursor-pointer bg-green-500 pr-3 pl-4 text-xs text-white rounded-sm">
                        SINGLE
                    </div>
                    <div className="left cursor-pointer bg-white pr-3 pl-4 text-xs text-black rounded-sm">
                        MULTIPLES
                    </div>
                </div>

                {betState.betSlip.length < 1 && <div className={`text-center mt-4 mb-4 text-gray-400 font-bold text-md`}>
                    Add more bets
                </div>}

                {(!betSlipState.loading && betSlipState.error) && <FormStatus type="error" content={betSlipState.error} />}
                {(!betSlipState.loading && betSlipState.message && statusVisible) && <FormStatus type="success" content={betSlipState.message} />}

                {currentDate > betState?.betSlip[0]?.expiry &&
                    <div className="p-1 w-2/3 flex items-center justify-between mt-2 text-center text-s bg-red-400 text-white">
                        <p className="ml-3">Expired Bets</p>
                        <BsCheck2All className="mr-3" size={24} />
                    </div>
                }

                {(gameState.game?.gamenumber && betState.betSlip.length > 0) && betState.betSlip.map((item, index) => {
                    return <div key={index} className={`selected-nums-con ${currentDate > betState.betSlip[0].expiry ? 'bg-red-400' : 'bg-gray-400'} w-full m-2 p-1 text-white font-bold`}>
                        <div className="flex justify-between items-center">
                            <p className='text-xs flex items-center'><span className='rounded-xl h-5 w-5 flex items-center justify-center border-2 mr-2'>8</span> Win</p>
                            <span onClick={() => removeItemFromSlip(item)} className="rounded-full h-4 flex items-center justify-center w-4 border border-slate-200 text-white font-bold cursor-pointer">X</span>
                        </div>
                        <p className='text-xs'>{(!item.selected.includes(-2) && !item.selected.includes(-4) && !item.selected.includes(-6)) && item.selected.join(", ")} {item.selected.includes(-2) && 'HEADS'} {item.selected.includes(-4) && 'EVENS'} {item.selected.includes(-6) && 'TAILS'} <span className='bg-green-600 p-1 text-white text-xs'>{item.multiplier}</span></p>
                        <p className='text-xs'>{new Date(item.expiry).toLocaleDateString()} {new Date(item.expiry).toLocaleTimeString()} ID|{gameState.game?.gamenumber}</p>
                        <><div className="inc-dec mt-1 flex bg-white items-center justify-between flex-shrink-0">
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
                        </>
                    </div>

                })}

                {betState.betSlip.length > 0 && <>

                    <div className='btn-container-bet w-full mt-1 p-1 flex gap-2 justify-stretch items-center'>
                        <button onClick={() => updateStakeAll(10)} className='bg-green-600 hover:opacity-75 transition-all flex-grow p-2 rounded-md text-white'>10 <span className='ml-3'>$</span> </button>
                        <button onClick={() => updateStakeAll(20)} className='bg-pink-600 hover:opacity-75 transition-all flex-grow p-2 rounded-md text-white'>20 <span className='ml-3'>$</span> </button>
                        <button onClick={() => updateStakeAll(50)} className='bg-blue-600 hover:opacity-75 transition-all flex-grow p-2 rounded-md text-white'>50 <span className='ml-3'>$</span> </button>
                        <button onClick={() => updateStakeAll(100)} className='bg-blue-400 hover:opacity-75 transition-all flex-grow p-2 rounded-md text-white'>100 <span className='ml-3'>$</span> </button>
                    </div>
                    <div className="amounts mt-2 w-full p-1 text-black">
                        <div className='text-lg mt-1 flex justify-between items-center'>
                            <p>TOTAL STAKE</p>
                            <p>{betState.totalStake}.00 BR</p>
                        </div>
                        <div className='text-lg mt-1 flex justify-between items-center'>
                            <p>TOTAL "TO WIN"</p>
                            <p>{betState.totalToWin}.00 BR</p>
                        </div>
                    </div>

                    {betSlipState.loading && <ProgressCircular />}


                </>}

                <div className='confirm-cancel mb-4 w-full gap-1 text-white mt-2 flex justify-between items-center'>
                    <button disabled={betState.betSlip.length < 1} onClick={clearSlip} className=' disabled:bg-red-300 p-3 flex-grow hover:opacity-75 transition-opacity bg-red-500'>CLEAR</button>
                    <button disabled={betState.betSlip.length < 1 || currentDate > betState.betSlip[0].expiry} onClick={handleCreateTicket} className={` disabled:bg-green-300 p-3 flex-grow hover:opacity-75 transition-opacity basis-2/3 ${currentDate < betState.betSlip[0]?.expiry ? 'bg-green-500' : 'bg-green-300'}`}>PLACE BET</button>
                </div>

            </div>


        </div>
    );
}