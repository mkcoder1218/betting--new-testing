import React from 'react'
import { CircleDraw } from '../components/svg/CircleDraw';
import { MapRedAndBlack } from '../utils/redblackMap';

interface SpinProp{
    gameData?:any
}
function ResultforSpin(prop: SpinProp) {

  return (
    <>
      <div className=" w-full items-start">
        <div className="flex items-center w-full mb-5 gap-2">
          <CircleDraw />
          <p>{prop.gameData.StartDateTimeAsWords}</p>
        </div>
        <div className="borderLine"></div>
        <div className="mt-5 w-full text-center">
          <p className="text-xl">RESULTS</p>
        </div>
        <div className="w-full flex items-center justify-center mt-2 mb-3">
          <div
            className={`${
              MapRedAndBlack.Red.includes(
                Number(prop.gameData.MarketResults[0].WinningSelections[0])
              )
                ? "bg-red-600"
                : MapRedAndBlack.Black.includes(
                    Number(prop.gameData.MarketResults[0].WinningSelections[0])
                  )?'bg-black':'bg-green-700'
            } w-7 h-7 flex items-center justify-center text-white rounded-2xl`}
          >
            <p>{prop.gameData.MarketResults[0].WinningSelections[0]}</p>
          </div>
        </div>
        <div className="borderLine"></div>
      </div>
    </>
  );
}

export default ResultforSpin