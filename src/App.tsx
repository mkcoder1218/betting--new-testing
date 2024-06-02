import './App.css'
import NumberPicker from './components/NumberPicker';
import CashierHeader from './components/CashierHeader';
import GameIllustration from './components/GameIllustration';
import TicketSlipHolder from './components/TicketSlipHolder';
import TicketSelector from './components/TicketSelector';
import { useEffect, useState } from 'react';
import CashierOptions from './components/CashierOptions';
import RedeemTicket from './components/RedeemTicket';
import BetSlip from './components/BetSlip';
import { useAppDispatch, useAppSelector } from './features/hooks';
import { getOdds } from './features/slices/oddSlice';
import { getLastGame } from './features/slices/gameSlice';
import { getLastBetSlip } from './features/slices/betSlip';
import { addExpiry } from './features/slices/ticketExpiry';
import { addRepeat } from './features/slices/betRepeat';

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const oddData = useAppSelector(state => state.odd);
  const gameData = useAppSelector(state => state.game);

  const ticketExpiry = useAppSelector(state => state.expiry);
  const ticketPicker = useAppSelector(state => state.picker);
  const [open, setOpen] = useState(false);
  const [redeemOpen, setRedeemStatus] = useState(false)
  const [cancelRedeem, setCancelRedeem] = useState("redeem")

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRedeemOpen = () => setRedeemStatus(true);
  const handleRedeemClose = () => setRedeemStatus(false);
  const handleCancelRedeem = (val: string) => setCancelRedeem(val);

  const [remainingTime, setRemainingTime] = useState(0);

  function handleRepeat(event: React.ChangeEvent<HTMLSelectElement>) {
    dispatch(addRepeat({ repeat: parseInt(event.target.value) }));
  }

  function calculateRemainingTime() {
    const lastUpdatedTime = gameData.game?.createdAt ? new Date(gameData.game.createdAt).getTime() : new Date().getTime();
    const targetTime = lastUpdatedTime + (5 * 60 * 1000);
    const currentTime = new Date().getTime();
    const difference = targetTime - currentTime;

    dispatch(addExpiry({ expiry: targetTime }));
    console.log(new Date(targetTime));

    return difference > 0 ? difference : 0;
  }

  useEffect(() => {
    if (gameData.game) {
      const currentDiff = new Date().getTime() - new Date(gameData.game?.createdAt).getTime();
      const diffInMinutes = currentDiff / (1000 * 60);

      if (diffInMinutes <= 5) {
        setRemainingTime(calculateRemainingTime());
        dispatch(getLastBetSlip());
      }
    }

    const timer = setInterval(() => {
      setRemainingTime(prevTime => prevTime > 0 ? prevTime - 1000 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameData]);

  useEffect(() => {
    if (remainingTime === 0) {
      const timeerFetch = setInterval(() => {
        console.log("fetching last game");
        dispatch(getLastGame(user.user?.Cashier.shopId));
      }, 5000);

      return () => clearInterval(timeerFetch)
    }
  })

  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  function formatTime(minutes: number, seconds: number): string {
    const date = new Date();
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    return date.toLocaleTimeString('en-US', {
      hour12: false,
      timeZone: 'UTC', // Adjust timezone as needed
      minute: '2-digit',
      second: '2-digit'
    });
  }

  useEffect(() => {
    dispatch(getOdds(user.user?.Cashier.shopId));

    if (remainingTime === 0) {
      dispatch(getLastGame(user.user?.Cashier.shopId));
    }
  }, [])

  return (
    <div className='bg-white'>
      <CashierOptions open={open} handleClose={handleClose} />
      <RedeemTicket open={redeemOpen} handleClose={handleRedeemClose} type={cancelRedeem} />
      <CashierHeader handleOpen={handleOpen} handleRedeemOpen={handleRedeemOpen} handleCancelRedeem={handleCancelRedeem} />
      <div className='border-gray-300 w-74 border-t-4 p-4 ml-4 flex justify-between'>
        <div className='left gap-4'>
          <GameIllustration />
          <div className="next-draw flex mt-4">
            {(gameData.game && remainingTime > 0) ? <div className='bg-red-500 font-bold p-2 text-sm text-white flex items-center'>NEXT DRAW <span className='text-amber-300 font-bold ml-4'>{formatTime(minutes, seconds)}</span></div> : <div className='bg-red-500 p-2 text-sm text-white flex font-bold items-center'>NEXT DRAW <span className='font-bold text-amber-300 ml-4'>{"00"}:{"00"}</span></div>}
            <div className='bg-green-600 p-2 text-sm text-white font-bold'>REPEAT <span className='text-black rounded-md bg-gray-400'>
              <select onChange={handleRepeat}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
                  return <option key={index} className='bg-gray-500 text-white'>{item}</option>
                })}
              </select>
            </span></div>
          </div>
          <div className='picker-container flex justify-stretch items-start'>
            <div className="picker-left w-94">
              <TicketSelector />
              <div className="number-picker mt-4 flex justify-start items-start">
                <NumberPicker />
                <div className='w-80 flex flex-col gap-4'>
                  <TicketSlipHolder />
                  {ticketPicker.selected.length < 1 && <div className="speech left">Pick 1 to 10 numbers from 80. Pick numbers which you think randomly will be selected. The more you pick the more you could win.</div>}

                </div>

              </div>
            </div>

          </div>
        </div>
        <BetSlip />
      </div>
    </div>
  )
}

export default App
