import { FaShuffle } from "react-icons/fa6"
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { Ticket, addRandomNumbers, addToBetSlip, removeFromBetSlip } from "../features/slices/pickerSlice";
import { FormEvent, useState } from "react";
import { defaultStake } from "../config/constants";

export default function TicketSelector() {
    const dispatch = useAppDispatch();
    const ticketExpiry = useAppSelector(state => state.expiry.expiry);
    const currentDate = new Date().getTime();
    const [heads, setHeads] = useState(false);
    const [tails, setTails] = useState(false);
    const [evens, setEvens] = useState(false);
    const pickedNumbers = useAppSelector(state => state.picker.selected);
    const betSlip = useAppSelector(state => state.picker.betSlip);
    const betState = useAppSelector(state => state.betSlip);
    const gameState = useAppSelector(state => state.game);
    const gameCreatedDate = gameState.game && new Date(gameState.game?.createdAt);
    const expiryOfGame = gameCreatedDate?.setMinutes(gameCreatedDate.getMinutes() + 5);

    const clearHeadTail = () => {
        setHeads(false);
        setEvens(false);
        setTails(false);
    }

    const addToSlip = ({ selected, multiplier, toWin, stake, gameId }: Ticket) => {
        if (currentDate > ticketExpiry) {
            return;
        }

        dispatch(addToBetSlip({ selected: selected, expiry: expiryOfGame ? expiryOfGame : ticketExpiry, multiplier, toWin, stake, gameId }))
    }

    const addHeads = (val: boolean) => {
        setHeads(val);
        const selected = [-2]

        if (!val) {
            for (let item of betSlip) {
                if (item.selected[0] === -2) {
                    dispatch(removeFromBetSlip(item));
                    return;
                }
            }
        } else {
            addToSlip({ selected, multiplier: 2, toWin: 2, stake: defaultStake, expiry: ticketExpiry, gameId: gameState.game?.gamenumber })
        }
    }

    const addEvens = (val: boolean) => {
        setEvens(val);
        const selected = [-4]

        if (!val) {
            for (let item of betSlip) {
                if (item.selected[0] === -4) {
                    dispatch(removeFromBetSlip(item));
                    return;
                }
            }
        } else {
            addToSlip({ selected, multiplier: 4, toWin: 4, stake: defaultStake, expiry: ticketExpiry, gameId: gameState.game?.gamenumber })
        }
    }

    const addTails = (val: boolean) => {
        setTails(val);
        const selected = [-6]

        if (!val) {
            for (let item of betSlip) {
                if (item.selected[0] === -6) {
                    dispatch(removeFromBetSlip(item));
                    return;
                }
            }
        } else {
            addToSlip({ selected, multiplier: 2, toWin: 2, stake: defaultStake, expiry: ticketExpiry, gameId: gameState.game?.gamenumber })
        }
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const count = parseInt(event.target.value);
        generateRandomSelections(count);
    }

    const generateRandomSelections = (count: number) => {
        if (currentDate > ticketExpiry) return;
        const selections = [];
        const numbers = Array.from({ length: 80 }, (_, i) => i + 1);

        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * numbers.length);
            selections.push(numbers[randomIndex]);
            numbers.splice(randomIndex, 1);
        }

        dispatch(addRandomNumbers(selections));
    };

    return (
        <div className='mid-row flex items-center content-center mt-2 gap-3'>
            <div className='bg-green-500 p-2 text-sm rounded-sm flex items-center gap-3 text-white'>QUICK PICK <span className='text-black rounded-sm bg-gray-400'>
                <select onChange={handleSelectChange}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
                        return <option key={index} className='bg-gray-500 text-white'>{item}</option>
                    })}
                </select>
            </span>
                <span><FaShuffle /></span></div>
            <div onClick={() => addHeads(!heads)} className={`${!heads ? 'bg-amber-600' : 'bg-green-600 shadow-md'} hover:opacity-70 pl-6 pr-6 cursor-pointer transition-all p-2 text-sm rounded-sm text-white`}>HEADS
                <span className='text-white p-1 pl-2 pr-2 ml-16 bg-black rounded-sm'>
                    2
                </span>
            </div>
            <div onClick={() => addEvens(!evens)} className={`${!evens ? 'bg-red-500' : 'bg-green-600'} hover:opacity-70 cursor-pointer pl-6 pr-6 transition-all p-2 text-sm rounded-sm text-white`}>EVENS
                <span className='text-white p-1 pl-2 pr-2 ml-16 bg-black rounded-sm'>
                    4
                </span>
            </div>
            <div onClick={() => addTails(!tails)} className={`${!tails ? 'bg-orange-500' : 'bg-green-600'} hover:opacity-70 cursor-pointer pl-6 pr-6 transition-all p-2 text-sm rounded-sm text-white`}>TAILS
                <span className='text-white p-1 pl-2 pr-2 ml-16 bg-black rounded-sm'>
                    2
                </span>
            </div>
        </div>
    )
}