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

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const oddData = useAppSelector(state => state.odd);
  const [open, setOpen] = useState(false);
  const [redeemOpen, setRedeemStatus] = useState(false)
  const [cancelRedeem, setCancelRedeem] = useState("redeem")

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRedeemOpen = () => setRedeemStatus(true);
  const handleRedeemClose = () => setRedeemStatus(false);
  const handleCancelRedeem = (val: string) => setCancelRedeem(val);

  useEffect(() => {
    dispatch(getOdds(user.user?.Cashier.shopId));
  }, [])

  return (
    <div className='bg-white'>
      <CashierOptions open={open} handleClose={handleClose} />
      <RedeemTicket open={redeemOpen} handleClose={handleRedeemClose} type={cancelRedeem} />
      <CashierHeader handleOpen={handleOpen} handleRedeemOpen={handleRedeemOpen} handleCancelRedeem={handleCancelRedeem} />
      <div className='border-gray-300 border-t-4 p-4 flex justify-between'>
        <div className='left gap-4'>
          <GameIllustration />
          <div className="next-draw flex mt-4">
            <div className='bg-red-500 p-2 text-sm rounded-tl-md rounded-bl-md text-white flex items-center'>NEXT DRAW <span className='text-amber-300 ml-4'>04:12</span></div>
            <div className='bg-green-600 p-2 text-sm rounded-tr-md rounded-br-md text-white'>REPEAT <span className='text-black rounded-md bg-gray-400'>
              <select>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
                  return <option key={index} className='bg-gray-500 text-white'>{item}</option>
                })}
              </select>
            </span></div>
          </div>
          <div className='picker-container flex justify-start items-start'>
            <div className="picker-left">
              <TicketSelector />
              <div className="number-picker mt-4">
                <NumberPicker />
              </div>
            </div>
            {oddData.odd && <TicketSlipHolder />}
          </div>
        </div>
        <BetSlip />
      </div>
    </div>
  )
}

export default App
