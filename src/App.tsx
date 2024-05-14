import './App.css'
import NumberPicker from './components/NumberPicker';
import CashierHeader from './components/CashierHeader';
import GameIllustration from './components/GameIllustration';
import TicketSlipHolder from './components/TicketSlipHolder';
import TicketSelector from './components/TicketSelector';
import { useState } from 'react';
import CashierOptions from './components/CashierOptions';
import RedeemTicket from './components/RedeemTicket';

function App() {

  const [open, setOpen] = useState(false);
  const [redeemOpen, setRedeemStatus] = useState(false)
  const [cancelRedeem, setCancelRedeem] = useState("redeem")

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRedeemOpen = () => setRedeemStatus(true);
  const handleRedeemClose = () => setRedeemStatus(false);
  const handleCancelRedeem = (val: string) => setCancelRedeem(val);

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
            <TicketSlipHolder />
          </div>
        </div>
        <div className='right basis-1/2 flex items-center flex-col'>
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

            <div className="selected-nums-con w-3/4 bg-gray-500 rounded-md p-2 mt-4 text-white">
              <p className='text-xs mb-2 flex items-center'><span className='rounded-xl h-5 w-5 flex items-center justify-center border-2 mr-2'>8</span> Win</p>
              <p className='text-xs'>2,3,4,5 <span className='bg-amber-600 p-1 text-white rounded-lg text-xs'>400</span></p>
              <p className='text-xs mt-1'>2024/10/10 10:22:20 ID|5463</p>
              <div className="inc-dec mt-2 flex bg-white p-1 items-center justify-between flex-shrink-0">
                <div className='text-white hover:bg-gray-500 cursor-pointer transition-all h-6 w-6 justify-center inc bg-black rounded-md flex items-center p-1'>
                  +
                </div>
                <div className='num text-black'>
                  20
                </div>
                <div className='text-white hover:bg-gray-500 cursor-pointer transition-all h-6 w-6 justify-center dec bg-black rounded-md flex items-center p-1'>
                  -
                </div>
              </div>
              <p className='text-white text-xs text-center mt-1'>TO WIN Br. 4000</p>
            </div>
            <div className='btn-container-bet mt-2 flex gap-2 justify-stretch w-3/4 items-center'>
              <button className='bg-green-600 hover:opacity-75 transition-all flex-grow p-3 rounded-md text-white'>10 <span className='ml-3'>$</span> </button>
              <button className='bg-pink-600 hover:opacity-75 transition-all flex-grow p-3 rounded-md text-white'>20 <span className='ml-3'>$</span> </button>
              <button className='bg-blue-600 hover:opacity-75 transition-all flex-grow p-3 rounded-md text-white'>50 <span className='ml-3'>$</span> </button>
              <button className='bg-blue-400 hover:opacity-75 transition-all flex-grow p-3 rounded-md text-white'>100 <span className='ml-3'>$</span> </button>
            </div>
            <div className="amounts mt-2 w-3/4 text-black">
              <div className='text-lg mt-1 flex justify-between items-center'>
                <p>TOTAL STAKE</p>
                <p>100.00 BR</p>
              </div>
              <div className='text-lg mt-1 flex justify-between items-center'>
                <p>TOTAL "TO WIN"</p>
                <p>100.00 BR</p>
              </div>
            </div>
            <div className='confirm-cancel w-3/4 gap-1 text-white mt-2 flex justify-between items-center'>
              <button className='p-3 flex-grow hover:opacity-75 transition-opacity bg-red-500'>CANCEL</button>
              <button className='p-3 flex-grow hover:opacity-75 transition-opacity basis-3/4 bg-green-500'>PLACE BET</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
