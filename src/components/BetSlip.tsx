import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { Ticket, clearBetSlip, clearNumbers, removeFromBetSlip, updateBetSlipItem, updateStakeForAllTickets } from "../features/slices/pickerSlice";
import { createBetSlipAndTicket, getLastBetSlip } from "../features/slices/betSlip";
import ProgressCircular from "./ProgressCircular";
import FormStatus from "./FormStatus";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
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
        <div style={{ flexBasis: "40%" }} className='right relative ml-2 flex items-center flex-col drop-shadow-md shadow-md shadow-gray-400'>
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
                    return <div style={{
                        backgroundColor: `${currentDate > betState.betSlip[0].expiry ? '#f87171' : '#969696'}`
                    }} key={index} className={`selected-nums-con w-full m-1 p-1 text-white font-bold`}>
                        <div className="flex justify-between items-center">
                            <p className='text-xs flex items-center'>Win</p>
                            <span onClick={() => removeItemFromSlip(item)} className="rounded-full h-4 flex items-center justify-center w-4 border border-slate-200 text-white font-bold cursor-pointer">X</span>
                        </div>
                        <p className='text-xs'>{(!item.selected.includes(-2) && !item.selected.includes(-4) && !item.selected.includes(-6)) && item.selected.join(", ")} {item.selected.includes(-2) && 'HEADS'} {item.selected.includes(-4) && 'EVENS'} {item.selected.includes(-6) && 'TAILS'} <span className='bg-green-600 p-1 text-white text-xs'>{item.multiplier}</span></p>
                        <p className='text-xs'>{`${new Date(item.expiry).getFullYear()}/${new Date(item.expiry).getMonth() + 1}/${new Date(item.expiry).getDate()}`} {new Date(item.expiry).toLocaleTimeString('en-US', { hourCycle: "h24" })} ID|{gameState.game?.gamenumber}</p>
                        {currentDate < betState.betSlip[0].expiry && <><div className="inc-dec mt-1 flex bg-white items-center justify-between flex-shrink-0">

                            <FaMinus style={{ backgroundColor: "#C7C7C7" }} onClick={() => changeIndividualSlipStake(index, item.stake >= 20 ? item.stake - 10 : 10)} className='text-white hover:bg-gray-400 cursor-pointer transition-all h-6 w-6 justify-center dec font-bold rounded-sm flex items-center text-3xl' />
                            <div className="flex items-center">
                                <div className='num text-gray-500 text-end mr-2'>
                                    {item.stake}
                                </div>
                                <FaPlus style={{ backgroundColor: "#C7C7C7" }} onClick={() => changeIndividualSlipStake(index, item.stake + 10)} className='text-white hover:bg-gray-400 cursor-pointer transition-all h-6 w-6 justify-center inc font-bold rounded-sm flex items-center text-4xl'
                                />
                            </div>
                        </div>
                            <p className='text-white text-xs text-right mt-1'>TO WIN Br. {item.stake * item.multiplier}</p>
                        </>}
                    </div>

                })}

                {betState.betSlip.length > 0 && <>

                    <div className='btn-container-bet w-full mt-1 p-1 flex gap-2 justify-stretch items-center'>
                        <button style={{ backgroundColor: "#C9580F" }} onClick={() => updateStakeAll(10)} className='hover:opacity-75 transition-all flex-grow rounded-md flex p-2 text-center text-white'><sup className='text-sm self-start'>Br.</sup><span className="self-center mt-1">10</span></button>
                        <button style={{ backgroundColor: "#C93362" }} onClick={() => updateStakeAll(20)} className='hover:opacity-75 transition-all flex-grow p-2 rounded-md flex text-center text-white'><sup className='text-sm self-start'>Br.</sup><span className="self-center mt-1">20</span></button>
                        <button style={{ backgroundColor: "#8830AD" }} onClick={() => updateStakeAll(50)} className='hover:opacity-75 transition-all flex-grow p-2 rounded-md flex text-center text-white'><sup className='text-sm self-start'>Br.</sup><span className="self-center mt-1">50</span></button>
                        <button style={{ backgroundColor: "#5A95F0" }} onClick={() => updateStakeAll(100)} className='hover:opacity-75 transition-all flex-grow p-2 rounded-md flex text-center text-white'><sup className='text-sm self-start'>Br.</sup><span className="self-center mt-1">100</span></button>
                        <button style={{ backgroundColor: "#688A37" }} onClick={() => updateStakeAll(150)} className='hover:opacity-75 transition-all flex-grow p-2 rounded-md flex text-center text-white'><sup className='text-sm self-start'>Br.</sup><span className="self-center mt-1">150</span></button>
                    </div>
                    <div className="amounts mt-2 w-full p-1 text-black">
                        <div className='text-lg text-gray-600 mt-1 flex justify-between items-center'>
                            <p>TOTAL STAKE</p>
                            <p>{betState.totalStake}.00 BR</p>
                        </div>
                        <div className='text-lg text-gray-600 mt-1 flex justify-between items-center'>
                            <p>TOTAL "TO WIN"</p>
                            <p>{betState.totalToWin}.00 BR</p>
                        </div>
                    </div>

                    {betSlipState.loading && <ProgressCircular />}


                </>}

                <div className='confirm-cancel mb-4 w-full gap-1 text-white mt-2 flex justify-between items-center'>
                    <button disabled={betState.betSlip.length < 1} onClick={clearSlip} className=' disabled:bg-red-200 p-3 flex-grow hover:opacity-75 transition-opacity bg-red-500'>CLEAR</button>
                    <button disabled={betState.betSlip.length < 1 || currentDate > betState.betSlip[0].expiry} onClick={handleCreateTicket} className={` disabled:bg-green-300 p-3 flex-grow hover:opacity-75 transition-opacity basis-2/3 ${currentDate < betState.betSlip[0]?.expiry ? 'bg-green-500' : 'bg-green-200'}`}>PLACE BET</button>
                </div>

            </div>


        </div>
    );
}