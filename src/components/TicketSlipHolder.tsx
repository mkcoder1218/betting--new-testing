import { RiDeleteBin6Line } from "react-icons/ri"
import SlipItem from "./SlipItem"
import { useAppDispatch, useAppSelector } from "../features/hooks"
import { Ticket, addToBetSlip, clearNumbers } from "../features/slices/pickerSlice";
import { useEffect, useState } from "react";
import { OddMultiplier } from "../features/slices/oddSlice";
import { defaultStake } from "../config/constants";
// import { writeToPrinter } from "./SlipPrinter";

export default function TicketSlipHolder() {
    const pickedNumbers = useAppSelector(state => state.picker.selected);
    const betSlip = useAppSelector(state => state.picker.betSlip);
    const betState = useAppSelector(state => state.betSlip);
    const gameState = useAppSelector(state => state.game);
    const gameCreatedDate = gameState.game && new Date(gameState.game?.createdAt);
    const expiryOfGame = gameCreatedDate?.setMinutes(gameCreatedDate.getMinutes() + 5);
    const ticketExpiry = useAppSelector(state => state.expiry.expiry);
    const currentDate = new Date().getTime();
    const [error, setError] = useState("");

    const odd = useAppSelector(state => state.odd);
    const [odds, setOdds] = useState<OddMultiplier[]>([]);
    const repeatState = useAppSelector(state => state.repeat);
    const dispatch = useAppDispatch();

    const clearList = () => {
        dispatch(clearNumbers());
        setOdds([]);
    }

    const addToSlip = ({ selected, multiplier, toWin, stake, gameId }: Ticket) => {
        for (let item of betSlip) {
            if (selected === item.selected) {
                return;
            }
        }

        if (currentDate > ticketExpiry) {
            return;
        }

        for (let i = 0; i < repeatState.repeat; i++) {
            dispatch(addToBetSlip({ selected: selected, expiry: expiryOfGame ? expiryOfGame : ticketExpiry, multiplier, toWin, stake, gameId }))
        }
    }

    const calculateHitsAndWins = (userPicks: number[]) => {
        let rule = odd.odd?.OddMultipliers.filter(rule => rule.numberLength === userPicks.length);

        if (rule && rule?.length < 1) {
            return;
        }

        rule = rule?.sort((a, b) => a.winLength - b.winLength)

        rule ? setOdds([...rule]) : setOdds([]);
    };

    useEffect(() => {
        calculateHitsAndWins(pickedNumbers);

        if (betState.loading) {
            setOdds([]);
        }

        if (pickedNumbers.length < 1) {
            setOdds([]);
        }

        // writeToPrinter();

    }, [pickedNumbers])

    return (
        <div className="ml-10" style={{ marginTop: "-50px" }}>
            <button disabled={(!gameState.game || odds.length < 1)} onClick={clearList} className='flex items-center gap-3 bg-red-500 text-white p-2 disabled:bg-red-300'>CLEAR <span><RiDeleteBin6Line /></span> </button>
            {(gameState.game && odds.length > 0) && <>

                <button disabled={currentDate > ticketExpiry} onClick={() => addToSlip({ selected: pickedNumbers, multiplier: odds[odds.length - 1].multiplier, toWin: odds[odds.length - 1].multiplier, expiry: ticketExpiry, stake: defaultStake, gameId: gameState.game?.gamenumber })} className='p-3 bg-green-600 text-white text-lg mt-2'>
                    ADD TO BETSLIP
                </button>
                <div className="slip-container w-70 mt-3 flex flex-col flex-shrink-0">
                    <div className='slip-head bg-amber-500 text-sm p-2'>
                        HIGHEST PAYOUT FROM {pickedNumbers.length}
                    </div>
                    {odds.map((item, index) => {
                        return <SlipItem selected={item.winLength} maxWin={item.multiplier} key={index} />
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