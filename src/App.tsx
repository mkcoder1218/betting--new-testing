import { useState } from 'react'
import { TiCancel } from "react-icons/ti";
import { GiConfirmed } from "react-icons/gi";
import './App.css'
import { Jaguar } from './components/svg/Jaguar';
import { DashingDerby } from './components/svg/DashingDerby';
import { Football } from './components/svg/FootBall';
import { SmartPlay } from './components/svg/SmartPlay';
import { CircleDraw } from './components/svg/CircleDraw';
import { LuckyLoot } from './components/svg/LuckLoot';
import { CarRacing } from './components/svg/CarRacing';
import { FaShuffle } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import NumberPicker from './components/NumberPicker';

function App() {

  return (
    <div className='bg-white'>
      <div className='header-container bg-slate-200 items-center pl-4 pr-4 flex justify-between'>
        <div className='text-xl text-black font-bold'>
          CASHIER
        </div>
        <div className='flex gap-4 justify-center w-full p-4'>
          <button className='p-2 bg-green-600 text-white rounded-md'>
            Cashier Options
          </button>
          <button className='p-2 flex items-center gap-1 bg-blue-800 text-white rounded-md'>
            <span className='pl-2'>Redeem</span>
            <GiConfirmed size={20} />
          </button>
          <button className='p-2 flex items-center gap-1 bg-yellow-600 text-white rounded-md'>
            <span className='pl-2'>Cancel</span>
            <TiCancel size={20} />
          </button>
        </div>
        <div className='flex items-center justify-center'>
          <div className='w-80 flex justify-end flex-col items-end'>
            <p>cashier.one</p>
            <p className='text-xs'>2024-10-10 10:40:10 P.M</p>
          </div>
          <a className='ml-4 bg-red-400 p-2 text-white rounded-md hover:bg-red-500 cursor-pointer' href="#">Logout</a>
        </div>
      </div>
      <div className='border-gray-300 border-t-4 p-4 flex justify-between'>

        <div className='left gap-4'>
          <div className="buttons flex gap-4">
            <button className="text-amber-700 hover:text-amber-600 w-8">
              <DashingDerby />
            </button>
            <button className="text-amber-700 hover:text-amber-600 w-8">
              <Football />
            </button>
            <button className="text-amber-700 hover:text-amber-600 w-8">
              <Jaguar />
            </button>
            <button className="text-amber-600 ml-4 hover:text-amber-600 w-8">
              <SmartPlay />
            </button>
            <button className="text-amber-700 hover:text-amber-600 w-8">
              <CircleDraw />
            </button>
            <button className="text-amber-700 hover:text-amber-600 w-8">
              <LuckyLoot />
            </button>
            <button className="text-amber-700 hover:text-amber-600 w-8">
              <CarRacing />
            </button>
          </div>
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
              <div className='mid-row flex items-center content-center mt-2 gap-3'>
                <div className='bg-green-500 p-2 text-sm rounded-md flex items-center gap-3 rounded-br-md text-white'>QUICK PICK <span className='text-black rounded-md bg-gray-400'>
                  <select>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
                      return <option key={index} className='bg-gray-500 text-white'>{item}</option>
                    })}
                  </select>
                </span>
                  <span><FaShuffle /></span></div>
                <div className='bg-amber-600 p-2 text-sm rounded-md rounded-br-md text-white'>HEADS
                  <span className='text-white p-1 pl-2 pr-2 ml-16 bg-black rounded-md bg-gray-400'>
                    2
                  </span>
                </div>
                <div className='bg-red-400 p-2 text-sm rounded-md rounded-br-md text-white'>EVENS
                  <span className='text-white p-1 pl-2 pr-2 ml-16 bg-black rounded-md bg-gray-400'>
                    4
                  </span>
                </div>
                <div className='bg-orange-500 p-2 text-sm rounded-md rounded-br-md text-white'>TAILS
                  <span className='text-white p-1 pl-2 pr-2 ml-16 bg-black rounded-md bg-gray-400'>
                    2
                  </span>
                </div>
              </div>
              <div className="number-picker mt-4">
                <NumberPicker />
              </div>
            </div>
            <div className="picker-right-slip mr-2 mt-2">
              <button className='flex items-center gap-3 bg-red-500 text-white rounded-md p-2'>CLEAR <span><RiDeleteBin6Line /></span> </button>
              <button className='p-3 rounded-md bg-green-600 text-white text-lg mt-2'>
                ADD TO BETSLIP
              </button>
              <div className="slip-container w-80 mt-3 flex flex-col flex-shrink-0">
                <div className='slip-head bg-amber-500 text-smbg-amber-500 p-2'>
                  HIGHEST PAYOUT FROM 7
                </div>
                <div className='slip-head border-b-2 border-amber-300 pl-10 pr-10 text-white flex justify-between items-center bg-yellow-800 p-1.5'>
                  <span>1</span>
                  <span>4</span>
                </div>
                <div className='slip-head border-b-2 border-amber-300 pl-10 pr-10 text-white flex justify-between items-center bg-yellow-800 p-1.5'>
                  <span>2</span>
                  <span>15</span>
                </div>
                <div className='slip-head border-b-2 border-amber-300 pl-10 pr-10 text-white flex justify-between items-center bg-yellow-800 p-1.5'>
                  <span>3</span>
                  <span>35</span>
                </div>
                <div className='slip-head border-b-2 border-amber-300 pl-10 pr-10 text-white flex justify-between items-center bg-yellow-800 p-1.5'>
                  <span>4</span>
                  <span>100</span>
                </div>
                <div className='slip-head border-b-2 border-amber-300 pl-10 pr-10 text-white flex justify-between items-center bg-yellow-800 p-1.5'>
                  <span>4</span>
                  <span>100</span>
                </div>
                <div className='slip-head border-b-2 border-amber-300 pl-10 pr-10 text-white flex justify-between items-center bg-yellow-800 p-1.5'>
                  <span>4</span>
                  <span>100</span>
                </div>

                <div className='slip-footer pl-10 pr-10 text-black flex justify-between items-center p-1.5'>
                  <span>Hits</span>
                  <span>Wins</span>
                </div>
              </div>
            </div>
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

      <div className='bg-white h-full'>

      </div>
    </div>
  )
}

export default App
